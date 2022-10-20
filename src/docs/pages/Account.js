exports.title = 'Account'
exports.description = 'This page covers everything related to authentication'

exports.content = [
  div(
    'Get an OTP to verify your email',
    'post',
    '/account/request-email-verify',
    {
      body: {
        email$: String,
      },
    }
  ),

  div('Signup', 'post', '/account/signup', {
    body: {
      email$: String,
      username$: String,
      name$: String,
      avatar: String,
      password$: String,
      code$: String,
    },
  }),

  div('Login', 'post', '/account/login', {
    body: {
      login$: [String, 'login should contain `email` or `username`'],
      password$: String,
    },
  }),

  div('Forget Password', 'post', '/account/password-forget', {
    body: {
      login$: [String, 'login should contain `email` or `username`'],
    },
  }),

  div('Reset Password', 'post', '/account/password-reset', {
    body: {
      login$: [String, 'login should contain `email` or `username`'],
      code$: [String, 'The code you received in the email'],
      new_password$: String,
    },
  }),

  div('Update Email', 'patch', '/account/change-email', {
    body: {
      password$: String,
      new_email$: [String, 'new email'],
      code$: [String, 'The code you received in the email'],
    },
  }),

  div('Update Username', 'patch', '/account/change-username', {
    body: {
      password$: [String, 'current password'],
      new_username$: [String, 'new username'],
    },
  }),

  div('Update Password', 'patch', '/account/change-password', {
    body: {
      password$: [String, 'current password'],
      new_password$: [String, 'new password'],
    },
  }),
]
