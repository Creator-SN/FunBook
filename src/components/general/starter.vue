<template>
    <div class="ikfb-starter-container">
        <fv-button
            v-show="step > 2"
            theme="dark"
            background="rgba(29, 85, 125, 1)"
            :border-radius="50"
            class="left"
            style="width: 30px; height: 30px;"
            @click="step > 0 ? step-- : step"
        ><i class="ms-Icon ms-Icon--ChevronLeftMed"></i></fv-button>
        <fv-button
            theme="dark"
            background="rgba(29, 85, 125, 1)"
            :border-radius="50"
            class="right"
            style="width: 80px; height: 30px;"
            @click="close"
        >{{local('Skip')}}</fv-button>
        <transition name="scale-up-to-up">
            <div
                v-show="step === 0"
                class="item-block"
            >
                <fv-img
                    :src="logo"
                    style="width: 80px; height: auto;"
                ></fv-img>
                <p class="logo-title">{{local('IKFB')}} PWA</p>
                <fv-button
                    theme="dark"
                    background="rgba(0, 130, 180, 1)"
                    class="starter-btn"
                    @click="step++"
                >{{local('Start')}}</fv-button>
            </div>
        </transition>
        <transition name="scale-up-to-up">
            <div
                v-show="step === 1"
                class="item-block"
            >
                <p class="title">{{local(`Choose Language`)}}</p>
                <fv-Combobox
                    v-model="cur_language"
                    theme="dark"
                    :options="languages"
                    :placeholder="local('Choose A Language')"
                    background="rgba(36, 36, 36, 1)"
                    @choose-item="chooseLanguage"
                ></fv-Combobox>
                <fv-button
                    theme="dark"
                    background="rgba(0, 130, 180, 1)"
                    class="starter-btn"
                    style="margin-top: 15px;"
                    @click="step++"
                >{{local('Confirm')}}</fv-button>
            </div>
        </transition>
        <transition name="scale-up-to-up">
            <div
                v-show="step === 2"
                class="item-block"
            >
                <p class="title">{{local(`New Data Dource`)}}</p>
                <fv-Breadcrumb
                    v-model="path"
                    theme="dark"
                    :readOnly="false"
                    style="width: 100%; max-width: 768px; height: 30px; margin-top: 15px;"
                    @keyup.native.enter="chooseSource"
                >
                </fv-Breadcrumb>
                <div
                    v-show="lock.loading"
                    class="tree-view-window"
                >
                    <fv-TreeView
                        v-model="treeList"
                        theme="dark"
                        expandedIconPosition="right"
                        :background="'rgba(58, 118, 146, 1)'"
                        :view-style="{backgroundColor: 'rgba(58, 118, 146, 1)', backgroundColorHover: 'rgba(58, 118, 146, 1)'}"
                        style="width: 100%; height: 100%; overflow: auto;"
                        @click="expandItem"
                    >
                        <template v-slot:default="x">
                            <div class="tree-view-custom-item">
                                <img
                                    v-if="!x.item.loading"
                                    draggable="false"
                                    class="icon-img"
                                    :src="x.item.icon"
                                    alt=""
                                >
                                <fv-progress-ring
                                    v-else
                                    loading="true"
                                    r="10"
                                    borderWidth="2"
                                    background="rgba(200, 200, 200, 0.1)"
                                    style="display: flex; align-item: center;"
                                ></fv-progress-ring>
                                <p class="tree-view-custom-label">{{x.item.name}}</p>
                            </div>
                        </template>
                    </fv-TreeView>
                </div>
                <div
                    v-show="!lock.loading"
                    class="loading-block"
                >
                    <fv-img
                        draggable="false"
                        :src="img.OneDrive"
                        style="width: 90px; height: auto; margin: 15px;"
                    ></fv-img>
                    <fv-progress-ring
                        loading="true"
                        r="15"
                        borderWidth="3"
                        background="rgba(200, 200, 200, 0.1)"
                    ></fv-progress-ring>
                </div>
                <fv-button
                    theme="dark"
                    background="rgba(0, 130, 180, 1)"
                    :disabled="path === ''"
                    class="starter-btn"
                    @click="chooseSource"
                >{{local('Confirm')}}</fv-button>
            </div>
        </transition>
    </div>
</template>

<script>
import logo from "../../assets/logo.svg";
import { mapMutations, mapState, mapGetters } from "vuex";

import OneDrive from "@/assets/settings/OneDrive.svg";
import folder from "@/assets/settings/folder.svg";
import file from "@/assets/settings/file.svg";

