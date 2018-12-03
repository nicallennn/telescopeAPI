//import the express module
const express = require('express')
const fs = require('fs')

//set post to listen on
const port = 3000

//get the express object
const app = express()

//log each time app is accessed
app.use((req, res, next) => {
  //get the date and create log template string
  const now = new Date().toString()
  const log = `${now}, ${req.method} : ${req.url}`

  //append the log to the server.log file
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log file!')
    }
    console.log(log)

  })
  //call next to move on
  next()
})

//endpoint for simple homepage
app.get('/', (req, res) => {
  res.status(200).send('Telescope Calculator')
})

//endpoint for diy telescope calculations
app.get('/skope/:focal/:lens/:eye', (req, res) => {
  //get the req.params object
  const rp = req.params
  //get required info for calculations
  const skope = {
    type: rp.type,
    lens: rp.lens,
    focal: rp.focal,
    eye: rp.eye
  }
  //return the results 
  res.send(calculateResults(skope))
})

//endpoint for performing basic maths calculations
app.get('/calc/:op/:num1/:num2', (req, res) => {
  //get the req.params object
  const rp = req.params
  const num1 = parseFloat(rp.num1)
  const num2 = parseFloat(rp.num2)
  let result = 0

  //switch on operation and perform calculation
  switch (rp.op) {
    case 'add':
      result = num1 + num2
      break
    case 'sub':
      result = num1 - num2
      break
    case 'mul':
      result = num1 * num2
      break
    case 'div':
      result = num1 / num2
      break
  }
  //send back the results
  res.send({
    operation: rp.op,
    num1: num1,
    num2: num2,
    result: result
  })

})

//function to calculate dimensions for diy telescope
const calculateResults = (skope) => {
  //make calculations
  const resultsObj = {
    focalLength: skope.lens * skope.focal,
    tubeLength: skope.lens * skope.focal,
    minResolution: parseFloat((4.56 / skope.lens).toFixed(2)),
    maxVisibleMag: skope.lens * 50,
    minVisibleMag: skope.lens * 4,
  }
  //return the results object
  return resultsObj
}

//listen for incoming connections
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
