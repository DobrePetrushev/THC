'use strict';

const uuidV1 = require('uuid/v1');
var AWS = require('aws-sdk');
const promisify = require('es6-promisify');
const _ = require('lodash');
AWS.config.region = 'us-east-1';
const dynamo = new AWS.DynamoDB.DocumentClient();



function findUserFactsId() {
  const params = {
    TableName: 'fact-user-table',
    Key: {
      id
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


function findFactsCount() {
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
  //  console.log(response.Count);
    return response.Count;
  });
};

var factCount = 0;


findFactsCount()
        .then(item => {
           factCount = item;
           console.log('factCount : ' + factCount );
        })
        .catch(error => {
            console.log(error);
        });
