import { OnlineDB } from "@/js/onlineDB.js";
import { GraphAPI } from "msgraphapi"

export default {
    load_ds_file
} // 暴露出去

/**
 * 初始化源数据数据库文件
 * @param {GraphAPI} graphAPI GraphAPI对象
 */
async function load_ds_file(graphAPI, data_path = [], progressUpdater = null) {
    let dbXList = [];
    if (data_path.length == 0)
        return {
            status: 404,
            msg: 'data_path is empty.',
            dbXList: dbXList
        };
    for (let url of data_path) {
        let cur_db = null;
        cur_db = new OnlineDB(graphAPI, progressUpdater);
        await cur_db.initDB(url);
        dbXList.push({
            status: 200,
            msg: 'success.',
            db: cur_db
        });
    }
    return {
        status: 200,
        msg: 'success.',
        dbXList: dbXList
    };
}