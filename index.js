const { response, json } = require('express')
const { request } = require('express')
const express = require('express')
const kodersRouter  = require('./routers/koders')
const mentorsRouter  = require('./routers/mentors')
const server = express()



//middleware
server.use(express.json())
server.use('/koders', kodersRouter)
server.use('/mentors', mentorsRouter)

server.get('/', (request, response) =>{
    response.json({
        success: true,
        message: '11G API v1'
    })
})


server.listen(8080, ()=>{
    console.log('Server listening in port 8080')
})

