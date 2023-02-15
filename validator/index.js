exports.userSignupValidator = (request, response, next) => {
    request.check('name', 'Name is required').notEmpty()
    request.check('email', 'Email must be between 3 to 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @')
        .isLength({
            min: 4, 
            max: 32
        })
    request.check('password', 'Password is required').notEmpty()
    request.check('password')
        .isLength({
            min: 6
        })
        .withMessage('Password must contain atleast 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number')
    
    //This will give the list of error objects found during above checks
    const errors = request.validationErrors()

    if(errors) {

        //map method iterates over all the errors and creates the new list of error messages. 
        //here, we are going to store first error message in a constant as we need only first method right now.
        console.log(errors)
        const firstError = errors.map(error => error.msg)[0]                      //displays first error message
        return response.status(400).json({
            error: firstError
        })
    }
    next()
}