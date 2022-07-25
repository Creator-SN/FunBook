<template>
    <float-window-base v-model="thisShow" :title="local('Init New Data Source')" :theme="theme">
        <template v-slot:content>
            <div class="w-p-block" style="height: 100%;">
                <p class="w-title">{{ local('Data Source Name') }}</p>
                <fv-Breadcrumb v-model="path" :theme="theme" :readOnly="false"
                    style="width: 100%; height: 30px; margin-top: 15px;" @keyup.native.enter="addDS">
                </fv-Breadcrumb>
                <div v-show="lock.loading" class="tree-view-window">
                    <fv-TreeView v-model="treeList" :theme="theme" expandedIconPosition="right"
                        :background="theme == 'dark' ? 'rgba(45, 45, 45, 1)' : 'rgba(255, 255, 255, 1)'"
                        :view-style="{ backgroundColor: theme == 'dark' ? 'rgba(45, 45, 45, 1)' : 'rgba(255, 255, 255, 1)', backgroundColorHover: theme == 'dark' ? 'rgba(200, 200, 200, 0.1)' : 'rgba(255, 255, 255, 1)' }"
                        style="width: 100%; height: 100%; overflow: auto;" @click="expandItem">
                        <template v-slot:default="x">
                            <div class="tree-view-custom-item">
                                <img v-if="!x.item.loading" draggable="false" class="icon-img" :src="x.item.icon"
                                    alt="">
                                <fv-progress-ring v-else loading="true" r="10" borderWidth="2"
                                    background="rgba(200, 200, 200, 0.1)" style="display: flex; align-item: center;">
                                </fv-progress-ring>
                                <p class="tree-view-custom-label">{{ x.item.name }}</p>
                            </div>
                        </template>
                    </fv-TreeView>
                </div>
                <div v-show="!lock.loading" class="loading-block">
                    <fv-img draggable="false" :src="img.OneDrive" style="width: 90px; height: auto; margin: 15px;">
                    </fv-img>
                    <fv-progress-ring loading="true" r="15" borderWidth="3" background="rgba(200, 200, 200, 0.1)">
                    </fv-progress-ring>
                </div>
            </div>
        </template>
        <template v-slot:control>
            <fv-button theme="dark" background="rgba(0, 153, 204, 1)" :disabled="path === ''" @click="addDS">
                {{ local('Confirm') }}</fv-button>
            <fv-button :theme="theme" @click="thisShow = false">{{ local('Cancel') }}</fv-button>
        </template>
    </float-window-base>
</template>

<script>
import floatWindowBase from "../window/floatWindowBase.vue";
import { mapMutations, mapState, mapGetters } from "vuex";
import { GraphAPI } from "msgraphapi";
import OneDrive from "@/assets/settings/OneDrive.svg";
import folder from "@/assets/settings/folder.svg";
import file from "@/assets/settings/file.svg";

export default {
    components: {
        floatWindowBase,
    },
    props: {
        show: {
            default: false,
        },
    },
    data() {
        return {
            thisShow: this.show,
            path: "",
            treeList: [],
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
        show(val) {
            this.thisShow = val;
        },
        thisShow(val) {
            this.$emit("update:show", val);
            this.path = "";
            if (val) {
                this.lock.loading = true;
                this.getRootInfo();
            }
        },
    },
    computed: {
        ...mapState({
            /**
             * @returns {GraphAPI}
             */
            graphAPI: (state) => state.graphAPI,
            data_path: (state) => state.data_path,
            language: (state) => state.language,
            dbList: (state) => state.dbList,
            theme: (state) => state.theme,
        }),
        ...mapGetters(["local"]),
        v() {
            return this;
        },
    },
    methods: {
        ...mapMutations({
            reviseConfig: "reviseConfig",
        }),
        async addDS() {
            if (this.path === "") return;
            this.data_path.push(this.path);
            await this.reviseConfig({
                v: this,
                data_path: this.data_path,
            });
            this.$emit("finished");
            this.thisShow = false;
        },
        async getRootInfo() {
            if (!this.lock.loading) return;
            this.lock.loading = false;
            let res = await this.graphAPI.OneDrive.Drive().listAsync();
            if (res) {
                let treeList = this.onedriveChildrenFormat(res);
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
            let children = await this.graphAPI.OneDrive.Drive().item(item.id).listAsync()
            if (children) {
                item.children = this.onedriveChildrenFormat(
                    children,
                    item
                );
            }
            item.finished = true;
            item.loading = false;
        },
    },
};
</script>

<style lang="scss">
.tree-view-window {
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
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
    max-height: 500px;
    flex: 1;
    margin-top: 35px;
}
</style>