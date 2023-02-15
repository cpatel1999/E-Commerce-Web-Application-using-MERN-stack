//To use mongoDB database
const mongoose = require('mongoose')
//crypto package is used to hash the password
const crypto = require('crypto')
//uuid/v1 is used to generate unique strings
const uuidv1 = require('uuid/v1')

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
    salt: String,
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

//virtual field
userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv1()            //uuid gives the random string
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})

userSchema.methods = {
    encryptPassword: function(password) {
        if(!password) {
            return '';
        }
        try {
            return crypto.createHmac('sha1', this.salt)
            .update(password)
            .digest('hex')
        } catch(error) {
            return "";
        }
    }
}

module.exports = mongoose.model("User", userSchema)