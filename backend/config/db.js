const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    console.log('CONNECTING TO MONGODB...')
    console.log(process.env.MONGO_URI)

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MONGODB CONNECTION ERROR:')
    console.error(error)

    process.exit(1)
  }
}

module.exports = connectDB