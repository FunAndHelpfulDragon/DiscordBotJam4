import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Files',
    description: 'Reset your data for this bot',

    slash: true,

    callback: (interaction) => {
        return new FileSystem().delete(interaction.user.id);
    }
} as ICommand