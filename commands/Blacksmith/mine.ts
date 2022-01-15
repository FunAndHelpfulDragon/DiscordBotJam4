import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Blacksmith',
    description: 'Mine for resources, Resources are needed to make tools',

    // cooldown: '5m',
    slash: true,

    callback: ({interaction}) => {
        if (new FileSystem().checkIfSetup(interaction.user.id)) {
            let resources = new FileSystem().readFile('Files/Resources.json')
            let mined: any[] = []

            // console.log(resources);
            Object.keys(resources).forEach(item => {
                let newResource = Object.create(resources[item]);
                let resourceNumber = newResource['Rarity']
                let Chosen: number = Math.floor(Math.random() * resourceNumber) + 1

                if (Chosen == newResource['Rarity']) {
                    let ammount = Math.floor(Math.random() * newResource['Max']) + 1
                    newResource['Ammount'] = ammount;
                    mined = mined.concat(newResource);
                }
            })

            console.log(mined);

            let minedObjects:string = 'You Mined: ';
            
            mined.forEach(element => {
                minedObjects = minedObjects.concat(`${element.Name} (x${element.Ammount}), `);
                new FileSystem().updateInventory(interaction.user.id, element.Name, element.Ammount);
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