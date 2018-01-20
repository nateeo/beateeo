const Discord = require('discord.js')
const ytdl = require('ytdl-core')

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

const queue = []

let volume = 0.15

let currentDispatcher = null

let voiceChannel

let channel

const playNext = () => {
  if (queue.length == 0) return
  const song = queue[0]
  voiceChannel
    .join()
    .then(connection => {
      channel.send('now playing: ' + song)
      const stream = ytdl(song, { filter: 'audioonly' })
      const dispatcher = connection.playStream(stream, {
        seek: 0,
        volume: volume,
      })
      currentDispatcher = dispatcher
      dispatcher.on('info', info => console.log(info))
      dispatcher.on('error', console.error)
      dispatcher.on('end', () => {
        currentDispatcher = null
        queue.shift()
        playNext()
      })
    })
    .catch(console.error)
}

const play = (message, song) => {
  channel = message.channel
  if (!song) return
  const url = song.trim()
  voiceChannel = message.member.voiceChannel
  if (!voiceChannel) {
    return message.reply('Need to be in a voice channel first!')
  }
  if (!YOUTUBE_REGEX.test(url)) {
    return message.reply('Sorry, I currently only accept valid youtube urls :(')
  }
  if (queue.length == 0) {
    queue.push(url)
    playNext()
  } else {
    queue.push(url)
    channel.send('Song queued!')
  }
}

const pause = () => {
  if (currentDispatcher && !currentDispatcher.paused) currentDispatcher.pause()
}

const resume = () => {
  if (currentDispatcher && currentDispatcher.paused) currentDispatcher.resume()
}

const skip = () => {
  playNext()
}

const showQueue = message => {
  let result = ''
  queue.forEach((value, index) => {
    result += index + ': ' + value + '\n'
  })
  message.channel.send(result)
}

const setVolume = message => {
  const value = message.content.split(' ')[1].trim()
  if (!isNaN(value) && value > 0 && value <= 100) {
    volume = value / 100
    message.reply('Volume is now ' + volume)
  } else {
    message.reply('Invalid volume setting! (0 < volume <= 100')
  }
}

export default {
  play,
  skip,
  showQueue,
  setVolume,
}
