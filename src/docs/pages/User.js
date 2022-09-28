exports.title = 'User'
exports.description = 'This page covers everything related to user'

exports.content = [
  div('Get User', 'get', '/user', {
    query: {
      settings: String,
    },
  }),

  div('Update User', 'patch', '/user', {
    body: {
      name: String,
      image: String,
    },
  }),

  div('Delete User', 'delete', '/user', {
    body: {
      password$: String,
    },
  }),

  div('Change Thene', 'patch', '/user/change-theme', {
    body: {
      theme: [String, 'Light/Dark'],
      hue: [Number, 'between 0-360'],
    },
  }),

  div('Add Task Category', 'post', '/user/task-category', {
    body: {
      name$: String,
      hue$: [Number, 'between 0-360'],
    },
  }),

  div('Update Task Category', 'patch', '/user/task-category/{category_id}', {
    body: {
      name: String,
      hue: [Number, 'between 0-360'],
    },
  }),

  div('Delete Task Category', 'delete', '/user/task-category/{category_id}'),
]
