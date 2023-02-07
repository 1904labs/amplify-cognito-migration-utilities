exports.userToCsvHeader = (users) => {
  const convertedUsers = [];

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const { Username, Attributes, UserLastModifiedDate } = user;
    console.log(user);

    const dateTime = new Date(UserLastModifiedDate);

    // Update this to transfer whatever attributes are needed from the previous user pool to the new pool

    if (Attributes[1].Value === 'true') {
      convertedUsers.push([
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        Attributes[2].Value,
        Attributes[1].Value,
        '',
        '',
        '',
        '',
        '',
        'false',
        '',
        dateTime.getTime(),
        Attributes[0].Value,
        Username,
        'false',
        Attributes[2].Value,
      ]);
    }
  }

  return convertedUsers;
};
