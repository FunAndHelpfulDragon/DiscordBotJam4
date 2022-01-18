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
                            let resources = recipe[key]['Resources']; // need
                            let possible_resource: any, Gems: any;
                            try {
                                possible_resource = recipe[key]['Possible_Resources']; // 1 only
                            } catch (_) {
                                // no possible resource, all are needed.
                            }
                            try {
                                Gems = recipe[key]['Gems']; // option, can have more than 1
                            } catch (_) {
                                // no gems in the build.
                            }

                            let Missing = [];
                            let Make = false;
                            Object.keys(resources).forEach(resource => {
                                try {
                                    let amount = data.Inventory[resource].amount;
                                    let cost = resources[resource] * Amount_G;

                                    let total = amount - cost; // produces total, if `-` missing items

                                    if (total < 0) {
                                        Missing.push([
                                            resource,
                                            Math.abs(total)
                                        ])
                                    } else {
                                        Make = true;
                                    }
                                } catch (_) {
                                    Make = false;
                                    return;
                                }
                            })
                            let has = null;
                            if (possible_resource != null) {
                                Object.keys(possible_resource).forEach(pResouce => {
                                    // Take first one by default
                                    try {
                                        let amount = data.Inventory[pResouce].Amount;
                                        let cost = possible_resource[pResouce] * Amount_G;
                                        let total = amount - cost;

                                        if (total >= 0) {
                                            has = pResouce;
                                            return;
                                        }
                                    } catch (_) {
                                        has = null;
                                    }
                                })   
                            }
                            let Gem_Has = null;
                            if (Gems != null) {
                                Object.keys(Gems).forEach(gem => {
                                    console.log(gem);
                                    // Take first one by default
                                    try {
                                        let amount = data.Inventory[gem.toString()].Amount;
                                        let cost = Gems[gem] * Amount_G;
                                        let total = amount - cost;
                                        console.log({amount, cost, total});

                                        if (total >= 0) {
                                            Gem_Has = gem;
                                            return;
                                        }
                                    } catch (_) {
                                        Gem_Has = null;
                                    }
                                })
                            }

                            if (Make) {
                                // remove item from inventory
                                let extra = "";
                                if (has != null) {
                                    new FileSystem().updateInventory(interaction.user.id, has, -(possible_resource[has] * Amount_G));
                                    extra = ` - ${has}`;
                                }
                                console.log(Gem_Has);
                                if (Gem_Has != null) {
                                    new FileSystem().updateInventory(interaction.user.id, Gem_Has, -(Gems[Gem_Has] * Amount_G));
                                    extra += ` with ${Gem_Has} gem.`;
                                }
                                console.log(extra);
                                Object.keys(resources).forEach(key2 => {
                                    new FileSystem().updateInventory(interaction.user.id, key2, -resources[key2] * Amount_G);
                                })
                                new FileSystem().updateInventory(interaction.user.id, recipe[key].Name + extra, 1 * Amount_G);
                                new FileSystem().updateData(interaction.user.id, 'Time', interaction.createdTimestamp.toString());
                                new FileSystem().updateData(interaction.user.id, 'Cooldown', recipe[key].Time);

                                interaction.reply({
                                    content: `Made ${1 * Amount_G} ${recipe[key].Name}${extra}`,
                                    ephemeral: true
                                })

                            } else if (has) {
                                interaction.reply({
                                    content: 'You do not have the needed resources for this item',
                                    ephemeral: true
                                });
                            } else if (Make) {
                                interaction.reply({
                                    content: 'You have 1 of the possible resources, not the main resources though',
                                    ephemeral: true
                                });
                            } else {
                                interaction.reply({
                                    content: 'You have none of the resources to make this item',
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
            } else if (interaction.customId == 'amount') {
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
            .setFooter('() = ammount required, {} = optional items')
        
            Object.keys(recipe).forEach(key => {
                let recipeString: string = '';

                Object.keys(recipe[key]['Resources']).forEach(key2 => {
                    recipeString = `${recipeString}${key2} (x${recipe[key]['Resources'][key2]}), `
                })
                let addition = "";
                try {
                    addition += "{";
                    Object.keys(recipe[key]['Possible_Resources']).forEach(key3 => {
                        addition += `${key3} (x${recipe[key]['Possible_Resources'][key3]}), `
                    })
                    addition += "}";
                } catch (e) {
                    addition = "";
                    // do nothing, no extra stuff.
                }
                embed.addField(
                    recipe[key]['Name'],
                    'recipe: ' + recipeString + addition
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
                .setCustomId('amount')
                .setPlaceholder('amount to make')
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
                    },
                    {
                        label: "10000",
                        value: "10000"
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