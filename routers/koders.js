const express = require('express')
const router = express.Router()
const fs = require('fs')

const getKodersFile= ()=>{
    const content = fs.readFileSync('koders.json', 'utf-8')
    const json = JSON.parse(content)
    return json;
}

router.get('/', async (request, response)=>{
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

router.post('/', (request, response)=>{
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

router.patch('/:id', (request, response) =>{
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

router.delete('/:id', (request, response) =>{
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

router.get('/:id', (request, response) =>{
    
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

router.put('/', (request, response)=>{
    response.write('Este es un PUT a /koders')
    response.end()

})

module.exports = router