export default {
    data() {
        return {
            logo: logo,
            step: 0,
            treeList: [],
            cur_language: {},
            languages: [
                { key: "en", text: "English" },
                { key: "cn", text: "简体中文" },
            ],
            path: "",
            img: {
                OneDrive,
                folder,
                file,
            },
            lock: {
                loading: true,
            },
        };
    },
    watch: {
        step(val) {
            if (val === 2) this.getRootInfo();
        },
    },
    computed: {
        ...mapState({
            onedrive: (state) => state.onedrive,
            data_path: (state) => state.data_path,
            data_index: (state) => state.data_index,
            dbList: (state) => state.dbList,
            language: (state) => state.language,
            theme: (state) => state.theme,
        }),
        ...mapGetters(["local", "cur_db"]),
        SourceIndexDisabled() {
            return (index) => {
                if (!this.dbList[index]) return true;
                let id = this.dbList[index].get("id").write();
                return id === null;
            };
        },
    },
    mounted() {
        this.languageInit();
    },
    methods: {
        ...mapMutations({
            reviseConfig: "reviseConfig",
            reviseData: "reviseData",
            reviseDS: "reviseDS",
        }),
        languageInit() {
            this.cur_language = this.languages.find(
                (item) => item.key === this.language
            );
        },
        chooseLanguage(item) {
            this.reviseConfig({
                v: this,
                language: item.key,
            });
        },
        async chooseSource() {
            if (this.path === "") return;
            this.data_path.push(this.path);
            await this.reviseConfig({
                v: this,
                data_path: this.data_path,
            });
            this.close();
        },
        async getRootInfo() {
            if (!this.lock.loading) return;
            this.lock.loading = false;
            let res = await this.onedrive.getMyDriveRootChildren();
            if (res.value) {
                let treeList = this.onedriveChildrenFormat(res.value);
                this.treeList = treeList;
            }
            this.lock.loading = true;
        },
        onedriveChildrenFormat(arr, parent = null) {
            let treeList = arr;
            treeList.forEach((el, idx) => {
                if (el.folder) {
                    treeList[idx].icon = this.img.folder;
                    treeList[idx].children = [];
                } else treeList[idx].icon = this.img.file;
                treeList[idx].loading = false;
                treeList[idx].finished = false;
                treeList[idx].depth = parent ? parent.depth + 1 : 1;
                treeList[idx].parent = parent;
                treeList[idx].path = parent
                    ? parent.path + "/" + treeList[idx].name
                    : treeList[idx].name;
            });
            return treeList;
        },
        async expandItem(item) {
            this.path = item.path;
            if (!item.folder) return;
            if (item.finished) return;
            item.loading = true;
            let children = await this.onedrive.getMyDriveItemChildren(item.id);
            if (children.value) {
                item.children = this.onedriveChildrenFormat(
                    children.value,
                    item
                );
            }
            item.finished = true;
            item.loading = false;
            // let grandParent = item;
            // while(grandParent.depth != 1) {
            //     grandParent = grandParent.parent;
            // }
            // this.$set(this.treeList, this.treeList.indexOf(grandParent), grandParent);
        },
        close() {
            this.reviseConfig({
                v: this,
                init_status: false,
            });
        },
    },
};
</script>

<style lang="scss">
.ikfb-starter-container {
    @include HcenterVcenter;

    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    background: rgba(29, 84, 125, 0.8);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    z-index: 6;

    .left {
        position: absolute;
        left: 15px;
        top: 65px;
        z-index: 2;
    }

    .right {
        position: absolute;
        right: 15px;
        top: 65px;
        z-index: 2;
    }

    .item-block {
        @include HcenterVcenterC;

        position: absolute;
        width: 100%;
        height: 100%;
        line-height: 2;

        .logo-title {
            margin-bottom: 25px;
            font-size: 20px;
            color: whitesmoke;
        }

        .title {
            margin-bottom: 25px;
            font-size: 20px;
            color: whitesmoke;
        }

        .starter-btn {
            width: 150px;
            height: 40px;
            margin: 15px 0px;
        }
    }

    .tree-view-window {
        position: relative;
        flex: 1;
        width: 100%;
        max-width: 800px;
        max-height: 300px;
        margin-top: 35px;
        overflow: auto;

        .tree-view-custom-item {
            position: relative;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            align-items: center;

            .icon-img {
                width: 20px;
                height: auto;
            }

            .tree-view-custom-label {
                @include nowrap;

                margin-left: 5px;
            }

            .tree-view-custom-text-box {
                margin-left: 5px;
            }

            .tree-view-custom-confirm {
                width: 30px;
                height: 30px;
                flex-shrink: 0;
                margin-left: 5px;
                margin-right: 25px;

                i.ms-Icon {
                    margin: 0px;
                    padding: 0px;
                    display: flex;
                    align-items: center;
                }
            }
        }
    }

    .loading-block {
        @include HcenterVcenterC;

        position: relative;
        width: 100%;
        height: 100%;
        flex: 1;
        margin-top: 35px;
    }
}
</style>