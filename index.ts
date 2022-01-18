import DiscordJS, {Intents, TextChannel} from 'discord.js';
import dotenv from 'dotenv';
import WOKCommands from 'wokcommands';
import path from 'path';

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILDS
    ],
})

client.on('ready', async () => {
    console.log('Bot is ready')

    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        typeScript: true,
        testServers: [],
        botOwners: [],
        disabledDefaultCommands: [
            'help',
            'command',
            'language',
            'prefix',
            'requiredrole',
            'channelonly'
        ],
        mongoUri: process.env.MONGO_URI,
    })
    .setDefaultPrefix('?')
})

client.login(process.env.TOKEN);