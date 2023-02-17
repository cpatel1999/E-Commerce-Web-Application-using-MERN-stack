//This package is used when we want to receive data from the form
//If we want to get image data from form then we can use multer
const formidable = require('formidable')

const _ = require('lodash')

const fs = require('fs')

const Product = require('../models/product')
const errorHandler = require('../helpers/dbErrorHandler')

exports.create = (request, response) => {
    
    let form = new formidable.IncomingForm() //gets a form data
    form.keepExtensions = true //keeps the extensions as it is if a form data has a image file

    form.parse(request, (error, fields, files) => {
        if(error) {
            return response.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        let product = new Product(fields)
        if(files.photo) {        //here, 'photo' is the name of the field in the front end. For example, name = "photo"
            product.photo.data = fs.readFilesSync(files.photo.filepath)
            product.photo.contentType = files.photo.mimetype
        }
        
        product.save((error, result) => {
            if(error) {
                return response.status(400).json({
                    error: errorHandler(error)
                })
            }
            return response.json({
                result
            })
        })
    })
}
