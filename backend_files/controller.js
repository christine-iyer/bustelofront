require('dotenv').config()

const { get } = require('mongoose')
const User = require('../../models/user')
const bcrypt = require('bcrypt')
const { generateToken } = require('../../utils/jwt')

const signUp = async (req, res, next) => {
     try {
          const {username, email, password} = req.body
          
          // Hash password before saving
          const hashedPassword = await bcrypt.hash(password, 10)
          
          const user = new User({
               username, 
               email, 
               password: hashedPassword
          })
          await user.save()
          
          // Generate token for immediate login
          const token = generateToken(user)
          
          res.status(201).json({
               message: "User created",
               token,
               user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
               }
          })
          
     }
     catch(err){
          res.status(400).json({message: err.message})
     }
}

const login = async (req, res, next) => {
     try {
          const { email, password } = req.body
          
          if (!email || !password) {
               return res.status(400).json({ message: "Email and password are required" })
          }
          
          // Find user by email
          const user = await User.findOne({ email: email.toLowerCase() })
          
          if (!user) {
               return res.status(401).json({ message: "Invalid credentials" })
          }
          
          // Check if user has a password (not OAuth-only user)
          if (!user.password) {
               return res.status(401).json({ 
                    message: "Please sign in with Google" 
               })
          }
          
          // Compare password
          const isMatch = await bcrypt.compare(password, user.password)
          
          if (!isMatch) {
               return res.status(401).json({ message: "Invalid credentials" })
          }
          
          // Generate token
          const token = generateToken(user)
          
          res.status(200).json({
               message: "Login successful",
               token,
               user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
               }
          })
          
     }
     catch(err){
          res.status(500).json({message: err.message})
     }
}

const logout = async (req, res, next) => {
     // With JWT, logout is typically handled client-side by removing the token
     // But we can provide an endpoint for consistency
     try {
          res.status(200).json({ 
               message: "Logout successful. Please remove the token from client." 
          })
     }
     catch(err){
          res.status(500).json({message: err.message})
     }
}

const updateUser = async (req, res, next) => {
     const { id } = req.params;
     const { username, email, password } = req.body;
 
     try {
         // Build the update object dynamically to only include fields that are provided
         const updateData = {};
         if (username) updateData.username = username;
         if (email) updateData.email = email;
         if (password) {
              // Hash new password
              updateData.password = await bcrypt.hash(password, 10);
         }
 
         // Update the user
         const updatedUser = await User.findByIdAndUpdate(
             id,
             updateData,
             { new: true, runValidators: true } // `new: true` returns the updated document
         );
 
         if (!updatedUser) {
             return res.status(404).json({ message: "User not found" });
         }
 
         res.status(200).json(updatedUser);
     } catch (err) {
         res.status(400).json({ message: err.message });
     }
 };
 
const deleteUser = async (req, res, next) => {
     const { id } = req.params
     try {
          const deletedUser = await User.findByIdAndDelete(id)
          if (!deletedUser) {
               return res.status(404).json({ message: "User not found" })
          }
          res.status(200).json({ message: "User deleted" })
     }
     catch(err){
          res.status(400).json({message: err.message})
     }
}

const listUsers = async (req, res) => {
     try {
          const users = await User.find({}, "_id username" 

          )
          res.status(200).json(users)
     }
     catch(err){
          res.status(400).json({message: err.message})
     }
}

const getUser = async (req, res, next) => {
     const { id } = req.params
     try {
          const user = await User.findById(id)
          if (!user) {
               return res.status(404).json({ message: "User not found" })
          }
          res.status(200).json(user)
     }
     catch(err){
          res.status(400).json({message: err.message})
     }
}

module.exports = {
     signUp, 
     login, 
     logout, 
     updateUser, 
     deleteUser, 
     listUsers, 
     getUser
}