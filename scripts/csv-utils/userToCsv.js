exports.userToCsvHeader = (users) => {
  const convertedUsers = [];

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const { Username, Attributes, UserLastModifiedDate } = user;

    const dateTime = new Date(UserLastModifiedDate);

    // Cognito User Pools have a rigid CSV structure that must contain empty strings ('') for empty values

    // This is the structure of my example user pool
    // name,
    // given_name,
    // family_name,
    // middle_name,
    // nickname,
    // preferred_username,
    // profile,
    // picture,
    // website,
    // email,
    // email_verified,
    // gender,
    // birthdate,
    // zoneinfo,
    // locale,
    // phone_number,
    // phone_number_verified,
    // address,
    // updated_at,
    // custom:prev_sub_id,
    // custom:prev_username,
    // cognito:mfa_enabled,
    // cognito:username

    // Update this to transfer whatever attributes are needed from the previous user pool to the new pool
    if (Attributes[1].Value === 'true') {
      convertedUsers.push([
        // name
        '',
        // given_name
        '',
        // family_name
        '',
        // middle_name
        '',
        // nickname
        '',
        // preferred_username
        '',
        // profile
        '',
        // picture
        '',
        // website
        '',
        // email
        Attributes[2].Value,
        // email_verified
        Attributes[1].Value,
        // gender
        '',
        // birthdate
        '',
        // zoneinfo
        '',
        // locale
        '',
        // phone_number
        '',
        // phone_number_verified
        'false',
        // address
        '',
        // updated_at
        dateTime.getTime(),
        // custom:prev_sub_id
        Attributes[0].Value,
        // custom:prev_username
        Username,
        // cognito:mfa_enabled
        'false',
        // cognito:username
        Attributes[2].Value,
      ]);
    }
  }

  return convertedUsers;
};
