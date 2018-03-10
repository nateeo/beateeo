// REFACTOR ONCE WORKING

import Discord from 'discord.js'
import ytdl from 'ytdl-core'
import path from 'path'
import { ipcMain } from 'electron'

import { createMainStore } from '../state/store'
import config from './config.json'
import { messageCommands } from '../shared/commands'
import Commander from '../shared/commands'
import {
  QUEUE_RESUME,
  QUEUE_PAUSE,
  UPDATE_VOLUME,
  QUEUE_SKIP,
  QUEUE_ADD,
} from '../state/actions'

const client = new Discord.Client()
const token = config.token
const owner = config.owner
const prefix = config.prefix || '!'

// state management
let commander

let store
let previousState

let currentDispatcher
let voiceChannel
let channel
let lastMessage

// play functions

const onDispatcherEnd = e => {
  // if the reason for ending is skipping, this has already been handled
  console.log('onDispatcherEnd: ' + e)
  if (e !== 'skip') commander.queueSkip()
}

const play = () => {
  if (currentDispatcher) currentDispatcher.end('skip')
  if (store.getState().queue.length == 0) return
  const song = store.getState().queue[0]
  store.dispatch(QUEUE_RESUME)
  voiceChannel.join().then(connection => {
    // testing
    if (lastMessage) lastMessage.delete()
    channel.send(`now playing: ${song.title}`)
    const stream = ytdl(song.url, { filter: 'audioonly' })
    const dispatcher = connection.playStream(stream, {
      seek: 0,
      volume: store.getState().volume,
    })
    currentDispatcher = dispatcher
    dispatcher.on('info', console.log)
    dispatcher.on('error', console.error)
    dispatcher.on('end', onDispatcherEnd)
  })
}

// volume

// map new state to application effects
const onStoreUpdate = action => {
  console.log('<<onStoreUpdate>>')
  const state = store.getState()
  console.log('new state')
  console.log(state)
  switch (action) {
    case QUEUE_SKIP:
      play()
      break
    case QUEUE_ADD:
      if (state.queue.length === 1 && state.isPlaying) play()
      break
    case UPDATE_VOLUME:
      if (currentDispatcher) currentDispatcher.setVolume(state.volume)
      break
  }
  if (state.isPlaying != previousState.isPlaying) {
    if (state.isPlaying && currentDispatcher) {
      currentDispatcher.resume()
    } else if (!state.isPlaying && currentDispatcher) {
      currentDispatcher.pause()
    }
  }
  previousState = state
}

const getOwner = () => {
  client.guilds.forEach(guild => {
    if (guild.available) {
      guild.channels.forEach(channel => {
        if (channel.type == 'voice') {
          if (!channel.members) return
          channel.members.forEach(member => {
            if (member.id == owner) {
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

const commanderMessage = msg => channel.send(msg)

const setupMessageListener = () => console.log('setting up message listeners')
client.on('message', async message => {
  const content = message.content
  if (content.startsWith(prefix) && content.length > prefix.length) {
    lastMessage = message
    channel = message.channel
    voiceChannel = message.member.voiceChannel

    const input = content.split(' ')
    const command = input[0].substring(prefix.length)
    const args = input.slice(1)

    const action = messageCommands[command]
    if (action) {
      commander[action.type](
        action.args >= 0 ? args.slice(0, action.args) : args
      )
    } else {
      message.reply('Unknown command.')
    }
  }
})

// initialising and setting up

let loggingIn = false

const initialize = (event, inputToken) => {
  console.log('trying to login with ' + inputToken)
  if (loggingIn) return
  loggingIn = true
  const t = inputToken ? inputToken : token
  client.login(t).then(
    token => {
      event.sender.send('login', 'success', token)
      loggingIn = false
      getOwner()
      setupMessageListener()
    },
    e => {
      event.sender.send('login', 'error', e)
      loggingIn = false
    }
  )
}

const setup = browserWindow => {
  if (!store) {
    console.log('setting up')
    store = createMainStore(browserWindow)
    commander = new Commander(store, commanderMessage)
    previousState = store.getState()
    store.subscribe(onStoreUpdate)

    client.on('ready', () => {
      console.log('client ready')
      client.user.setActivity('good music', {}, '', 'STREAMING')
    })

    ipcMain.on('login', initialize)
    ipcMain.on('start', setupMessageListener)
    process.on('SIGINT', () => client.destroy())
  }
}

export default setup
