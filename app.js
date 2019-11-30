const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const userRoutes = require('./ruotes/userRoutes')

app
	.use(morgan('dev'))
	.use(bodyParser.urlencoded({extended: true}))
	.use(bodyParser.json())

    .use('/api', userRoutes)

	.use(errorHandler)

    .use((req, res, next) => {
		const error = new Error('Not found')
		error.status = 404
		next(error)
    })
    
    .use((error, req, res, next) => {
		res
		    .status(error.status)
			.json({
				status: 404,
				errorCode: 'RESOURCE_NOT_FOUND'
			})
	})

module.exports = app; 
