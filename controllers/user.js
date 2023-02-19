const User = require('../models/user')
const _ = require('lodash')

exports.userById = (request, response, next, id) => {
    console.log(request.body)       //This will be empty object as we are sending nothing as a body.
    console.log(request.params)     //This will have userId parameter from the URL.
    User.findById(id, (error, user) => {
        if(error || !user) {
            return response.status(400).json({
                error: "User not found"
            })
        }
        request.profile = user
        next()
    })
}

//More easier approach. Used in Clean-Blog
//Just write following route in user.js file ----> router.get('/secret/:userId', requireSignin, userById)

// exports.userById = (request, response) => {
//     console.log(request.params)
//     const { userId } = request.params
//     User.findById(userId, (error, user) => {
//         if(error || !user) {
//             return response.status(400).json({
//                 error: "User not found"
//             })
//         }
//         return response.send(user)
//     })
// }

/**
 * return the user based on the provided userId in the URL
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
exports.read = (request, response) => {
    let user = request.profile
    user.hashed_password = undefined
    user.salt = undefined
    return response.json(user)
}

/**
 * update the user
 * @param {*} request 
 * @param {*} response 
 */
exports.update = (request, response) => {
    User.findOneAndUpdate(
        { _id: request.profile._id }, 
        { $set: request.body },    //sets fields to the content available in request body
        { new: true },              //newly updated information will be sent to front end
        (error, user) => {
            if(error) {
                return response.status(400).json({
                    error: 'You are not authorized to perform this action'
                })
            }
            user.hashed_password = undefined
            user.salt = undefined
            return response.json(user)
        }
    )
}