import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Blacksmith',
    description: 'View materials that are possible to obtain',

    slash: true,

    callback: () => {
        let data = new FileSystem().readFile(`./Files/Resources.json`);
        let embed = new MessageEmbed()
        .setColor('RANDOM')
        .setDescription('Resources that are alvalible to be mined')
        .setTitle('Resources')
        Object.keys(data).forEach(key => {
            embed.addField(
                `Item: ${data[key].Name}`,
                `Description: ${data[key].Description}`,
                true
            )
        })

        return embed;
    }
} as ICommand