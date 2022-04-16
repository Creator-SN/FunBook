<template>
    <div
        id="app"
        :class="{dark: theme == 'dark'}"
    >
        <navigation-view ref="nav"></navigation-view>
        <transition :name="(windowWidth > 768 || !show_editor) ? 'scale-up-to-up' : 'scale-down-to-down'">
            <div
                v-show="windowWidth > 768 || !show_editor"
                class="addition-container"
            >
                <div class="global-container">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </div>
        </transition>
        <editor-container></editor-container>
        <transition name="scale-up-to-up">
            <starter v-if="init_status"></starter>
        </transition>
        <progress-bar></progress-bar>
    </div>
</template>

<script>
import i18n from "@/js/i18n.js";
import progressBar from "@/components/general/progressbar.vue";
import starter from "@/components/general/starter.vue";
import navigationView from "@/components/general/navigationView.vue";
import editorContainer from "@/components/general/editorContainer.vue";
import { mapMutations, mapState, mapGetters } from "vuex";

import { data_structure } from "@/js/data_sample";
import { user, onedrive } from "./libs/msal";

export default {
    name: "App",
    components: {
        starter,
        progressBar,
        navigationView,
        editorContainer,
    },
    data() {
        return {
            show: {
                drop: false,
            },
        };
    },
    watch: {
        data_index() {
            this.syncDS();
        },
        data_path() {
            this.syncDSDB();
        },
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
            onedrive: (state) => state.onedrive,
            userInfo: (state) => state.userInfo,
            init_status: (state) => state.init_status,
            data_path: (state) => state.data_path,
            data_index: (state) => state.data_index,
            language: (state) => state.language,
            windowWidth: (state) => state.window.width,
            windowHeight: (state) => state.window.height,
            show_editor: (state) => state.editor.show,
            theme: (state) => state.theme,
        }),
        ...mapGetters(["local", "cur_db"]),
    },
    mounted() {
        this.getLocalStorage();
        this.onedirveInit();
        this.syncDSDB();
        this.i18nInit();
        this.refreshWindowSizeInit();
        if (this.$route.path !== "/") this.$Go("/");
    },
    methods: {
        ...mapMutations({
            reviseUser: "reviseUser",
            reviseOnedrive: "reviseOnedrive",
            reviseConfig: "reviseConfig",
            reviseData: "reviseData",
            reviseDS: "reviseDS",
            reviseI18N: "reviseI18N",
            setWindowSize: "setWindowSize",
            saveLocalStorage: "saveLocalStorage",
            getLocalStorage: "getLocalStorage",
            cleanLocalStorage: "cleanLocalStorage",
        }),
        i18nInit() {
            this.reviseI18N(i18n);
        },
        refreshWindowSizeInit() {
            this.timer = setInterval(() => {
                let width = document.body.clientWidth;
                let height = document.body.clientHeight;
                this.setWindowSize({
                    width,
                    height,
                });
            }, 100);
        },
        async onedirveInit() {
            this.reviseUser(user);
            this.reviseOnedrive(onedrive);
            this.updateProgress(30);
            let accountList = await this.user.getAccounts();
            if (accountList.length === 0) accountList = await this.login();

            this.updateProgress(60);
            await this.user.setActiveAccount(accountList[0]);
            this.updateProgress(90);
            let userInfo = await this.user.getActiveAccount();
            this.updateProgress(100);
            this.reviseConfig({ userInfo });
            this.updateProgress(101);
            console.log(userInfo);
        },
        async login() {
            this.user.login("redirect");
            let i = 0;
            while (i < 3000) {
                let accountList = await new Promise((resolve) => {
                    setTimeout(() => {
                        this.user.getAccounts().then((res) => {
                            resolve(res);
                        });
                    }, 100);
                });
                this.updateProgress(30 + i / 100);
                if (accountList.length > 0) {
                    i = 999999;
                    return accountList;
                }
                i = i + 1;
            }
            return [];
        },
        async syncDSDB() {
            // 同步数据库
            let pathList = this.data_path;
            let oneDriveDBXListResponse = await this.$load_ds_file(
                this.onedrive,
                pathList,
                this.updateProgress
            );
            if (oneDriveDBXListResponse.status == 404 && !this.init_status) {
                this.$barWarning(
                    this.local(
                        "There is no source, please add a data source to getting started."
                    ),
                    {
                        status: "warning",
                        autoClose: -1,
                    }
                );
                return;
            }
            let dbXList = oneDriveDBXListResponse.dbXList;
            let dbList = [];
            dbXList.forEach((el) => {
                dbList.push(el.db);
            });
            this.reviseData({
                dbList: dbList,
            });
            this.syncDS();
        },
        syncDS() {
            // sync data structure
            if (!this.cur_db) return 0;
            let _data_structure = JSON.parse(JSON.stringify(data_structure));
            Object.assign(_data_structure, this.cur_db.ds);
            _data_structure.$index = this.data_index;
            this.reviseDS(_data_structure);
        },
        updateProgress(value) {
            this.reviseConfig({
                progress: value,
            });
        },
        Go(path) {
            if (this.$route.path === path) return 0;
            this.$Go(path);
        },
    },
};
</script>

<style lang="scss">
body {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    overflow: hidden;

    * {
        font-family: "-apple-system", "HelveticaNeue";
    }
}

#app {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    display: flex;
    overflow: hidden;
    transition: all 0.3s;

    &.dark {
        background: rgba(36, 36, 36, 1);
    }

    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;

        &:hover {
            width: 10px;
        }
    }
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        border-radius: 10px;
    }
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: rgba(191, 190, 189, 0.3);
        transition: background-color 0.3s;
        cursor: pointer;

        &:hover {
            width: 16px;
            background-color: rgba(191, 190, 189, 1);
        }
    }

    .addition-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;

        .title-bar {
            position: absolute;
            z-index: 10;
        }

        .global-container {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    }

    .file-drop-mask {
        position: absolute;
        left: 5px;
        top: 5px;
        width: calc(100% - 10px);
        height: calc(100% - 10px);
        background: rgba(200, 200, 200, 0.1);
        border: rgba(200, 200, 200, 0.6) dashed 3px;
        border-radius: 8px;
        box-sizing: border-box;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        overflow: hidden;
        z-index: 6;
    }

    .move-bottom-to-top-enter-active {
        animation: moveFromBottom 0.25s ease both;
    }
    .move-bottom-to-top-leave-active {
        animation: moveToTop 0.25s ease both;
    }
    @keyframes moveFromBottom {
        from {
            transform: translateY(30%);
        }
    }
    @keyframes moveToTop {
        to {
            transform: translateY(-30%);
        }
    }
}
</style>
