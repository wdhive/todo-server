exports.title = 'Task'
exports.description = 'This page covers everything related to Task'

exports.content = [
  div('Get All Tasks', 'get', '/tasks'),

  div('Create Task', 'post', '/tasks', {
    body: {
      title$: String,
      description$: String,
      participants: Array,
    },
  }),

  div('Update Task', 'patch', '/tasks/{task_id}', {
    body: {
      title: String,
      description: String,
      startingDate: Date,
      endingDate: Date,
    },
  }),

  div('Delete Task', 'delete', '/tasks/{task_id}'),

  div('Complete Task', 'patch', '/tasks/{task_id}/complete'),
  div('Uncomplete Task', 'patch', '/tasks/{task_id}/uncomplete'),

  div('Invite Participants', 'post', '/tasks/{task_id}/participants', {
    body: {
      user$: [String, 'Participant Id'],
    },
  }),

  div('Remove Participant', 'delete', '/tasks/{task_id}/participants/{user}'),

  div(
    'Change Participant Role',
    'patch',
    '/tasks/{task_id}/participants/{user}',
    {
      body: {
        role$: [String, 'admin | moderator | assigner'],
      },
    }
  ),
]
