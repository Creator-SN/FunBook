//eslint-disable-next-line no-unused-vars
import { GraphAPI, Drive, DownloadType, ConflictBehavior } from "msgraphapi"
import { data_structure } from "./data_sample"

export class OnlineDB {
    /**
     * 
     * @param {GraphAPI} graphAPI 
     * @param {*} progressUpdater 
     */
    constructor(graphAPI, progressUpdater = null) {
        this.graphAPI = graphAPI
        if (progressUpdater) this.progressUpdater = progressUpdater;
        this.init = false;
        /**
         * @type {Drive}
         */
        this.root = undefined;
    }

    guid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4());
    }

    async initDB(path) {
        this.key = path;
        this.path = path;
        if (this.path.indexOf('/') < 0)
            this.path = this.path.replace(/\\/g, '/');
        if (this.path[0] === '/')
            this.path = this.path.slice(1);
        let res;
        try {
            res = await this.graphAPI.OneDrive.Drive().path(this.path).getAsync()
            // 判断是否是远程挂载的文件夹
            if (res.remoteItem !== undefined) {
                this.root = this.graphAPI.OneDrive.Drive(res.remoteItem.parentReference.driveId).item(res.remoteItem.id)
            } else {
                this.root = this.graphAPI.OneDrive.Drive().item(res.id)
            }
            res = await this.root.clone().path("data_structure.json").getAsync()
        } catch (e) {
            console.error(e)
            // 尝试创建根文件
            // 先检查是否有锁
            try {

                let lockFile = new File([], '~$data_structure.json', { type: 'application/json' });
                // 创建锁文件
                await this.root.clone().path("~$data_structure.json").uploadAsync({
                    file: lockFile,
                    conflict: ConflictBehavior.Fail
                })
                let data = Object.assign({}, data_structure)
                data.id = this.guid()
                data.name = "OneDrive"
                data.createDate = new Date().toISOString()
                // 替换根文件
                let rootFile = new File([JSON.stringify(data)], "data_structure.json", {
                    type: "application/json"
                })

                await this.root.clone().path("data_structure.json").uploadAsync({
                    file: rootFile,
                    conflict: ConflictBehavior.Replace
                })


                // 删除锁占用
                await this.root.clone().path("~$data_structure.json").delAsync()

                res = await this.root.clone().path("data_structure.json").getAsync()

            } catch (e) {
                console.error(e)
                // 创建失败
                this.updateProgress(0);
                return;
            }

        }
        if (res === undefined) {
            this.updateProgress(0);
            return;
        }

        this.updateProgress(80);
        if (this.root !== undefined) {
            let dsBlob = await this.root.clone().item(res.id).path().downloadAsync(DownloadType.Blob)
            let ds = await this.readAsText(dsBlob.content);
            this.updateProgress(100);
            ds = JSON.parse(ds);
            this.ds = ds;
            this.init = true;
            this.updateProgress(101);
        }
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
        url = url.replace(this.path, "")
        if (url[0] === "/") url = url.slice(1);
        let res = await this.root.clone().path(url).getAsync()
        return res;
    }

    async readFile(url) {
        url = url.replace(this.path, "")
        if (url[0] === "/") url = url.slice(1);
        let res = await this.root.clone().path(url).downloadAsync(DownloadType.Blob)
        return await this.readAsText(res.content);
    }

    updateProgress(value) {
        if (this.progressUpdater) this.progressUpdater(value);
    }
}