import { OnlineDB } from "@/js/onlineDB.js";

export default {
    load_ds_file
} // 暴露出去

/**
 * 初始化源数据数据库文件
 *
 */
async function load_ds_file(onedriveObj, data_path = []) {
    let db_array = [];
    if (data_path.length == 0)
        return {
            status: 404,
            msg: 'data_path is empty.',
            db_array: db_array
        };
    for (let url of data_path) {
        let ds_db = null;
        ds_db = new OnlineDB(onedriveObj);
        await ds_db.initDB(url);
        db_array.push({
            status: 200,
            msg: 'success.',
            db: ds_db
        });
    }
    return {
        status: 200,
        msg: 'success.',
        db_array: db_array
    };
}