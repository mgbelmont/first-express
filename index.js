const { response, json } = require('express')
const { request } = require('express')
const express = require('express')
const server = express()

const fs = require('fs')

//middleware
server.use(express.json())
/*
server.get('/hola', (request, response)=>{
    response.write('GET /hola')
    response.end()

})

server.post('/hola', (request, response)=>{
    response.write('Este es un POST a /hola')
    response.end()

})
*/
/*
server.get('/koders', (request, response)=>{
    response.status(200)
    //response.json({message :  'Aqui la lista de koders'})
    //response.end() ya no tenemos q incluir el end porque el response.json ya lo incluye

    //Agregamos la funcionalidad de leer un archivo
    
    fs.promises.readFile('koders.json','utf8')
    .then((data)=>{
        response.json(JSON.parse(data))
        
        console.log('se leyo el archivo', data)
        
    })
    .catch((error)=>{
        console.error('ocurrió un error', error)
       
    })

})*/

const getKodersFile= ()=>{
    const content = fs.readFileSync('koders.json', 'utf-8')
    const json = JSON.parse(content)
    return json;
}

server.get('/koders', async (request, response)=>{
    const genderFilter = request.query.gender
    const countFilter = parseInt(request.query.count)
    const nameFilter =  request.query.name
    const jsonParsed = getKodersFile()

    let  kodersData = null
    if(genderFilter){

        kodersData =  jsonParsed.koders.filter(koder => koder.gender === genderFilter)
        
    }
    
    if(nameFilter){
         const dataToFilter = kodersData || jsonParsed.koders
         kodersData = dataToFilter.filter(koder => koder.name === nameFilter)
    }

    if(countFilter){
        const dataToFilter = kodersData || jsonParsed.koders
        kodersData = dataToFilter.splice(0,countFilter)
    }

    jsonParsed.koders = kodersData || jsonParsed.koders
    response.json(jsonParsed.koders)
})

server.post('/koders', (request, response)=>{
   // const cuerpo = request.body
    //console.log('body: ', cuerpo.name)
   // response.json({message:'ok'})
    const name = request.body.name
    const gender = request.body.gender

    const newKoder = {name, gender}
    const content = fs.readFileSync('koders.json','utf-8')
    const json = JSON.parse(content)
    
    json.koders.push(newKoder)
    fs.writeFileSync('koders.json', JSON.stringify(json, null, 2) , 'utf-8')
   response.json({success:true})
})

//   /koders/:id
// /koders/1
// /koders/100
// /koders/abc

server.patch('/koders/:id', (request, response) =>{
    console.log(request.params)
    const id = parseInt(request.params.id)
    const name = request.body.name

    const content = fs.readFileSync('koders.json', 'utf-8')
    const json = JSON.parse(content)
    
    const newKoders = json.koders.reduce((koders, koderActual)=>{
        if(id == koderActual.id){
            koderActual.name=name
        }
        return[
            ...koders,
            koderActual
        ]
    }, [])

    json.koders = newKoders
    fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf-8')

    response.json({success:true})
})

server.delete('/koders/:id', (request, response) =>{
    console.log(request.params)
    const id = parseInt(request.params.id)
    const content = fs.readFileSync('koders.json', 'utf-8')
    const json = JSON.parse(content)
    
    const newKoders = json.koders.reduce((koders, koderActual)=>{
        if(id != koderActual.id){
            koders = [
                ...koders,
                koderActual
            ]
        }
        return koders
    }, [])

    console.log(newKoders)

    json.koders = newKoders
    fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf-8')

    response.json({success:true})
})

server.get('/koders/:id', (request, response) =>{
    
    const id = parseInt(request.params.id)
  
    const content = fs.readFileSync('koders.json', 'utf-8')
    const json = JSON.parse(content)
    
    const newKoders = json.koders.reduce((koders, koderActual)=>{
        if(id == koderActual.id){
           koders = [
            ...koders,
            koderActual
        ]
        }
        return koders
    }, [])
    console.log(newKoders)
    
    response.json(newKoders)
})

server.put('/koders', (request, response)=>{
    response.write('Este es un PUT a /koders')
    response.end()

})

server.listen(8080, ()=>{
    console.log('Server listening in port 8080')
})

// GET /koders -> Aqui estan todos los koders
// POST /koders -> Aqui pudes crear koders
// PUT /koders -> Aui puedes sustituir un koder
// Practica fs + express

  // GET /Koders -> regresa un json con una lista de koders
  //La lista de koders viene de un archivo

  // Practica
/* 
Crear un endpoint para borrar y otro para consultar por id
DELETE /koders/:id
GET /koders/:id
*/
