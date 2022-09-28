const generator = require('../generator')

exports.title = 'Task'
exports.description = 'This page covers everything related to Task'

exports.content = [
  generator('Get All Tasks', 'get', '/tasks'),

  generator('Create Task', 'post', '/tasks', {
    body: [
      {
        key: 'title',
        required: true,
        type: String,
      },
      {
        key: 'description',
        required: true,
        type: String,
      },
      {
        key: 'pendingParticipants',
        type: Array,
      },
    ],
  }),

  generator('Update Task', 'patch', '/tasks/{task_id}', {
    body: [
      {
        key: 'title',
        type: String,
      },
      {
        key: 'description',
        type: String,
      },
      {
        key: 'completed',
        type: Boolean,
      },
    ],
  }),

  generator('Add Category', 'post', '/tasks/{task_id}/category', {
    body: [
      {
        key: 'category',
        require: true,
        type: String,
        des: 'Category ID',
      },
    ],
  }),

  generator(
    'Delete Category',
    'delete',
    '/tasks/{task_id}/category/{category_id}'
  ),

  generator('Invite Participants', 'post', '/tasks/{task_id}/participants', {
    body: [
      {
        key: 'participant',
        type: String,
        required: true,
        des: 'i am confused just as much as you',
      },
    ],
  }),

  generator(
    'Remove Participant',
    'delete',
    '/tasks/{task_id}/participants/{participantId}'
  ),

  generator(
    'Change Participant Role',
    'patch',
    '/tasks/{task_id}/participants/{participantId}',
    {
      body: [
        {
          key: 'role',
          type: String,
          require: true,
          des: 'admin | mod | assigner',
        },
      ],
    }
  ),
]
