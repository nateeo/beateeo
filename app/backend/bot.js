// REFACTOR ONCE WORKING

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

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

// state management
let commander

let store
let previousState

let currentDispatcher
let voiceChannel
let channel
let lastMessage

// play functions

const onDispatcherEnd = () => {
  commander.queueSkip()
}

const play = () => {
  if (currentDispatcher) currentDispatcher.end()
  voiceChannel.join().then(connection => {
    channel.send('now playing')
    const stream = ytdl(song, { filter: 'audioonly' })
    const dispatcher = connection.playStream(stream, {
      seek: 0,
      volume: store.getState().volume,
    })
  })
  currentDispatcher = dispatcher
  dispatcher.on('info', console.log)
  dispatcher.on('error', console.error)
  dispatcher.on('end', onDispatcherEnd)
}

// volume

// map new state to application effects
const onStoreUpdate = () => {
  console.log('onStoreUpdate')
  state = store.getState()
  if (previousState.queue != state.queue) {
    console.log('playing the new song')
    play()
  } else if (previousState.volume != state.volume) {
    console.log('updating volume')
    channel.send('Updating volume to ' + state.volume)
  } else if (previousState.isPlaying != state.isPlaying) {
    console.log('updating pause/play') // guaranteed to be different
    if (state.isPlaying) {
      currentDispatcher.pause()
    } else {
      currentDispatcher.resume()
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

const commanderError = msg => lastMessage.reply(msg)

// initialising and setting up

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

const setupMessageListener = () =>
  client.on('message', async message => {
    content = message.content
    if (content.startsWith(prefix) && content.length > prefix.length) {
      lastMessage = message
      channel = message.channel
      voiceChannel = message.member.voiceChannel

      input = content.split(' ')
      command = input[0].substring(prefix.length)
      args = input.slice(1)

      action = messageCommands[command]
      if (action) {
        commander[action.type](args.slice(0, action.args))
      } else {
        message.reply('Unknown command.')
      }
    }
  })

const setup = browserWindow => {
  if (!store) {
    console.log('setting up')
    store = createMainStore(browserWindow)
    commander = new Commander(store, commanderError)
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
