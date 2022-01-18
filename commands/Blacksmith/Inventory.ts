import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Blacksmith',
    description: 'View your inventory and all your items',

    slash: true,

    options: [
        {
            name: 'user',
            description: 'The user you want to see the inventory of',
            type: 'USER',
        }
    ],

    callback: ({interaction}) => {
        let user = interaction.options.getUser('user');
        if (user) {
            if (new FileSystem().checkIfSetup(user.id)) {
                let embed = new MessageEmbed()
                .setColor('RANDOM')
                .setDescription(`<@${user.id}>'s inventory`)
                .setTitle('Inventory')
                
                let data = new FileSystem().readFile(`./Data/${user.id}.txt`)['Inventory']
    
                Object.keys(data).forEach(key => {
                    embed.addField(
                        'Item: ' + key,
                        'Amount: ' + data[key]['Amount'],
                        true,
                    )
                })
    
                return embed;
            } else {
                interaction.reply({
                    content: 'The user specified has not used this bot yet!',
                    ephemeral: true,
                })
            }
        } else if (new FileSystem().checkIfSetup(interaction.user.id)) {
            let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription('Your inventory')
            .setTitle('Inventory')
            
            let data = new FileSystem().readFile(`./Data/${interaction.user.id}.txt`)['Inventory']

            Object.keys(data).forEach(key => {
                embed.addField(
                    'Item: ' + key,
                    'Amount: ' + data[key]['Amount'],
                    true,
                )
            })

            return embed;
        } else {
            interaction.reply({
                content: 'Please use `/setup` to start using this bot.',
                ephemeral: true
            })
        }

    }
} as ICommand