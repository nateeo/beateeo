import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import path from 'path'
import { ipcMain } from 'electron'

import { createMainStore } from '../state/store'
import config from './config.json'
import commands from './commands.js'
import setupListeners from './messageCommandHandler'

const client = new Discord.Client()
const token = config.token
const owner = config.owner
const prefix = config.prefix || '!'

// state management
let store
let previousState

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
  if (loggingIn) return
  loggingIn = true
  const t = inputToken ? inputToken : token
  client.login(t).then(
    token => {
      event.sender.send('login', 'success', token)
      loggingIn = false
    },
    e => {
      event.sender.send('login', 'error', e)
      loggingIn = false
    }
  )
}

// map new state to application effects
const onStoreUpdate = () => {
  state = store.getState()
  if (previousState.queue != state.queue) {
  } else if (previousState.volume != state.volume) {
  } else if (previousState.isPlaying != state.isPlaying) {
  } else if (previousState.volume != state.volume) {
  } else if (previousState.messageEnabled != state.messageEnabled) {
  }
  previousState = state
}

const setup = browserWindow => {
  if (!store) {
    console.log('setting up')
    store = createMainStore(browserWindow)
    previousState = store.getState()
    store.subscribe(onStoreUpdate)

    setupListeners(client)

    ipcMain.on('login', initialize)
    ipcMain.on('start', () => setupListeners(client))
    process.on('SIGINT', () => client.destroy())
  }
}

export default setup
