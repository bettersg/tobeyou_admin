import React from 'react';

const CustomEmailField = ({ record = {}, source }) => {
  return (
    <a href={"mailto:" + record[source]}>
      {record[source]}
    </a>
  );
}

export default CustomEmailField;
