import Discord from 'discord.js'
const client = new Discord.Client()
let store

const setup = browserWindow => {
  if (!store) {
    store = createMainStore(browserWindow)

    client.on('ready', () => {
      client.user.setActivity('good music', {}, '', 'STREAMING')
    })
    process.on('SIGINT', () => client.destroy())
  }
}
