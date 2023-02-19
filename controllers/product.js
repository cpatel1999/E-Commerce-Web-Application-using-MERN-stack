//This package is used when we want to receive data from the form
//If we want to get image data from form then we can use multer
const formidable = require('formidable')

//loadash is used to update the data
const _ = require('lodash')

const fs = require('fs')

const Product = require('../models/product')
const errorHandler = require('../helpers/dbErrorHandler')


/**
 * find a product by product id
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @param {*} id 
 */
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


/**
 * read product
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
exports.read = (request, response) => {
    request.product.photo = undefined       //we don't want to send photo in response. Because it can cause performance issues.
    let product = request.product
    return response.json({
        product
    })
}


/**
 * create a product document
 * @param {*} request 
 * @param {*} response 
 */
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
            // console.log("FILES PHOTO", files.photo)
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

/**
 * remove specific product
 * @param {*} request 
 * @param {*} response 
 */
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

/**
 * Update specific product
 * @param {*} request 
 * @param {*} response 
 */
exports.update = (request, response) => {
    
    let form = new formidable.IncomingForm() //gets a form data
    form.keepExtensions = true //keeps the extensions as it is if a form data has a image file

    form.parse(request, (error, fields, files) => {
        if(error) {
            return response.status(400).json({
                error: 'Product cannot be updated'
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

        //lodash is used to update the fields
        let product = request.product
        product = _.extend(product, fields)

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


/**
 * sell (popular) and arrival (new arrivals)
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * If no params are sent, then all products are returned
 */
exports.list = (request, response) => {

    let sortBy = request.query.sortBy ? request.query.sortBy : '_id'
    let order = request.query.order ? request.query.order : 'asc'
    let limit = request.query.limit ? parseInt(request.query.limit) : 6     //changes to integer

    Product.find()              //n oparameter in find() method as we want a list of all products
        .select("-photo")       //deselect the photo as we do not want photo
        .populate("category")
        .sort([                 //sort function accepts the array of arrays
            [sortBy,
            order]
        ])
        .limit(limit)
        .exec((error, products) => {    //callback function
            if(error) {
                return response.status(400).json({
                    error: "Products not found"
                })
            }
            return response.json(products)
        })
}


/**
 * it will find the products based on the requested product's category
 * other products that has the same category will be returned
 */
exports.listRelated = (request, response) => {
    let limit = request.query.limit ? parseInt(request.query.limit) : 6

    Product.find({
        _id: {
            $ne: request.product        //$ne stands for not include. It finds all the products except current product
        },
        category: request.product.category
    })
    .limit(limit)
    .populate('category', '_id name')  //while populating category we don't want all the fields of category. So we have specified the required fields
    .exec((error, products) => {
        if(error) {
            return response.status(400).json({
                error: "Products not found"
            })
        }
        console.log(products.length)
        return response.json(products)
    })
}

/**
 * finds all the categories that are used in Product collection
 * @param {*} request 
 * @param {*} response 
 */
exports.listCategories = (request, response) => {
    Product.distinct("category", {}, (error, categories) => {           //finds all the categories that are used in product
        if(error) {
            return response.status(400).json({
                error: "Categories not found"
            })
        }
        return response.json(categories)
    })        
}

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 * @param {*} request 
 * @param {*} response 
 */
exports.listBySearch = (request, response) => {
    let order = request.body.order ? request.body.order : "desc";
    let sortBy = request.body.sortBy ? request.body.sortBy : "_id";
    let limit = request.body.limit ? parseInt(request.body.limit) : 100;
    let skip = parseInt(request.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    //filters: [
    //    price = [0, 10]
    //    category = Node
    //]

    for (let key in request.body.filters) {
        if (request.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: request.body.filters[key][0],
                    $lte: request.body.filters[key][1]
                };
            } else {
                findArgs[key] = request.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return response.status(400).json({
                    error: "Products not found"
                });
            }
            response.json({
                size: data.length,
                data
            });
        });
};

/**
 * returns the product photo
 * @param {*} request 
 * @param {*} response 
 * @param {*} response 
 */
exports.photo = (request, response, next) => {
    if(request.product.photo.data) {
        response.set('Content-Type', request.product.photo.contentType)
        return response.send(request.product.photo.data)
    }
    next()
}