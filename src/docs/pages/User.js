exports.title = 'User'
exports.description = 'This page covers everything related to user'

exports.content = [
  div('Get a new token', 'get', '/user/new-token'),

  ,
  div('Get User', 'get', '/user', {
    query: {
      settings: [String, 'Also get the settings'],
    },
  }),

  div('Update User', 'patch', '/user', {
    body: {
      name: String,
      avatar: 'String | File(FormData)',
    },
  }),

  div('Delete User', 'patch', '/user/delete-me', {
    body: {
      password$: String,
    },
  }),

  div('Update settings', 'patch', '/user/settings', {
    body: {
      theme: [String, 'Light/Dark'],
      hue: [Number, 'between 0-360'],
    },
  }),

  div('Add Task Collection', 'post', '/user/collections', {
    body: {
      name$: String,
      hue$: [Number, 'between 0-360'],
    },
  }),

  div('Update Task Collection', 'patch', '/user/collections/{collectionId}', {
    body: {
      name: String,
      hue: [Number, 'between 0-360'],
    },
  }),

  div('Delete Task Collection', 'delete', '/user/collections/{collectionId}'),
]
