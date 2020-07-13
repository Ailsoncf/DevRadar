const axios = require("axios")
const Dev = require("../models/Dev")
const parseStringAsArray = require("../utils/parseStringAsArray")
const { findConnections, sendMessage } = require("../websocket")
const { updateMany } = require("../models/Dev")

module.exports = {
  async index(request, response) {
    const devs = await Dev.find()

    return response.json(devs)
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body

    let dev = await Dev.findOne({ github_username })

    if (!dev) {
      const apiResponse = await axios.get(
        `http://api.github.com/users/${github_username}`
      )

      const { name = login, avatar_url, bio } = apiResponse.data

      const techsArray = parseStringAsArray(techs)

      const location = {
        type: "Point",
        coordinates: [longitude, latitude],
      }

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      })

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray
      )
      sendMessage(sendSocketMessageTo, "new-dev", dev)
    }

    return response.json(dev)
  },
  async delete(request, response) {
    const { id } = request.params
    const findDev = await Dev.findOne({ _id: request.params.id })
    if (findDev) {
      const dev = await Dev.deleteOne({ _id: id })
      return dev.deletedCount == 1
        ? response.json({ message: "Dev deleted." })
        : response.json({ message: "No Dev deleted." })
    } else {
      return response.json({ message: "No Dev founded." })
    }
  },
}
