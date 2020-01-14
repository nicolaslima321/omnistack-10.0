const axios = require('axios')
const Dev = require('../Models/Dev')

module.exports = {
  async store (request, response) {
    const { github_username, techs, latitude, longitude } = request.body
    
    let dev = await Dev.findOne({ github_username })

    if (dev) return response.json({ message: "Cannot create, this developer already exists!"})

    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`)
    
    const { name = login, avatar_url, bio } = apiResponse.data
    
    const techsArray = techs.split(',').map(tech => tech.trim())
  
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  
    // Short syntax, same propertie and value name can be simplified
    dev = await Dev.create({
      github_username: github_username,
      name,
      avatar_url,
      bio,
      techs: techsArray,
      location
    })
  
    return response.json({ dev })
  },

  async index (request, response) {
    const devs = await Dev.find()
    return response.json( devs )
  }
}
