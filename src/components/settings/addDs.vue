<template>
    <float-window-base
        v-model="thisShow"
        :title="local('Init New Data Source')"
        :theme="theme"
    >
        <template v-slot:content>
            <div class="w-p-block">
                <p class="w-title">{{local('Data Source Name')}}</p>
                <fv-text-box
                    v-model="name"
                    :placeholder="local('Onedrive Path')"
                    :font-size="18"
                    :font-weight="'bold'"
                    underline
                    :focus-border-color="'rgba(123, 139, 209, 1)'"
                    :is-box-shadow="true"
                    style="width: 100%; height: 60px; margin-top: 15px;"
                    @keyup.enter="addDS"
                ></fv-text-box>
                <div
                    v-show="lock.loading"
                    class="tree-view-window"
                >
                    <fv-TreeView
                        v-model="treeList"
                        :theme="theme"
                        expandedIconPosition="right"
                        background="transparent"
                        :viewStyle="{backgroundColor:'transparent'}"
                        style="width: 100%; height: 100%;"
                        @click="expandItem"
                    >
                        <template v-slot:default="x">
                            <div class="tree-view-custom-item">
                                <i
                                    v-if="!x.item.loading"
                                    class="ms-Icon"
                                    :class="[`ms-Icon--${x.item.icon}`]"
                                    style="color: rgba(255, 176, 63, 1);"
                                ></i>
                                <fv-progress-ring
                                    v-else
                                    loading="true"
                                    r="10"
                                    borderWidth="2"
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
                        r="20"
                        borderWidth="5"
                    ></fv-progress-ring>
                </div>
            </div>
        </template>
        <template v-slot:control>
            <fv-button
                theme="dark"
                background="rgba(0, 153, 204, 1)"
                :disabled="name === ''"
                @click="addDS"
            >{{local('Confirm')}}</fv-button>
            <fv-button
                :theme="theme"
                @click="thisShow = false"
            >{{local('Cancel')}}</fv-button>
        </template>
    </float-window-base>
</template>

<script>
import floatWindowBase from "../window/floatWindowBase.vue";
import { mapMutations, mapState, mapGetters } from "vuex";

import OneDrive from "@/assets/settings/OneDrive.svg";

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
            name: "",
            treeList: [],
            img: {
                OneDrive,
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
            this.name = "";
            if (val) {
                this.lock.loading = true;
                this.getRootInfo();
            }
        },
    },
    computed: {
        ...mapState({
            onedrive: (state) => state.onedrive,
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
            if (this.name === "") return;
            this.data_path.push(this.name);
            await this.reviseConfig({
                v: this,
                data_path: this.data_path,
            });
            this.$emit("finished");
            this.thisShow = false;
        },
        async getRootInfo() {
            if(!this.lock.loading) return;
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
                    treeList[idx].icon = "Folder";
                    treeList[idx].children = [];
                } else treeList[idx].icon = "Document";
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
            this.name = item.path;
            // let grandParent = item;
            // while(grandParent.depth != 1) {
            //     grandParent = grandParent.parent;
            // }
            // this.$set(this.treeList, this.treeList.indexOf(grandParent), grandParent);
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
    max-height: 500px;
    margin-top: 35px;
    overflow: auto;

    .tree-view-custom-item {
        position: relative;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;

        .tree-view-custom-label {
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