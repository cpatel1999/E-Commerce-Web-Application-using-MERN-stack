// module.exports = (request, response) => {
//     response.send("Hello From Node")
// }

const User = require('../models/user')

//to generate signed token
const jwt = require('jsonwebtoken') 
//for authorization check. Require signin or not
const expressJwt = require('express-jwt')
const {errorHandler} = require('../helpers/dbErrorHandler')

exports.signup = (request, response) => {

    //user object is created to call save() method of mongoDB
    const user = new User(request.body)
    
    //storing document using save() method. It is called using user object
    user.save((error, user) => {
        if(error) {
            // console.log(error)
            return response.status(400).json({
                error: errorHandler(error)
            })
        }
    
        //Hides the sensitive user info.
        //For that simply set those fields to undefined
        user.salt = undefined
        user.hashed_password = undefined
        response.json({
            user: user
        })
    })


    // //mongoDB create method.
    // //difference between create() and save() is, save() has only one parameter. It is called suing object, whereas
    // //create() has two parameters - first is request body and second is callback function. It is called on schema.
    // User.create(request.body, (error, user) => {
    //     if(error) {
    //         return response.status(400).json({
    //             error
    //         })
    //     }
    //     response.json({
    //         user
    //     })
    // })
}


exports.signin = (request, response) => {
    //find the user based on email
    const {email, password} = request.body
    User.findOne({
        email
    }, (error, user) => {
        if(error || !user) {
            return response.status(400).json({
                error: 'User with this email does not exist. please signup'
            })
        }
        //if user is found make sure the email and password match
        //create authenticate method in User model
        // console.log(user)
        if(!user.authenticate(password)){
            return response.status(401).json({
                error: "Email and password don't match"
            })
        }


        //generate a signed token with user id and secret
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET)

        //persist the token as 't' in cookie with expiry date
        response.cookie('t', token, {
            expire: new Date() + 9999
        })

        //return response with user and token to frontend client
        const {_id, name, email, role} = user
        return response.json({
            token,
            user: {
                _id,
                email,
                name,
                role
            }
        })
    })
}

//user signout
exports.signout = (request, response) => {
    response.clearCookie('t')
    response.json({
        message: "Successfully signed out "
    })
}

//protects routes from unauthorized access
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
})

//main use is to prevent the authorized user to access other authorized users profile
//two users, user A and user B
//user A is logged in and user A wants to access user B by providing user B's id in the URL, e.g. -->'/secret/:userId'. Here, userId will be user B's id.
//In that case,
//request.profile ----> true as user B is found
//request.auth ----> true as user A is authenticated
//request.profile._id == request.auth._id ----> false, as the user A's id is not equal to user B's id. 
//So, over all result will be false.
//So the user A is not allowed to access user B's information.
//this is what we want.
exports.isAuth = (request, response, next) => {
    console.log(request.auth)
    let user = request.profile && request.auth && request.profile._id == request.auth._id
    if(!user) {
        return response.status(403).json({
            error: "Access denied"
        })
    }
    next()
}

//If the user is admin then only the user can access his/her own profile.
exports.isAdmin = (request, response, next) => {
    if(request.profile.role === 0) {
        return response.status(403).json({
            error: "Admin resourse! Access denied"
        })
    }
    next()
}