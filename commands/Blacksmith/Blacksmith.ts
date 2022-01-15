import { Client, MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import { ICommand } from "wokcommands";
import { FileSystem } from '../../FileSystem';

export default {
    category: 'Blacksmith',
    description: 'Actually do some blacksmithing, rather than mining all the time',

    slash: true,

    init: (client: Client) => {
        client.on('interactionCreate', async (interaction) => {
            if (!interaction.isSelectMenu()) {
                return;
            }

            if (interaction.customId == 'Option') {
                let data = new FileSystem().readFile(`./Data/${interaction.user.id}.txt`);
                let recipie = new FileSystem().readFile(`./Files/Recipies.json`);
                const {customId, values} = interaction;

                let Time = Number.parseInt(interaction.createdTimestamp.toString());
                let Cooldown = Number.parseInt(data.Cooldown) * 60000;
                let oldMsg = Number.parseInt(data.Time);

                if (Cooldown <= (Time - oldMsg)) {
                    Object.keys(recipie).forEach(key => {
                        if (recipie[key].Name == values[0]) {
                            let resources = [recipie[key]['Resources']];
                            console.log(resources[0]);

                            let make = true;
                            let itemMissing = '';

                            Object.keys(resources[0]).forEach(key2 => {
                                let cost = resources[0][key2]

                                if (data.Inventory[key2].Ammount < cost) {
                                    make = false;
                                    itemMissing += key2 + ', ';
                                }
                            })

                            if (make) {
                                Object.keys(resources[0]).forEach(key2 => {
                                    new FileSystem().updateInventory(interaction.user.id, key2, -resources[0][key2]);
                                })
                                new FileSystem().updateInventory(interaction.user.id, recipie[key].Name, 1);
                                new FileSystem().updateData(interaction.user.id, 'Time', interaction.createdTimestamp.toString());
                                new FileSystem().updateData(interaction.user.id, 'Cooldown', recipie[key].Time);

                                interaction.reply({
                                    content: 'Made 1 ' + recipie[key].Name,
                                    components: [],
                                    embeds: []
                                })
                            } else {
                                interaction.reply({
                                    content: 'You are missing -' + itemMissing + '- to make this item.',
                                    components: [],
                                    embeds: []
                                })
                            }
                        }
                    })
                } else {
                    interaction.reply({
                        content: 'Making another item is on cooldown, please wait...',
                        ephemeral: true
                    });
                }
            }
        })
    },

    callback: ({interaction}) => {
        if (new FileSystem().checkIfSetup(interaction.user.id)) {
            let recipie = new FileSystem().readFile(`./Files/Recipies.json`);

            let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription('Items to craft')
            .setTitle('Blacksmith Table')
        
            Object.keys(recipie).forEach(key => {
                let RecipieString: string = '';

                Object.keys(recipie[key]['Resources']).forEach(key2 => {
                    RecipieString = `${RecipieString}${key2} (x${recipie[key]['Resources'][key2]}), `
                })
                embed.addField(
                    recipie[key]['Name'],
                    'Recipie: ' + RecipieString
                )
            })

            let options:any[] = []

            Object.keys(recipie).forEach(key => {
                let item:string = recipie[key]['Name']
                options = options.concat({label: item[0].toUpperCase() + item.substring(1).toLowerCase(), value: item});
            })

            let row = new MessageActionRow()
            .addComponents([
                new MessageSelectMenu()
                .setCustomId('Option')
                .setPlaceholder('What would you like to make?')
                .addOptions(options)
                // .addOptions([
                //     {
                //         label: 'Sword',
                //         value: 'sword'
                //     }
                // ])
            ])

            interaction.reply({
                content: 'Test',
                embeds: [embed],
                components: [row]
            })
        } else {
            interaction.reply({
                content: 'Please use `/setup` to start using this bot.',
                ephemeral: true
            })
        }
    }
} as ICommand