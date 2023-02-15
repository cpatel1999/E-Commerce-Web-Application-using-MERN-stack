//To use mongoDB database
const mongoose = require('mongoose')
//crypto package is used to hash the password
const crypto = require('crypto')
//uuid/v1 is used to generate unique strings
const uuidv1 = require('uuid/v1')

const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true,
    },
    // salt: String,
    role: {                     //Defines the role of the person
        type: Number,
        default: 0              //0 means the normal user, 1 means admin
    },
    history: {                  //Array of order history
        type: Array,
        default: []
    }
},
    { timestamps: true }
)

//schema allows us to create multiple virtual keywords and methods

//virtual field
//password is created
//This virtual field password will be used to refer to hashed_password.
//We can directly use password as a variable.
userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv1()            //uuid gives the random string
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

//method to create the hashed_password
//we can create maultiple methods
userSchema.methods = {
    encryptPassword: function(password) {
        if(!password) {
            return "";
        }
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch(error) {
            return "";
        }
    },

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    }
}




// //password encryption using bcrypt npm package.
// //pre function ensures that before saving the document, the password will be hashed.
// //So, function(next) will be executed before saving the user document.
// userSchema.pre('save', function(next) {
//     const user = this
//     //Password and number of time to perform hashing/encryption
//     bcrypt.hash(user.password, 10, (error, encrypted) => {
//         user.password = encrypted
//         next()
//     })
// })


const User = mongoose.model("User", userSchema)
module.exports = User