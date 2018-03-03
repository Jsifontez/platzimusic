import trae from 'trae'
import configService from './config.js'

const platziMusicService = trae.create({
  baseUrl: configService.apiUrl
})

export default platziMusicService
