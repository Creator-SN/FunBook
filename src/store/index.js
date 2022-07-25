import Vue from "vue";
import Vuex from "vuex";
import { ConflictBehavior, Drive, GraphAPI } from "msgraphapi"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        // config //
        init_status: true,
        data_path: [],
        data_index: -1,
        language: 'en',
        theme: 'light',
        // OneDrive //
        /**
         * @type {GraphAPI}
         */
        graphAPI: null,
        /**
         * @type {Drive}
         */
        root: null,
        userInfo: null,
        progress: 0,
        // ds //
        data_structure: {
            id: null,
            name: null,
            groups: [],
            partitions: [],
            items: [],
            templates: [],
            path: null,
            createDate: null,
        },
        //
        editor: {
            show: false,
            type: null,
            item: null,
            target: null,
            scrollTop: 0,
            history: []
        },
        window: {
            width: 0,
            height: 0,
            mobileDisplay: 768
        },
        dbList: [],
        i18n: {}
    },
    mutations: {
        setGraphAPI(state, graphAPI) {
            state.graphAPI = graphAPI;
        },
        setRootAPI(state, root) {
            state.root = root;
        },
        reviseConfig(state, obj) {
            for (let key in obj) {
                if (key === 'v' || state[key] === undefined)
                    continue;
                state[key] = obj[key];
                // obj.v.$config_db.set(key, state[key]).write();
                this.commit('saveLocalStorage');
            }
        },
        reviseDS(state, obj) {
            for (let key in obj) {
                if (key === '$index' || state.data_structure[key] === undefined)
                    continue;
                state.data_structure[key] = obj[key];
                // state.dbList[obj.$index].set(key, state.data_structure[key]).write();
            }
             // 应该经过四个部分——上锁，版本对比（需要保存上一个版本副本），修改，释放锁
            // TODO: 版本控制  
            if (state.root !== null) {
                // 创建锁文件
                const lockFile = new File([], "~$data_structure.json", {
                    type: "application/json"
                })
                state.root.clone().path(lockFile.name).uploadAsync({
                    file: lockFile,
                    conflict: ConflictBehavior.Fail
                }).then(() => {
                    const file = new File([JSON.stringify(state.data_structure)], "data_structure.json", {
                        type: "application/json"
                    })
                    state.root.clone().path(file.name).uploadAsync({
                        file,
                        conflict: ConflictBehavior.Replace
                    }).then(()=>{
                        state.root.clone().path(lockFile.name).delAsync()
                    })
                })
            }
        },
        reviseData(state, obj) {
            for (let key in obj) {
                if (state[key] === undefined)
                    continue;
                state[key] = obj[key];
            }
        },
        reviseEditor(state, obj) {
            for (let key in obj) {
                if (state.editor[key] === undefined)
                    continue;
                state.editor[key] = obj[key];
            }
        },
        reviseI18N(state, i18n) {
            state.i18n = i18n
        },
        setWindowSize(state, obj) {
            state.window.width = obj.width;
            state.window.height = obj.height;
        },
        saveLocalStorage(state) {
            localStorage.setItem("configCache", JSON.stringify({
                init_status: state.init_status,
                data_path: state.data_path,
                data_index: state.data_index,
                language: state.language,
                theme: state.theme,
            }));
        },
        getLocalStorage(state) {
            let configCache = localStorage.getItem("configCache");
            if (configCache) {
                let config = JSON.parse(configCache);
                state.init_status = config.init_status;
                state.data_path = config.data_path;
                state.data_index = config.data_index;
                state.language = config.language;
                state.theme = config.theme;
            }
        },
        cleanLocalStorage() {
            localStorage.removeItem("configCache");
        },
        toggleTheme(state, v) {
            if (state.theme == 'light') {
                state.theme = 'dark'
            } else {
                state.theme = 'light'
            }
            if (v)
                console.log(state.theme);
            // v.$config_db.set('theme', state.theme).write();
            document.querySelector('meta[name="theme-color"]').setAttribute('content', state.theme === 'light' ? 'rgba(245, 245, 245, 1)' : 'rgba(36, 36, 36, 1)');
            this.commit('saveLocalStorage');
        },
        toggleEditor(state, status) {
            state.editor.show = status;
        }
    },
    actions: {},
    getters: {
        local: state => text => {
            let result = state.i18n[text];
            if (!result)
                return text;
            return result[state.language];
        },
        cur_db: state => {
            if (state.data_index < 0)
                return null;
            if (!state.dbList[state.data_index])
                return null;
            return state.dbList[state.data_index];
        }
    },
    modules: {

    }
});