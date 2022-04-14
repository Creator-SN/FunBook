export class OnlineDB {
    constructor(oneDrive) {
        this.oneDrive = oneDrive;
        this.init = false;
    }

    async initDB(path) {
        this.path = path;
        if(this.path.indexOf('/') < 0)
            this.path = this.path.replace(/\\/g, '/');
        if(this.path[0] === '/')
            this.path = this.path.slice(1);
            
        let res = await this.oneDrive.getMyDrivePathItemChildren(this.path);

        let targetChildren = res.value;
        let dsObj = targetChildren.find(it => {
            if (it.name !== 'data_structure.json') return false;
            if (!it.file) return false;
            if (it.file.mimeType !== 'application/json') return false;
            return true;
        });
        dsObj = JSON.parse(JSON.stringify(dsObj));
        let dsBlob = await this.oneDrive.getMyDriveItemFile(dsObj);
        let ds = await this.readAsText(dsBlob);
        ds = JSON.parse(ds);
        this.ds = ds;
        this.init = true;
    }

    readAsText(blob) {
        let reader = new FileReader();
        reader.readAsText(blob, 'utf-8');
        return new Promise(resolve => {
            reader.onload = data => {
                resolve(data.target.result);
            }
        });
    }

    async getFileInfo(url) {
        if(url[0] === "/") url = url.slice(1);
            let res = await this.oneDrive.getMyDrivePathItem(url);
        return res;
    }

    async readFile(url) {
        if(url[0] === "/") url = url.slice(1);
            let res = await this.oneDrive.getMyDrivePathItem(url);
        let fileBlob = await this.oneDrive.getMyDriveItemFile(res);
        return await this.readAsText(fileBlob);
    }
}