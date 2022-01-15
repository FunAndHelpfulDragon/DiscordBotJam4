import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Blacksmith',
    description: 'Mine for resources, Just 100x more mines at once. LONGER COOLDOWN THOUGH',

    // cooldown: '10h',
    slash: true,

    callback: ({interaction}) => {
        if (new FileSystem().checkIfSetup(interaction.user.id)) {
            let mined = JSON.parse("{}");
            for (let i = 0; i < 100; i++) {
                let resources = new FileSystem().readFile('Files/Resources.json')

                // console.log(resources);
                Object.keys(resources).forEach(item => {
                    let newResource = resources[item];
                    let resourceNumber = newResource['Rarity']
                    let Chosen: number = Math.floor(Math.random() * resourceNumber) + 1

                    if (Chosen == newResource['Rarity']) {
                        let ammount = Math.floor(Math.random() * newResource['Max']) + 1
                        if (Object.keys(mined).length == 0) {
                            mined[newResource['Name']] = {
                                "Ammount": ammount
                            }
                        }

                        let contained = false;

                        Object.keys(mined).forEach(key => {
                            if (key == newResource['Name']) {
                                contained = true;
                            }
                        })

                        if (contained) {
                            mined[newResource.Name].Ammount += ammount;
                        } else {
                            mined[newResource.Name] = {
                                "Ammount": ammount
                            }
                        }
                    }
                })
            }

            let minedObjects:string = 'You Mined: ';
            
            Object.keys(mined).forEach(key => {
                minedObjects = minedObjects.concat(`${key} (x${mined[key].Ammount}), `);
                new FileSystem().updateInventory(interaction.user.id, key, mined[key].Ammount);
            })

            return minedObjects;
        } else {
            interaction.reply({
                ephemeral: true,
                content: 'Please use `/setup` to start using this bot.'
            })
        }
    }
} as ICommand