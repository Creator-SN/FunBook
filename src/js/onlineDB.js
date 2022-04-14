export class OnlineDB {
    constructor(oneDrive, progressUpdater=null) {
        this.oneDrive = oneDrive;
        if(progressUpdater) this.progressUpdater = progressUpdater;
        this.init = false;
    }

    async initDB(path) {
        this.key = path;
        this.path = path;
        if(this.path.indexOf('/') < 0)
            this.path = this.path.replace(/\\/g, '/');
        if(this.path[0] === '/')
            this.path = this.path.slice(1);
            
        let res = await this.oneDrive.getMyDrivePathItemChildren(this.path);
        this.updateProgress(30);

        let targetChildren = res.value;
        let dsObj = targetChildren.find(it => {
            if (it.name !== 'data_structure.json') return false;
            if (!it.file) return false;
            if (it.file.mimeType !== 'application/json') return false;
            return true;
        });
        this.updateProgress(80);
        dsObj = JSON.parse(JSON.stringify(dsObj));
        let dsBlob = await this.oneDrive.getMyDriveItemFile(dsObj);
        let ds = await this.readAsText(dsBlob);
        this.updateProgress(100);
        ds = JSON.parse(ds);
        this.ds = ds;
        this.init = true;
        this.updateProgress(101);
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

    updateProgress (value) {
        if(this.progressUpdater) this.progressUpdater(value);
    }
}