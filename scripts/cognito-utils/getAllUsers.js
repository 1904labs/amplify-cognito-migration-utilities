// Cognito paginates users to return 60. We must loop through paginated results to grab all users
const getAllUsers = async (params) => {
  try {
    // string must not be empty
    let paginationToken = 'notEmpty';
    let itemsAll = {
      Users: [],
    };
    while (paginationToken) {
      const data = await cognitoIdentityServiceProvider
        .listUsers(params)
        .promise();

      const { Users } = data;
      itemsAll = {
        ...data,
        ...{ Users: [...itemsAll.Users, ...(Users ? [...Users] : [])] },
      };
      paginationToken = data.PaginationToken;
      if (paginationToken) {
        params.PaginationToken = paginationToken;
      }
    }
    return itemsAll;
  } catch (err) {
    console.error('Unable to scan the cognito pool users. Error JSON:', err);
  }
};

module.exports = getAllUsers;
