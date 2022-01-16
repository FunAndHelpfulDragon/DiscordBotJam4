import DiscordJS, {Intents, TextChannel} from 'discord.js';
import dotenv from 'dotenv';
import WOKCommands from 'wokcommands';
import path from 'path';
import mongoose from 'mongoose';
import testSchema from './test-schema';

/*
Possible to add:
- Big mine (x100 more than normal mine)
*/
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
        testServers: ["686177483430952970"],
        botOwners: ['467718535897022479'],
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

    await new Promise(resolve => setTimeout(resolve, 1.5 * 1000))

    const messageChannel = client.channels.cache.get('867115458062450779') as TextChannel
    messageChannel.send(`Bot is ready - ${new Intl.DateTimeFormat('en-GB', { "timeStyle": "medium" }).format(new Date)}`)
})

client.login(process.env.TOKEN);