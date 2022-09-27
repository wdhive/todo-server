const errorMessages = require('../utils/error-messages')

exports.email = {
  type: String,
  required: [true, errorMessages.email.fieldMissing[0]],
  unique: [true, errorMessages.email.duplicate[0]],
  lowercase: true,
  match: [
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    'Please fill a valid email address',
  ],
}
