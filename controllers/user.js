// module.exports = (request, response) => {
//     response.send("Hello From Node")
// }

const User = require('../models/user')
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