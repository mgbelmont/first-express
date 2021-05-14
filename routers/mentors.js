const express = require('express')
const router = express.Router()
const fs = require('fs')

const getMentorsFile= ()=>{
    const content = fs.readFileSync('koders.json', 'utf-8')
    const json = JSON.parse(content)
    return json;
}

router.get('/', async (request, response)=>{
    const jsonParsed = getMentorsFile()
    console.log(jsonParsed.mentores)
    response.json(jsonParsed.mentores)
})

router.post('/', (request, response)=>{
    const name = request.body.name
    const module = request.body.module
    const id = Date.now()

    const newMentor = {id,name, module}
   
    const json = getMentorsFile()
    
    json.mentores.push(newMentor)
    fs.writeFileSync('koders.json', JSON.stringify(json, null, 2) , 'utf-8')
   response.json({success:true})
})


router.patch('/:id', (request, response) =>{
    
    const id = parseInt(request.params.id)
    const name = request.body.name

    const content = fs.readFileSync('koders.json', 'utf-8')
    const json = JSON.parse(content)
    
    const newMentors = json.mentores.reduce((mentors, mentorActual)=>{
        if(id == mentorActual.id){
            mentorActual.name=name
        }
        return[
            ...mentors,
            mentorActual
        ]
    }, [])

    json.mentores = newMentors
    fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf-8')

    response.json({success:true})
})

router.delete('/:id', (request, response) => {
    const id = request.params.id
  
    const json = getMentorsFile()
  
    const newMentors = json.mentores.filter(mentor => mentor.id != id)
  
    json.mentores = newMentors
  
    fs.writeFileSync('koders.json', JSON.stringify(json, null, 2), 'utf8')
  
    response.json({
      success: true
    })
  })

router.get('/:id', (request, response) => {
    const id = request.params.id
  
    console.log('query: ', request.query)
  
    const json = getMentorsFile()
  
    const mentorFound = json.mentores.find(mentor => mentor.id == id)
  
    if (!mentorFound) {
      response.status(404)
      response.json({
        success: false,
        message: 'mentor not found :C'
      })
      return
    }
  
    response.json({
      success: true,
      message: 'mentor found',
      data: {
        mentor: mentorFound
      }
    })
  })


module.exports = router