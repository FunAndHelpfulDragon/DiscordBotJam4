import { ButtonInteraction, Client, ClientUser, MessageActionRow, MessageButton } from "discord.js";
import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Blacksmith',
    description: 'Trade with others, Help each other out',

    slash: true,
    options: [
        {
            name: 'player',
            description: 'The player you want to trade with',
            type: 'USER',
            required: true
        },
        {
            name: 'item',
            description: 'The item you want to trade',
            type: 'STRING',
            required: true
        },
        {
            name: 'amount',
            description: 'How much of the item you want to trade',
            type: 'STRING',
            required: true
        },
        {
            name: 'wanted_item',
            description: 'What you want from the other end of this trade',
            type: 'STRING',
            required: true
        },
        {
            name: 'wanted_amount',
            description: 'How much of the item you want',
            type: 'STRING',
            required: true
        }
    ],

    guildOnly: true,
    cooldown: "1m",
    ///trade player:@DiscordBotJam4#1470 item:Cobblestone Amount:1000 wanted_item:Iron wanted_Amount:50 
    ///trade player:@Dqrkxz#8752 item:Cobblestone ammount:22940 wanted_item:??? wanted_ammount:1 
    callback: ({interaction}) => {
        if (new FileSystem().checkIfSetup(interaction.user.id)) {

            console.log(interaction.options);

            let player = interaction.options.getUser('player');
            if (player!.id != interaction.user.id) {
                let item = interaction.options.getString('item');
                let Amount = interaction.options.getString('amount');
                let wanted_Item = interaction.options.getString('wanted_item');
                let wanted_Amount = interaction.options.getString('wanted_amount');

                let recipeData = new FileSystem().readFile(`./Files/recipes.json`);
                let resourcesData = new FileSystem().readFile(`./Files/Resources.json`);
                let UsrData = new FileSystem().readFile(`./Data/${interaction.user.id}.txt`);
                if (new FileSystem().checkIfSetup(player!.id)) {
                    let PlrData = new FileSystem().readFile(`./Data/${player!.id}.txt`);

                    // Checks if all the values are acceptable (both parties have them)
                    let AcceptableTrade: any[] = [
                        false,
                        false,
                        false,
                        false,
                    ];

                    function findItem(item2: string) {
                        if (item == item2) {
                            AcceptableTrade[0] = true;
                        }
                        if (wanted_Item == item2) {
                            AcceptableTrade[2] = true;
                        }
                    }
                    Object.keys(recipeData).forEach(key => {
                        let foundItem = recipeData[key].Name;
                        findItem(foundItem);
                    })
                    Object.keys(resourcesData).forEach(key => {
                        let foundItem = resourcesData[key].Name;
                        findItem(foundItem);
                    })

                    if (AcceptableTrade[0] && AcceptableTrade[2]) {
                        if (UsrData.Inventory[item!].Amount >= Number.parseInt(Amount!)) {
                            AcceptableTrade[1] = true;
                        }
                        if (PlrData.Inventory[wanted_Item!].Amount >= Number.parseInt(wanted_Amount!)) {
                            AcceptableTrade[3] = true;
                        }

                        console.log(AcceptableTrade);
                        if (AcceptableTrade[1] && AcceptableTrade[3]) {

                            let row = new MessageActionRow()
                            .addComponents([
                                new MessageButton()
                                .setCustomId('accept')
                                .setEmoji('✅')
                                .setLabel('Accept Trade')
                                .setStyle('SUCCESS')
                            ])
                            .addComponents([
                                new MessageButton()
                                .setCustomId('reject')
                                .setEmoji('❌')
                                .setLabel('Reject Trade')
                                .setStyle('DANGER')
                            ])

                            interaction.reply({
                                content: `<@${interaction.user.id}> wants to trade with <@${player!.id}>:\n`+
                                        `<@${player!.id}>: ${wanted_Item!} (x${wanted_Amount!})\n` +
                                        `<@${interaction.user.id}>: ${item!} (x${Amount!})\n\n` +
                                        `<@${player!.id}>, do you accept this trade?`,
                                components: [row]
                            })

                            const filter = (btn: any) => {
                                return btn.user.id == player!.id
                            }

                            const collector = interaction.channel!.createMessageComponentCollector({
                                filter,
                                max: 1
                            })

                            collector.on('end', async (collected) => {
                                if (collected.first()?.customId == 'accept') {
                                    new FileSystem().updateInventory(player!.id, wanted_Item!, -wanted_Amount!);
                                    new FileSystem().updateInventory(interaction.user.id, item!, -Amount!);
                                    new FileSystem().updateInventory(player!.id, item!, +Amount!);
                                    new FileSystem().updateInventory(interaction.user.id, wanted_Item!, +wanted_Amount!);

                                    interaction.editReply({
                                        content: 'Trade succesful',
                                        components: []
                                    })
                                } else if (collected.first()?.customId == 'reject') {
                                    interaction.editReply({
                                        content: 'Trade declined',
                                        components: []
                                    })
                                } else {
                                    interaction.editReply({
                                        content: 'Error in the trade',
                                        components: []
                                    })
                                }
                            })
                        } else {
                            interaction.reply({
                                content: `either side doesn't has enough of the specified items`,
                                ephemeral: true
                            })
                        }
                    } else {
                        interaction.reply({
                            content: 'Please specifie items that are allowed',
                            ephemeral: true,
                        })
                    }
                } else {
                    interaction.reply({
                        content: 'The user specified has nothing to trade...',
                        ephemeral: true
                    })
                }
            } else {
                interaction.reply({
                    content: 'You can not trade with yourself!!!',
                    ephemeral: true
                })
            }
        } else {
            interaction.reply({
                content: 'Please use `/setup` to start using this bot.',
                ephemeral: true
            })
        }
    }
} as ICommand