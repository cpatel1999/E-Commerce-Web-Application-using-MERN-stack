const User = require('../models/user')

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