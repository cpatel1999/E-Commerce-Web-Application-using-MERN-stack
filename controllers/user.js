// module.exports = (request, response) => {
//     response.send("Hello From Node")
// }

const User = require('../models/user')

//to generate signed token
const jwt = require('jsonwebtoken') 
//for authorization check
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