// intialise listeners to handle message commands

const setupListeners = client => {
  client.on('ready', () => {
    console.log('client ready')
    client.user.setActivity('good music', {}, '', 'STREAMING')
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

    // todo dynamically load commands

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

  console.log('initialised message command handler')
}

export setupListeners