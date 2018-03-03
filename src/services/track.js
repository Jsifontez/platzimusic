import platziMusicService from './platzi-music'

const trackService = {}

// metodo que nos permitira interactuar con plazi music

trackService.search = function (q, offset = 0) {
  const type = 'track'

  return platziMusicService.get('/search', {
    params: { q, type, offset }
  })
    .then(res => res.data)
}

trackService.getById = function (id) {
  return platziMusicService.get(`/tracks/${id}`)
    .then(res => res.data)
}

export default trackService
