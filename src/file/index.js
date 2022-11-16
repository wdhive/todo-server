const fs = require('fs')
const path = require('path')
const cloudinaryMain = require('cloudinary')
const { upload, destroy } = cloudinaryMain.v2.uploader
const tempDir = path.join(__dirname, './.temp')

cloudinaryMain.config({
  cloud_name: process.env.C_CLOUD_NAME,
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_API_SECRET,
})

const cloudinaryOptions = {
  unique_filename: true,
  folder: 'avatar',
  resource_type: 'image',
  allowed_formats: ['png', 'jpg', 'webp', 'jpeg', 'svg'],
  transformation: [
    {
      width: 512,
      height: 512,
      gravity: 'auto',
      crop: 'fill',
    },
    {
      fetch_format: 'webp',
    },
  ],
}

const save = async ({ originalname, path: oldPath }) => {
  const filePath = oldPath + '-' + originalname.replace(/ /gim, '-')
  fs.renameSync(oldPath, filePath)

  const data = await upload(filePath, cloudinaryOptions)
  fs.rmSync(filePath)

  return data.secure_url ?? data.url
}

const remove = async (url) => {
  if (!url) return
  const publicId = url.match(/(avatar\/\w*)(\.\w*)$/)[1]
  await destroy(publicId)
}

exports.save = save
exports.remove = remove

exports.updateFile = async ({ file }, user) => {
  if (!file) return
  const newUrl = await save(file)
  if (user.avatar) await remove(user.avatar)
  user.avatar = newUrl
}

exports.fileMiddleware = require('multer')({
  dest: tempDir,
  limits: {
    fileSize: 1000000,
  },
}).single('avatar')
