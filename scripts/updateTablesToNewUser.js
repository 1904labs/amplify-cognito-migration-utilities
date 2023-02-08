const AWS = require('aws-sdk');
const globalAWSConfig = require('../globalAWSConfig');
const getAllUsers = require('./cognito-utils/getAllUsers');

// Configure the AWS SDK with your credentials
AWS.config.update(globalAWSConfig);

// Create an instance of the AWS Cognito Identity provider client
const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

// The ID of the Cognito User Pool you want to retrieve users from
// @TODO: Enter in your value here
const USER_POOL_ID = 'example-user-pool-ID';

// Create an instance of the AWS DynamoDB client
const dynamoDB = new AWS.DynamoDB();

// The name of the DynamoDB table you want to update
// @TODO: Enter in your values here
const EXAMPLE_TABLE_NAME_1 = 'Receipt-example-staging';
const EXAMPLE_TABLE_NAME_2 = 'Vehicle-example-staging';
const EXAMPLE_TABLE_NAME_3 = 'User-example-staging';

// Define a function to update the cognitoUsername field for a single entry in the DynamoDB table
const updateCognitoItem = async (item, newSubID, tableName, fieldName) => {
  const idIndex = Object.keys(item).findIndex((it) => it === 'id');

  const params = {
    TableName: tableName,
    Key: {
      // The primary key of the entry you want to update
      [Object.keys(item)[idIndex]]: {
        S: Object.values(item)[idIndex].S,
      },
    },
    UpdateExpression: `SET ${fieldName} = :userID`,
    ExpressionAttributeValues: {
      ':userID': {
        S: newSubID,
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    // Call the DynamoDB updateItem method to update the cognitoUsername field
    await dynamoDB.updateItem(params).promise();
  } catch (err) {
    console.log(
      `Unable to update dynamoDB item with ID ${
        Object.values(item)[idIndex].S
      }:`,
      err
    );
  }
};

// Define a function to retrieve all entries from the DynamoDB table
const getAllItems = async (users, tableName, fieldName) => {
  const vehicleParams = {
    TableName: tableName,
  };

  // Call the DynamoDB scan method to retrieve all entries from the table
  dynamoDB.scan(vehicleParams, async (error, data) => {
    if (error) {
      console.error(`Error retrieving items from table ${tableName}:`, error);
    } else {
      // Loop through the items and update the cognitoUsername field for each one

      for (const item of data.Items) {
        const cognitoUsername = users.find((user) => {
          const { Attributes } = user;

          const subIDIndex = Attributes.findIndex(
            (attr) => attr.Name === 'custom:prev_sub_id'
          );

          return Attributes[subIDIndex].Value === item[fieldName].S;
        });

        if (cognitoUsername && fieldName === 'userID') {
          const newSubID = cognitoUsername.Attributes.find(
            (it) => it.Name === 'sub'
          ).Value;

          updateCognitoItem(item, newSubID, tableName, fieldName);
        }
      }
    }
  });
};

const init = async () => {
  const params = {
    USER_POOL_ID: USER_POOL_ID,
  };

  const allUsers = await getAllUsers(params);

  // Call the getAllItems function to retrieve all entries from the DynamoDB table
  // and update the items with the new subID of the migrated users
  // repeat this for as many tables as needed
  await getAllItems(allUsers.Users, EXAMPLE_TABLE_NAME_1, 'userID');

  await getAllItems(allUsers.Users, EXAMPLE_TABLE_NAME_2, 'userID');

  await getAllItems(allUsers.Users, EXAMPLE_TABLE_NAME_3, 'userID');
};

init();
