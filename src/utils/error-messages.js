const errorMessages = {
  email: {
    fieldMissing: ['User must give an email', 400],
    duplicate: ['Another account is associated with this email', 400],
  },
  name: {
    fieldMissing: ['User must give an name', 400],
  },
  username: {
    fieldMissing: ['User must give an username', 400],
    duplicate: ['Another account is associated with this username', 400],
  },
  password: {
    fieldMissing: ["Didn't receive a password", 400],
    wrong: ["The password you've entered is incorrect", 400],
  },
  user: {
    notFound: ['User could not be found', 404],
    deleted: ['User no longer exixts', 401], // This will logout if logged in
  },
  auth: {
    jwtExpire: ['Your token is no longer valid', 401], // This will logout if logged in
    failed: ['Login credentials are incorrect', 401], // This will logout if logged in
    invalid: ['Login credentials are invalid', 401], // This will logout if logged in
  },
  otp: {
    notExists: ['User never requested for OTP', 400],
    wrong: ['OTP did not match', 400],
    invalid: ['Invalid OTP input', 400],
  },

  extra: {
    findWithEmailAndPassword: [
      'Email and Username cannot be present at the same time',
      400,
    ],
    enteredExistingInfo(type) {
      return ["You've entered your existing " + type, 400]
    },
  },
}

module.exports = errorMessages
