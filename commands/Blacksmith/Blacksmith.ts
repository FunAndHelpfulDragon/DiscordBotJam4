import { Client, MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import { ICommand } from "wokcommands";
import { FileSystem } from '../../FileSystem';

let Amount_G = 1;

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
                let recipe = new FileSystem().readFile(`./Files/recipes.json`);
                const {customId, values} = interaction;

                let Time = Number.parseInt(interaction.createdTimestamp.toString());
                let Cooldown = Number.parseInt(data.Cooldown) * 60000;
                let oldMsg = Number.parseInt(data.Time);

                if (Cooldown <= (Time - oldMsg)) {
                    Object.keys(recipe).forEach(key => {
                        if (recipe[key].Name == values[0]) {
                            let resources = [recipe[key]['Resources']];
                            console.log(resources[0]);

                            try {
                                let make = true;
                                let itemMissing = '';

                                Object.keys(resources[0]).forEach(key2 => {
                                    let cost = resources[0][key2] * Amount_G;

                                    if (data.Inventory[key2].Amount < cost) {
                                        make = false;
                                        itemMissing += key2 + ', ';
                                    }
                                })

                                if (make) {
                                    Object.keys(resources[0]).forEach(key2 => {
                                        new FileSystem().updateInventory(interaction.user.id, key2, -resources[0][key2] * Amount_G);
                                    })
                                    new FileSystem().updateInventory(interaction.user.id, recipe[key].Name, 1 * Amount_G);
                                    new FileSystem().updateData(interaction.user.id, 'Time', interaction.createdTimestamp.toString());
                                    new FileSystem().updateData(interaction.user.id, 'Cooldown', recipe[key].Time);

                                    interaction.reply({
                                        content: `Made ${1 * Amount_G} ${recipe[key].Name}`,
                                        components: [],
                                        embeds: [],
                                        ephemeral: true
                                    })
                                } else {
                                    interaction.reply({
                                        content: 'You are missing [' + itemMissing + '] to make this item.',
                                        components: [],
                                        embeds: [],
                                        ephemeral: true
                                    })
                                }
                            } catch (_) {
                                interaction.reply({
                                    content: 'You are missing some resources to make this item',
                                    components: [],
                                    embeds: [],
                                    ephemeral: true
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
            } else if (interaction.customId == 'Ammount') {
                const {customId, values} = interaction;
                Amount_G = Number.parseInt(values[0]);
                interaction.reply({
                    content: 'Updated items made at once to ' + values[0],
                    ephemeral: true,
                })
            }
        })
    },

    callback: ({interaction}) => {
        if (new FileSystem().checkIfSetup(interaction.user.id)) {
            let recipe = new FileSystem().readFile(`./Files/recipes.json`);

            let embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription('Items to craft')
            .setTitle('Blacksmith Table')
        
            Object.keys(recipe).forEach(key => {
                let recipeString: string = '';

                Object.keys(recipe[key]['Resources']).forEach(key2 => {
                    recipeString = `${recipeString}${key2} (x${recipe[key]['Resources'][key2]}), `
                })
                embed.addField(
                    recipe[key]['Name'],
                    'recipe: ' + recipeString
                )
            })

            let options:any[] = []

            Object.keys(recipe).forEach(key => {
                let item:string = recipe[key]['Name']
                options = options.concat({label: item[0].toUpperCase() + item.substring(1).toLowerCase(), value: item});
            })

            let row = new MessageActionRow()
            .addComponents([
                new MessageSelectMenu()
                .setCustomId('Option')
                .setPlaceholder('What would you like to make?')
                .addOptions(options)
            ])
            let row2 = new MessageActionRow()
            .addComponents([
                new MessageSelectMenu()
                .setCustomId('Ammount')
                .setPlaceholder('Ammount to make')
                .setOptions([
                    {
                        label: '1',
                        value: "1"
                    },
                    {
                        label: "10",
                        value: "10"
                    },
                    {
                        label: "100",
                        value: "100"
                    },
                    {
                        label: "1000",
                        value: "1000"
                    }
                ])
            ])

            interaction.reply({
                embeds: [embed],
                components: [row, row2]
            })
        } else {
            interaction.reply({
                content: 'Please use `/setup` to start using this bot.',
                ephemeral: true
            })
        }
    }
} as ICommand