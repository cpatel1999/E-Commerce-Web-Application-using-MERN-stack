const Category = require('../models/category')
const errorHandler = require('../helpers/dbErrorHandler')

/**
 * Finds category by specific id
 * @param {*} request request object
 * @param {*} response response object
 * @param {*} next reference to next middleware
 * @param {*} id id of the category
 */
exports.categoryById = (request, response, next ,id) => {
    Category.findById(id, (error, category) => {
        if(error || !category) {
            return response.status(400).json({
                error: "Category does not exist"
            })
        }
        request.category = category
        next()
    })
}

/**
 * Creates new category
 * @param {*} request request object
 * @param {*} response response object
 */
exports.create = (request, response) => {
    const category = new Category(request.body)
    category.save((error, data) => {
        if(error) {
            return response.status(400).json({
                error: errorHandler(error)
            })
        }
        response.json({
            data
        })
    })
}


/**
 * Reads a category from the database
 * @param {*} request request object
 * @param {*} response response object
 * @returns 
 */
exports.read = (request, response) => {
    return response.json(request.category)
}


/**
 * Updates specific category
 * @param {*} request request object
 * @param {*} response response object
 */
exports.update = (request, response) => {
    const category = request.category
    category.name = request.body.name
    category.save((error, data) => {
        if(error) {
            return response.status(400).json({
                error: errorHandler(error)
            })
        }
        return response.json(data)        
    })
}


/**
 * removes the specific category
 * @param {*} request request object
 * @param {*} response response object
 */
exports.remove = (request, response) => {
    const category = request.category
    category.remove((error, data) => {
        if(error){
            return response.status(400).json({
                error: errorHandler(error)
            })
        }
        return response.json({
            message: "Category deleted"
        })
    })
}


/**
 * Returns list of categories available in the database
 * @param {*} request request object
 * @param {*} response response object
 */
exports.list = (request, response) => {
    Category.find((error, data) => {
        if(error){
            return response.status(400).json({
                error: errorHandler(error)
            })
        }
        return response.json(data)
    })
}
