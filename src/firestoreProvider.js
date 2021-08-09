import {
  GET_LIST,
  GET_ONE,
  CREATE,
  UPDATE,
  UPDATE_MANY,
  DELETE,
  DELETE_MANY,
  GET_MANY,
  GET_MANY_REFERENCE,
} from 'react-admin';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const firebase = require("firebase/app");
require("firebase/firestore");
firebase.initializeApp(config);
let db = firebase.firestore();
let storage = firebase.storage();
let storageRoot = storage.ref();


function isObject(x) {
  return !!x && typeof x == 'object';
}

/**
 * Utility function to parse Firestore objects
 *
 * @param {doc} DocumentSnapshot Firestore document snapshot
 * @returns {Object} the DocumentSnapshot.data() with an additionnal "Id" attribute
 */
function parseFirestoreDocument(doc) {
  const data = doc.data();
  for (let key of Object.keys(data)) {
    const value = data[key];
    if (!isObject(value)) continue;
    const isTimestamp = !!value.toDate && typeof value.toDate === 'function';
    if (isTimestamp) {
      data[key] = value.toDate();
    }
  }
  return { id: doc.id, ...data };
}


/**
 * Utility function to upload a file in a Firebase storage bucket
 *
 * @param {File} rawFile the file to upload
 * @param {File} storageRef the storage reference
 * @returns {Promise}  the promise of the URL where the file can be download from the bucket
 */
async function uploadFileToBucket(rawFile, storageRef) {
  return storageRef.put(rawFile)
    .then(snapshot => {
      return storageRef.getDownloadURL();  // add url
    })
    .catch((error) => {
      console.log(error);
      throw new Error({ message: error.message_, status: 401 })
    });
}


/**
 * Utility function to create or update a file in Firestore
 *
 * @param {String} resource resource name, will be used as a directory to prevent an awful mess in the bucket
 * @param {File} rawFile the file to upload if it is not already there
 * @param {Function} uploadFile the storage reference
 * @returns {Promise}  the promise of the URL where the file can be download from the bucket
 */
async function createOrUpdateFile(resource, rawFile, uploadFile) {
  console.log("Beginning upload file to storage bucket for file :", rawFile.name);
  let storageRef = storageRoot.child(resource + '/' + rawFile.name);
  // Check if the file already exist (same name, same size)
  // In this case, no need to upload
  return storageRef.getMetadata()
    .then(metadata => {
      console.log(metadata)
      if (metadata && metadata.size === rawFile.size) {
        console.log("file already exists");
        return storageRef.getDownloadURL();
      } else {
        return uploadFile(rawFile, storageRef)
      }
    })
    .catch(() => uploadFile(rawFile, storageRef));
}

function sortData(data, field, order) {
  data.sort((a, b) => {
    const x = order.toUpperCase() === 'ASC' ? a[field] : b[field];
    const y = order.toUpperCase() === 'ASC' ? b[field] : a[field];
    const type = typeof x;
    switch (type) {
      case 'string':
        return x.localeCompare(y, undefined, { numeric: true });
      case 'object':
      default:
        return x - y;
    }
  });
}

