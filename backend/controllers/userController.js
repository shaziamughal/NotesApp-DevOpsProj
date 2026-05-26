const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log('REGISTER BODY:', req.body)

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400)
      throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      res.status(400)
      throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    if (user) {
      console.log('USER REGISTERED SUCCESSFULLY')

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }
  } catch (err) {
    console.log('REGISTER ERROR:')
    console.log(err)

    res.status(res.statusCode || 500)

    throw new Error(err.message)
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    console.log('LOGIN BODY:', req.body)

    const { email, password } = req.body

    // Check for user email
    const user = await User.findOne({ email })

    console.log('FOUND USER:', user)

    if (!user) {
      res.status(400)
      throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    console.log('PASSWORD MATCH:', isMatch)

    if (isMatch) {
      console.log('LOGIN SUCCESS')

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      })
    } else {
      res.status(400)
      throw new Error('Invalid credentials')
    }
  } catch (err) {
    console.log('LOGIN ERROR:')
    console.log(err)

    res.status(res.statusCode || 500)

    throw new Error(err.message)
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (err) {
    console.log('GET ME ERROR:')
    console.log(err)

    res.status(500)

    throw new Error(err.message)
  }
})

// Generate JWT
const generateToken = (id) => {
  console.log('JWT_SECRET EXISTS:', !!process.env.JWT_SECRET)

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
}