import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Blacksmith',
    description: 'View your inventory and all your items',

    slash: true,

    callback: ({interaction}) => {
        if (new FileSystem().checkIfSetup(interaction.user.id)) {
            let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription('Your inventory')
            .setTitle('Inventory')
            
            let data = new FileSystem().readFile(`./Data/${interaction.user.id}.txt`)['Inventory']

            Object.keys(data).forEach(key => {
                embed.addField(
                    'Item: ' + key,
                    'Ammount: ' + data[key]['Ammount'],
                    false,
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