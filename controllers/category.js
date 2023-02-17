const Category = require('../models/category')
const errorHandler = require('../helpers/dbErrorHandler')

exports.create = (request, response) => {
    const category = new Category(request.body)
    category.save((error, category) => {
        if(error) {
            return response.status(400).json({
                error: errorHandler(error)
            })
        }
        response.json({
            category
        })
    })
}