const generator = require('../generator')

exports.title = 'User'
exports.description =
  'This page covers everything related to user'

exports.content = [
  generator('Get User', 'get', '/account', {
    query: [
      {
        key: 'settings',
        type: String,
      },
    ],
  }),

  generator('Update User', 'patch', '/account', {
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

  generator('Delete User', 'delete', '/account', {
    body: [
      {
        key: 'password',
        type: String,
        required: true,
      },
    ],
  }),

  generator('Change Thene', 'patch', '/account/change-theme', {
    body: [
      {
        key: 'theme',
        type: String,
        des: 'Light/Dark',
      },
      // TODO: @nazmussayad
      {
        key: 'hue',
        type: Number,
        des: 'between 0-360',
      },
    ],
  }),

  generator('Add Task Category', 'post', '/account/task-category', {
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

  generator(
    'Update Task Category',
    'patch',
    '/account/task-category/{category_id}',
    {
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
    }
  ),

  generator(
    'Delete Task Category',
    'delete',
    '/account/task-category/{category_id}'
  ),
]
