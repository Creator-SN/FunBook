<template>
    <div
        id="app"
        :class="{dark: theme == 'dark'}"
    >
        <navigation-view></navigation-view>
        <div class="addition-container">
            <div class="global-container">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <editor-container></editor-container>
    </div>
</template>

<script>
import i18n from "@/js/i18n.js";
import navigationView from "@/components/general/navigationView.vue";
import editorContainer from "@/components/general/editorContainer.vue";
import { mapMutations, mapState, mapGetters } from "vuex";

import { client, OneDrive } from "./libs/msla";

export default {
    name: "App",
    components: {
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
        data_path() {
            this.syncDSDB();
        },
    },
    computed: {
        ...mapState({
            onedrive: state => state.onedrive,
            init_status: (state) => state.init_status,
            data_path: (state) => state.data_path,
            language: (state) => state.language,
            show_editor: (state) => state.editor.show,
            theme: (state) => state.theme,
        }),
        ...mapGetters(["local"]),
    },
    mounted() {
        this.onedirveInit();
        this.syncDSDB();
        this.i18nInit();
        if (this.$route.path !== "/") this.$Go("/");
    },
    methods: {
        ...mapMutations({
            reviseOnedrive: "reviseOnedrive",
            reviseConfig: "reviseConfig",
            reviseData: "reviseData",
            reviseI18N: "reviseI18N",
        }),
        i18nInit() {
            this.reviseI18N(i18n);
        },
        onedirveInit () {
            this.reviseOnedrive(new OneDrive(client));
        },
        async syncDSDB() {
            let pathList = this.data_path;
            let db_array_result = await this.$load_ds_file(this.onedrive, pathList);
            if (db_array_result.status == 404 && !this.init_status) {
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
            let db_array = db_array_result.db_array;
            let ds_db_list = [];
            db_array.forEach((el) => {
                ds_db_list.push(el.db);
            });
            this.reviseData({
                ds_db_list: ds_db_list,
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
    /*定义滚动条轨道
 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        border-radius: 10px;
    }
    /*定义滑块
 内阴影+圆角*/
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
