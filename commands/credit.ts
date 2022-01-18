import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Credit',
    description: 'People who helped with the bot',

    slash: true,

    callback: (interaction) => {
        return new MessageEmbed()
        .setColor('RANDOM')
        .setDescription('Who helped with this bot')
        .setTitle('Credits')
        .setFields([
            {
                name: 'dragmine149#5048',
                value: 'Lead developer -> Bot maker'
            },
            {
                name: 'Dqrkxz#8752',
                value: 'Tester -> Speeling mistakes, and error producer.'
            }
        ])
    }
} as ICommand