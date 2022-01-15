import { ICommand } from "wokcommands";

export default {
    category: 'Test',
    description: 'A test command',
    testOnly: true, 
    hidden: true,
    slash: true,
    callback: () => {
        return 'Well, this worked';
    }
} as ICommand