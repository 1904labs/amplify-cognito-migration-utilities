# Amplify Cognito Migration Utilities
## _Cognito User Pool Migration For The Amplify Lover ❤️_

A collection of utility functions that allow you to quickly and easily migrate Cognito user pools in your Amplify project using the AWS recommended CSV bulk upload method

## Files & Features

- cognito-csv-exporter.js creates a CSV file containing your Cognito user base with the appropriate headers for the pool you are migrating too
- copyDynamoTable.js easily copies data from one DynamoDB table to another
- deleteCognitoUsers.sh deletes all users in a Cognito user pool for easy testing purposes
- updateTablesToNewUsers.js loops through all specified DynamoDB tables to update fields with the newly created Cognito user pool user's sub ID to complete a migration

## Usage

globalAWSConfig.js needs to be updated with your personal project's accessKeyId, secretAccessKey, and region variables respectively.

When running a file, update the @TODO comments to contain the data neccessary for your application. Each file has these @TODO comments to specify an action that you must take to make the file work.

To run a file use the `node` command. For example, if you want to run the cognito-csv-exporter.js file run `node cognito-csv-exporter.js`
