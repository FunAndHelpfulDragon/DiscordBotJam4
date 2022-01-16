import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Help',
    description: 'Need help? This is the place',

    slash: true,

    callback: (interaction) => {
        let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription('Help! Everything to do with this bot!')
        .setTitle('Help')
        .addFields([
            {
                name: 'mine',
                value: 'Go for a mining trip, Get some resources',
                inline: true
            },
            {
                name: 'Super Mine',
                value: 'This mining trip is bigger, 100x the mines but longer cooldown',
                inline: true
            },
            {
                name: 'Inventory',
                value: 'View all the items you have recieved',
                inline: false
            },
            {
                name: 'Blacksmith',
                value: 'Create some items, Depending on the item depends on how long before you can craft a new item',
                inline: true
            },
            {
                name: 'Trade',
                value: 'Trade with others, As long as both of you have the resources, you can trade',
                inline: false
            },
            {
                name: 'View',
                value: 'View possible items that are alvalible from mining',
                inline: false
            }
        ])

        return embed;
    }
} as ICommand