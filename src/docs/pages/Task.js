exports.title = 'Task'
exports.description = 'This page covers everything related to Task'

exports.content = [
  div('Get All Tasks', 'get', '/tasks'),

  div('Create Task', 'post', '/tasks', {
    body: {
      title$: String,
      description$: String,
      startingDate: Date,
      endingDate: Date,
      participants: Array,
      collection: String,
    },
  }),

  div('Update Task', 'patch', '/tasks/:taskId', {
    body: {
      title: String,
      description: String,
      startingDate: Date,
      endingDate: Date,
      participants: Array,
      collection: String,
    },
  }),

  div('Delete Task', 'delete', '/tasks/:taskId'),

  div('Complete Task', 'patch', '/tasks/:taskId/complete'),
  div('Uncomplete Task', 'patch', '/tasks/:taskId/uncomplete'),

  div('Remove Participant', 'delete', '/tasks/:taskId/participants/{user}'),

  div(
    'Change Participant Role',
    'patch',
    '/tasks/:taskId/participants/:userId',
    {
      body: {
        role$: [String, 'admin | assigner'],
      },
    }
  ),
]