export async function dataProvider(type, resource, params) {
  function applyFirestoreFilter(query, filter, key) {
    return query.where(key, '==', filter[key]);
  }

  function applyDataFilter(filter, doc) {
    for (let key of Object.keys(filter)) {
      const value = filter[key];
      const split = key.split('|');
      const keyword = split[0];
      const op = split[1];
      if (op === 'nonemptyresponse' && value) {
        return doc[keyword].length > 5;
        // return !!doc[keyword];
      }
    }
    return true;
  }

  // Firestore filters are as usual, data filters have a '$' in front
  function splitFilters(filter) {
    const firestoreFilter = {};
    const dataFilter = {};
    for (let key of Object.keys(filter)) {
      const value = filter[key];
      if (key[0] !== '$') {
        firestoreFilter[key] = value;
      } else {
        key = key.slice(1);
        dataFilter[key] = value;
      }
    }
    return { firestoreFilter, dataFilter };
  }

  switch (type) {
    case GET_LIST: {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const filter = params.filter;
      const { firestoreFilter, dataFilter } = splitFilters(filter);

      let query = db.collection(resource);
      query = Object.keys(firestoreFilter).reduce((q, key) => applyFirestoreFilter(q, firestoreFilter, key), query);
      const querySnapshot = await query.get();
      const allData = querySnapshot.docs.map(doc => parseFirestoreDocument(doc));
      const filteredData = allData.filter(doc => applyDataFilter(dataFilter, doc));

      // If we want a cache, do it here. Cache by:
      // - 'resource'
      // - 'filter' with its keys and values, if any
      // do cache invalidation frequently + add refresh option

      sortData(filteredData, field, order);
      const data = filteredData.slice((page - 1) * perPage, page * perPage);
      const total = filteredData.length;

      return { data, total }
    }

    case GET_ONE: {
      try {
        const doc = await db.collection(resource).doc(params.id).get();
        if (!doc.exists) {
          throw new Error('Document does not exist');
        }
        return { data: parseFirestoreDocument(doc) };
      } catch (err) {
        throw new Error({ message: err, status: 404 });
      }
    }

    case UPDATE:
    case CREATE: {
      // Check if there is a file to upload
      let listOfFiles = Object.keys(params.data).filter(key => params.data[key].rawFile)
      return Promise
        .all(
          listOfFiles.map(key => {
            // Upload file to the Storage bucket
            return createOrUpdateFile(resource, params.data[key].rawFile, uploadFileToBucket)
              .then(downloadURL => {
                return { key: key, downloadURL: downloadURL }
              })
          }))
        .then(arrayOfResults => {
          arrayOfResults.map((keyAndUrl) => {
            // Remove rawFile attr as it will raise an error when setting the data
            delete params.data[keyAndUrl.key].rawFile;
            // Set the url to get the file
            params.data[keyAndUrl.key].downloadURL = keyAndUrl.downloadURL;
            return params.data
          });

          if (type === CREATE) {
            console.log("Creating the data");
            return db.collection(resource)
              .add(params.data)
              .then(DocumentReference =>
                DocumentReference
                  .get()
                  .then(DocumentSnapshot => { return { data: parseFirestoreDocument(DocumentSnapshot) } })
              )
          }

          if (type === UPDATE) {
            console.log("Updating the data");
            return db.collection(resource)
              .doc(params.id)
              .set(params.data)
              .then(() => { return { data: params.data } })
          }
        });
    }

    case UPDATE_MANY: {
      // Will crash if there is a File Input in the params
      // TODO
      return params.ids.map(id =>
        db.collection(resource)
          .doc(id)
          .set(params.data)
          .then(() => id)
      );
    }

    case DELETE: {
      return db.collection(resource)
        .doc(params.id)
        .delete()
        .then(() => { return { data: params.previousData } });
    }

    case DELETE_MANY: {
      return {
        data: params.ids.map(id =>
          db.collection(resource)
            .doc(id)
            .delete()
            .then(() => id)
        )
      };
    }

    case GET_MANY: {
      // Do not use FireStore Ref because react-admin will not be able to create or update
      // Use a String field containing the ID instead
      return Promise
        .all(params.ids.map(id => db.collection(resource).doc(id).get()))
        .then(arrayOfResults => {
          return {
            data: arrayOfResults.map(documentSnapshot => parseFirestoreDocument(documentSnapshot))
          }
        });
    }

    case GET_MANY_REFERENCE: {
      const { target, id } = params;
      const { field, order } = params.sort;
      return db.collection(resource)
        .where(target, "==", id)
        .orderBy(field, order.toLowerCase())
        .get()
        .then(QuerySnapshot => {
          return {
            data: QuerySnapshot.docs.map(DocumentSnapshot => parseFirestoreDocument(DocumentSnapshot)),
            total: QuerySnapshot.docs.length
          }
        });
    }

    default: {
      throw new Error(`Unsupported Data Provider request type ${type}`);
    }
  }
};
