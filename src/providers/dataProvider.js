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

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import config from '../config';

firebase.initializeApp(config);
const db = firebase.firestore();

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

export default async function dataProvider(type, resource, params) {
  // Firestore filter: input format is { key: value }
  function applyFirestoreFilter(filter, query) {
    return Object.keys(filter).reduce((q, key) => {
      return q.where(key, '==', filter[key]);
    }, query);
  }

  // Data filter: input format is { key|<op>: value }
  // - <op> = nonemptyresponse
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
      const { filter } = params;
      const { firestoreFilter, dataFilter } = splitFilters(filter);

      const query = db.collection(resource);
      const filteredQuery = applyFirestoreFilter(firestoreFilter, query);
      const querySnapshot = await filteredQuery.get();
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
        if (!doc.exists) throw new Error('Document does not exist');
        return { data: parseFirestoreDocument(doc) };
      } catch (err) {
        throw new Error({ message: err, status: 404 });
      }
    }

    case CREATE: {
      // TODO: test
      const { data } = params;
      const docReference = await db.collection(resource).add(data);
      const docSnapshot = await docReference.get();
      return { data: parseFirestoreDocument(docSnapshot) };
    }

    case UPDATE: {
      const { id, data } = params;
      await db.collection(resource).doc(id).set(data);
      return { data };
    }

    case UPDATE_MANY: {
      // TODO: test
      return {};
      // return params.ids.map(id =>
      //   db.collection(resource)
      //     .doc(id)
      //     .set(params.data)
      //     .then(() => id)
      // );
    }

    case DELETE: {
      // TODO: test
      return {};
      // return db.collection(resource)
      //   .doc(params.id)
      //   .delete()
      //   .then(() => { return { data: params.previousData } });
    }

    case DELETE_MANY: {
      // TODO: test
      return {};
      // return {
      //   data: params.ids.map(id =>
      //     db.collection(resource)
      //       .doc(id)
      //       .delete()
      //       .then(() => id)
      //   )
      // };
    }

    case GET_MANY: {
      // TODO: revise this function (this was straight-up copied)
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
      // TODO: revise this function (this was straight-up copied)
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
      throw new Error(`Unsupported data provider request type ${type}`);
    }
  }
};
