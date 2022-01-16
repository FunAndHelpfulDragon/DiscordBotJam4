import { ICommand } from "wokcommands";
import { FileSystem } from "../../FileSystem";

export default {
    category: 'Files',
    description: 'Setups data for the user',

    guildOnly: true,
    slash: true,

    callback: ({interaction}) => {
        new FileSystem().setup(interaction.member!.user.id);
        interaction.reply({
            content: 'Your data has been setup!',
            ephemeral: true
        })
    }
} as ICommand