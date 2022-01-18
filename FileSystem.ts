const fs = require('fs')

export class FileSystem {
    public readFile(filePath: string) {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath));
        }
        return null;
    }

    public setup(userId: string): string {
        if (!fs.existsSync('./Data')) {
            fs.mkdirSync('./Data');
        }

        if (!fs.existsSync(`./Data/${userId}.txt`)) {
            let obj = {
                Inventory: {},
                Time: "0",
                Cooldown: "0"
            };
            fs.writeFileSync(`./Data/${userId}.txt`,  JSON.stringify(obj));
            return `<@${userId}>'s data has been setup!`;
        }
        return `<@${userId}>'s data is already setup!`;
    }

    public updateInventory(userId: string, Item: string, Amount: number) {
        if (!this.checkIfSetup(userId)) {
            return false
        }
        let data = this.readFile(`./Data/${userId}.txt`)
        try {
            data['Inventory'][Item]['Amount'] = Amount + data['Inventory'][Item]['Amount'];
        } catch (_) {
            data['Inventory'][Item] = {
                Amount: Amount
            }
        }
        
        fs.writeFileSync(`./Data/${userId}.txt`, JSON.stringify(data));
        return true;
    }

    public updateData(userId: string, Data: string, NewValue: any) {
        if (!this.checkIfSetup(userId)) {
            return false;
        }
        let data = this.readFile(`./Data/${userId}.txt`)
        data[Data] = NewValue;

        fs.writeFileSync(`./Data/${userId}.txt`, JSON.stringify(data));
        return true;
    }

    public removeData(userId: string, Data: string) {
        if (!this.checkIfSetup(userId)) {
            return false;
        }
        let data = this.readFile(`./Data/${userId}.txt`)
        delete data.Inventory[Data];

        fs.writeFileSync(`./Data/${userId}.txt`, JSON.stringify(data));
        return 'Removed Data';
    }

    public checkIfSetup(userId: string) {
        return fs.existsSync(`./Data/${userId}.txt`);
    }

    public delete(userId: string): string {
        if (fs.existsSync(`./Data/${userId}.txt`)) {
            fs.unlinkSync(`./Data/${userId}.txt`);
            return "Deleted File";
        }
        return "File does not exist!";
    }

    public getFile(userId: string) {
        if (fs.existsSync(`./Data/${userId}.txt`)) {
            return `./Data/${userId}.txt`
        }
        return null
    }

    public getFolders(dir: string, sub: boolean): any[] {
        var results: any[] = []
        var files = fs.readdirSync(dir)

        for (const file of files) { //loop through all files
            var newFile = dir + "/" + file

            if (sub) { // if we want sub folders
                results.push(newFile) // add to array
                if (newFile && fs.statSync(newFile).isDirectory()) { // check for sub
                    results = results.concat(this.getFolders(newFile, sub)) // do same with sub
                }
            }
        }
        if (sub) { // return sub results
            return results
        }
        return files // return normal results
    };
}