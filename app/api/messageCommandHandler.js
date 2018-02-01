// intialise listeners to handle message commands

// get config stuff
const prefix = '!'

const commands = []

const setupListeners = client => {
  client.on('ready', () => {
    console.log('client ready')
    client.user.setActivity('good music', {}, '', 'STREAMING')
  })

  client.on('message', async message => {
    content = message.content
    if (content.startsWith(prefix) && content.length > prefix.length) {
      input = content.split(' ')
      command = input[0].substring(prefix.length)
      args = input.slice(1)

      if (commands[command]) {
        commands[command](message, args, store)
      } else {
        message.reply('Unknown command.')
      }
    }
  })
}

export default setupListeners
