const express = require('express')

const db = require("./database")

const port = 5000

const server = express();

server.use(express.json())


server.get('/users', (req, res) => {
  const users = db.getUsers()
  res.json(users)
})

server.get('/users/:id', (req, res) => {
  const userId = req.params.id
  const user = db.getUserById(userId)
  
  if (user) {
    res.json(user)

  } else {
    res.sendStatus(404).json({message: 'user not found'})
  }

})

server.post('/users', (req, res) => {
  
  if (!req.body.name || !req.body.bio) {
    return res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }
  else {
    const newUser = {
      name: req.body.name,
      bio: req.body.bio
    }
    
    db.createUser(req.body).then(user => {
      if (user) {
        res.status(201).json(newUser)
      } else {
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    })
  }
})

server.put('/users/:id', (req, res) => {
  const user = db.getUserById(req.params.id)

  if (user) {
    const updatedUser = db.updateUser(user.id, {
      name: req.body.name || user.name,
      bio: req.body.bio || user.bio
    })

    res.status(200).json(updatedUser)

  } else {  
    res.status(500).json({ errorMessage: "The user information could not be modified." })
  }
})

server.delete('/users', (req, res) => {
  const user = db.getUserById(req.params.id)

  if (user) {
    db.deleteUser(user.id)
    res.sendStatus(204)

  } else {
    res.status(404).json({ message: "The user with the specified ID does not exist." })
  }

  
})

server.listen (port, () => {
  console.log(`server listening on port ${port}`)
})