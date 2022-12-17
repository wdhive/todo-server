exports.title = 'Notifications'
exports.description = 'This page gives some features along notification.'

exports.content = [
  div('Get all notifications', 'get', '/notifications'),
  div('Delete all notifications', 'delete', '/notifications'),
  div('Delete one notification', 'delete', '/notifications/:notificationId'),
]
