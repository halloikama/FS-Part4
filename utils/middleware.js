const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
    try {
        const authorization = request.get('authorization')
        console.log("auth", authorization)
        if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
            request.token = authorization.substring(7)
            console.log('THERE IS A TOKEN')
        }
        next()
    } catch{
        console.log("token extractor error")
        next()
    }
}


module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor
}