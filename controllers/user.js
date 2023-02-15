// module.exports = (request, response) => {
//     response.send("Hello From Node")
// }

exports.sayHi = (request, response) => {
    response.json({
        message: 'Hello there'
    })
}