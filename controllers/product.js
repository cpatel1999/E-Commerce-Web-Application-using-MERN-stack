//This package is used when we want to receive data from the form
//If we want to get image data from form then we can use multer
const formidable = require('formidable')

const _ = require('lodash')

const fs = require('fs')

const Product = require('../models/product')
const errorHandler = require('../helpers/dbErrorHandler')

//find a product by product id
exports.productById = (request, response, next, id) => {
    Product.findById(id, (error, product) => {
        if(error || !product) {
            return response.status(400).json({
                error: "Product not found"
            })
        }
        request.product = product
        next()
    })
}

//read product
exports.read = (request, response) => {
    request.product.photo = undefined       //we don't want to send photo in response. Because it can cause performance issues.
    let product = request.product
    return response.json({
        product
    })
}

//create a product document
exports.create = (request, response) => {
    
    let form = new formidable.IncomingForm() //gets a form data
    form.keepExtensions = true //keeps the extensions as it is if a form data has a image file

    form.parse(request, (error, fields, files) => {
        if(error) {
            return response.status(400).json({
                error: 'Image could not be uploaded'
            })
        }

        //check for all fields
        //form data validation
        const {name, description, price, category, quantity, shipping} = fields

        if(!name || !description || !price || !category || !quantity || !shipping) {
            return response.status(400).json({
                error: "All fields are required"
            })
        }


        let product = new Product(fields)

        // 1kb = 1000
        // 1mb = 1000000

        if(files.photo) {        //here, 'photo' is the name of the field in the front end. For example, name = "photo"
            console.log("FILES PHOTO", files.photo)
            if(files.photo.size > 1000000) {
                return response.status(400).json({
                    error: "Image should be less than 1mb in size"
                })
            }

            product.photo.data = fs.readFileSync(files.photo.path)
            product.photo.contentType = files.photo.type

            //For the newer version use this
            // product.photo.data = fs.readFileSync(files.photo.path)
            // product.photo.contentType = files.photo.type
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


exports.remove = (request, response) => {
    let product = request.product
    product.remove((error, deletedProduct) => {
        if(error) {
            return response.status(400).json({
                error: errorHandler(error)
            })
        }
        return response.json({
            message: "Product deleted"
        })
    })
}