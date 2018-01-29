import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import path from 'path'
import { ipcMain } from 'electron'

import { createMainStore } from '../state/store'
import config from './config.json'
import commands from './commands.js'
import { setupListeners } from './messageCommandHandler'

const client = new Discord.Client()
const token = config.token
const owner = config.owner
const prefix = config.prefix || '!'

let state = {
  volume: 0.15,
  queue: [],
}

let store

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

let loggingIn = false

const initialize = (event, inputToken) => {
  if (loggingIn) {
    console.log('login request already in-flight')
    return
  }
  console.log('logging in...')
  loggingIn = true
  const t = inputToken ? inputToken : token
  console.log('trying to login with ' + t)
  client.login(t).then(
    token => {
      event.sender.send('login', 'success', token)
      console.log('succesfully logged in')
      loggingIn = false
    },
    e => {
      event.sender.send('login', 'error', e)
      console.log('error logging in')
      loggingIn = false
    }
  )
}

const setup = browserWindow => {
  if (!store) {
    store = createMainStore(browserWindow)
  }
  ipcMain.on('login', initialize)
  ipcMain.on('start', () => setupListeners(client))
}

export default setup
