const ACCESS_KEY_ID = 'your_access_key';
const SECRET_ACCESS_KEY_ID = 'your_secret_access_key';
const REGION = 'your_region';

// AWS Configuration object http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
const globalAWSConfig = {
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: SECRET_ACCESS_KEY_ID,
  region: REGION,
};

module.exports = globalAWSConfig;
