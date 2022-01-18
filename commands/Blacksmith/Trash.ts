import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Blacksmith',
    description: 'Trash an item (remove it)',

    slash: true,
    options: [
        {
            name: 'item_name',
            description: 'The name of the item to trash',
            type: 'STRING',
            required: true
        }
    ],

    callback: ({interaction}) => {
        return new FileSystem().removeData(interaction.user.id, interaction.options.getString('item_name')!);
    }
} as ICommand