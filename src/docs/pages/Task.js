exports.title = 'Task'
exports.description = 'This page covers everything related to Task'

exports.content = [
  div('Get All Tasks', 'get', '/tasks'),

  div('Create Task', 'post', '/tasks', {
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
        key: 'participants',
        type: Array,
      },
    ],
  }),

  div('Update Task', 'patch', '/tasks/{task_id}', {
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

  div('Add Category', 'post', '/tasks/{task_id}/category', {
    body: [
      {
        key: 'category',
        require: true,
        type: String,
        des: 'Category ID',
      },
    ],
  }),

  div('Delete Category', 'delete', '/tasks/{task_id}/category/{category_id}'),

  div('Invite Participants', 'post', '/tasks/{task_id}/participants', {
    body: [
      {
        key: 'user',
        type: String,
        required: true,
        des: 'Participant Id',
      },
    ],
  }),

  div('Remove Participant', 'delete', '/tasks/{task_id}/participants/{user}'),

  div(
    'Change Participant Role',
    'patch',
    '/tasks/{task_id}/participants/{user}',
    {
      body: [
        {
          key: 'role',
          type: String,
          require: true,
          des: 'admin | moderator | assigner',
        },
      ],
    }
  ),
]
