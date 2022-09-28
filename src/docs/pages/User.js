exports.title = 'User'
exports.description = 'This page covers everything related to user'

exports.content = [
  div('Get User', 'get', '/user', {
    query: [
      {
        key: 'settings',
        type: String,
      },
    ],
  }),

  div('Update User', 'patch', '/user', {
    body: [
      {
        key: 'name',
        type: String,
      },
      {
        key: 'image',
        type: String,
      },
    ],
  }),

  div('Delete User', 'delete', '/user', {
    body: [
      {
        key: 'password',
        type: String,
        required: true,
      },
    ],
  }),

  div('Change Thene', 'patch', '/user/change-theme', {
    body: [
      {
        key: 'theme',
        type: String,
        des: 'Light/Dark',
      },
      {
        key: 'hue',
        type: Number,
        des: 'between 0-360',
      },
    ],
  }),

  div('Add Task Category', 'post', '/user/task-category', {
    body: [
      {
        key: 'name',
        type: String,
        required: true,
      },
      {
        key: 'hue',
        type: Number,
        required: true,
        des: 'between 0-360',
      },
    ],
  }),

  div('Update Task Category', 'patch', '/user/task-category/{category_id}', {
    body: [
      {
        key: 'name',
        type: String,
      },
      {
        key: 'hue',
        type: Number,
        des: 'between 0-360',
      },
    ],
  }),

  div('Delete Task Category', 'delete', '/user/task-category/{category_id}'),
]
