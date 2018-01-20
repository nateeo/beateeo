import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import path from 'path'

import config from './config.json'
import commands from './commands.js'

const client = new Discord.Client()
const token = config.token
const owner = config.owner
const prefix = config.prefix || '!'

let state = {
  volume: 0.15,
  queue: [],
}

const responses = ['yes', 'no', 'maybe', 'ask Gweilo']

const getOwner = () => {
  client.guilds.forEach(guild => {
    if (guild.available) {
      guild.channels.forEach(channel => {
        if (channel.type == 'voice') {
          if (!channel.members) return
          channel.members.forEach(member => {
            if (member.id == owner) {
              state.guildOwner = member
              console.log('Found owner!')
              if (member.voiceChannel) {
                console.log('Owner is in a voice channel, joining')
                member.voiceChannel.join().catch(e => console.log(e))
              }
            }
          })
        }
      })
    }
  })
}

const initialize = () => {
  client.on('ready', () => {
    console.log('DISCORDEEO IS READY')
    console.log(`token: ${token}\nowner: ${owner}`)
    console.log('searching for owner...')
    getOwner()
    client.user.setGame('good music')
  })

  client.on('message', async message => {
    if (message.author.bot) return
    if (message.content.indexOf('!') !== 0 || message.content.length < 2) return

    let command
    if (
      message.content.indexOf(' ') === -1 ||
      message.content.lastIndexOf(' ') === 0
    ) {
      command = message.content.substr(1).trim()
    } else {
      command = message.content.substr(1, message.content.indexOf(' ')).trim()
    }

    console.log('command is ' + command)

    if (command == 'play') {
      commands.play(message, message.content.split(' ')[1])
    }

    if (command == 'skip') {
      commands.skip()
    }

    if (command == 'queue') {
      commands.showQueue(message)
    }

    if (command == 'volume') {
      commands.setVolume(message)
    }
  })

  process.on('SIGINT', () => client.destroy())
  client.login(token)
}

export default initialize
