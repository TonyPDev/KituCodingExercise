const express = require('express')
const axios = require("axios")

const app = express()
const port = 3000
const url = "https://randomuser.me/api"

let users = []

app.use(express.json())

app.get('/users', async function (req, res) {
  // Note: This could be simplified to one call.
  // Docs: Random User Generator allows you to fetch up to 5,000 generated users in one request using the results parameter.
  // Ex: https://randomuser.me/api/?results=10

  try {
    // 'await' expression blocks until the promise is resolved/rejected
    const responses = await Promise.all([
      axios.get(url),
      axios.get(url),
      axios.get(url),
      axios.get(url),
      axios.get(url),
      axios.get(url),
      axios.get(url),
      axios.get(url),
      axios.get(url),
      axios.get(url)
    ])

    const newUsers = responses.map(resp => {
      const user = {}
      const data = resp.data.results[0]

      user.gender = data.gender
      user.firstname = data.name.first
      user.city = data.location.city
      user.email = data.email
      user.cell = data.cell

      return user
    })

    users = users.concat(newUsers)

    res.status(200).json(users)
  } catch(e) {
    console.log(e.stack)
    res.status(500).send({error: e.message})
  }
})

app.get('/users/firstname/:firstname', async function (req, res) {
  try {
    let userFound = false;
    for (let i = 0; i < users.length; i++) {
      if (users[i].firstname === req.params.firstname) {
        res.status(200).json(users[i])
        userFound = true;
        break;
      }
    }
    if (!userFound) {
      res.status(404).send({message: 'User not found!'})
    }
  } catch(e) {
    console.log(e.stack)
    res.status(500).send({error: e.message})
  }
})

app.post('/users', async function (req, res) {
  try {
    // Needs data validation and sanitization.
    users.push(req.body)
    res.status(201).send({message: 'User successfully created!'})
  } catch(e) {
    console.log(e.stack)
    res.status(500).send({error: e.message})
  }
})

app.listen(port, () => console.log(`App listening on port ${port}`))
