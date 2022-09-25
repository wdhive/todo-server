exports.fail = (status, message) => {
  return {
    status,
    message,
  }
}

exports.success = data => {
  return {
    status: 'success',
    data,
  }
}
