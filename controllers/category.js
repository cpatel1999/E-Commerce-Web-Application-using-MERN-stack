const Category = require('../models/category')
const errorHandler = require('../helpers/dbErrorHandler')


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


exports.read = (request, response) => {
    return response.json(request.category)
}


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
