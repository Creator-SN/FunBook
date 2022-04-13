export class OnlineDB {
    constructor(onedriveObj) {
        this.onedriveObj = onedriveObj;
    }

    async initDB(path) {
        this.path = path;
        let pathList = this.path.split('/');
        pathList = pathList.slice(1);
        this.pathArray = [];
        for (let i = 0; i < pathList.length; i++) {
            let el = pathList[i];
            let res = {};
            if (this.pathArray.length === 0) {
                res = await this.onedriveObj.getMyDriveRootChildren();
            }
            else {
                res = await this.onedriveObj.getMyDriveItemChildren(this.pathArray[i - 1].id);
            }
            let items = res.value;
            let item = items.find(it => {
                if (it.name !== el) return false;
                if (!it.folder) return false;
                return true;
            });
            this.pathArray.push(item);
        }

        let lastRes = await this.onedriveObj.getMyDriveItemChildren(this.pathArray[this.pathArray.length - 1].id);
        let lastChildren = lastRes.value;
        let dsObj = lastChildren.find(it => {
            if (it.name !== 'data_structure.json') return false;
            if (!it.file) return false;
            if (it.file.mimeType !== 'application/json') return false;
            return true;
        });
        dsObj = JSON.parse(JSON.stringify(dsObj));
        let dsBlob = await this.onedriveObj.getMyDriveItemFile(dsObj);
        let ds = await this.readAsText(dsBlob);
        ds = JSON.parse(ds);
        this.ds = ds;
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
}