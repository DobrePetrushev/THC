'use strict';

const uuidV1 = require('uuid/v1');
const AWS = require('aws-sdk');
const promisify = require('es6-promisify');
const _ = require('lodash');
const dynamo = new AWS.DynamoDB.DocumentClient();



module.exports.saveUserFactToDatabase = function(userId, factId) {
  console.log('saveUserToDatabase');
  const item = {};
  item.userId = userId;
  item.factid = factId;
  return saveItemToTable('fact-user-table', item);
};

module.exports.findUserFactsId = function(userId) {
  const params = {
    TableName: 'fact-user-table',
    Key: {
      userId
    }
  };

  const getAsync = promisify(dynamo.get, dynamo);

  return getAsync(params).then(response => {
    if (_.isEmpty(response)) {
      console.log(`User with userId:${userId} facts not found`);
      return Promise.reject(new Error(`User with userId:${userId} not found`));
    }
    conosole.log(response);
    return response.Item;
  });
};



module.exports.findFactsCount = function() {
 const params = {
    TableName: 'cannabis_facts',
    Select: 'COUNT'
  };

  const getAsync = promisify(dynamo.scan, dynamo);

  return getAsync(params).then(response => {
    if (_.isEmpty(response)) {
      console.log(`facts count not found`);
      return Promise.reject(new Error(`facts count not found`));
    }
    return response.Count;
  });
};



module.exports.findFactsId = function(id) {
  const params = {
    TableName: 'cannabis_facts',
    Key: {
      id
    }
  };

  const getAsync = promisify(dynamo.get, dynamo);

  return getAsync(params).then(response => {
    if (_.isEmpty(response)) {
      console.log(`fact cannot be found`);
      return Promise.reject(new Error(`fact cannot be found`));
    }
    console.log(response);
    return response.Item;
  });
};



function saveItemToTable(tableName, item) {
  const params = {
    TableName: tableName,
    Item: item
  };

  const putAsync = promisify(dynamo.put, dynamo);

  return putAsync(params)
    .then(() => {
      console.log(`Saving item ${JSON.stringify(item)}`);
      return item;
    })
    .catch(error => {
      Promise.reject(error);
    });
}