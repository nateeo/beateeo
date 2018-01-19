const Discord = require('discord.js')
const ytdl = require('ytdl-core')

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

const queue = []

let voiceChannel

let channel

const playNext = () => {
  if (queue.length == 0) return
  const song = queue.shift()
  voiceChannel
    .join()
    .then(connection => {
      const stream = ytdl(song, { filter: 'audioonly' })
      const dispatcher = connection.playStream(stream, {
        seek: 0,
        volume: 0.15,
      })
      dispatcher.on('info', info => console.log(info))
      dispatcher.on('error', console.error)
      dispatcher.on('end', playNext)
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
  queue.push(url)
  if (queue.length == 1) {
    channel.send('Now playing your song!')
    playNext()
  } else {
    channel.send('Song queued!')
  }
}

export default {
  play,
}
