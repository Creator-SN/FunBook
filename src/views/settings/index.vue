<template>
    <div
        class="settings-container"
        :class="[{dark: theme === 'dark'}]"
    >
        <div class="s-row">
            <p class="s-title">{{local('Setting')}}</p>
        </div>
        <div class="scroll-view">
            <div class="s-item-block">
                <p class="s-item-title">{{local('Source')}}</p>
                <fv-button
                    :theme="theme"
                    icon="OneDriveAdd"
                    :is-box-shadow="true"
                    style="width: 150px;"
                    @click="show.addDS = true"
                >{{local('Add New Source')}}</fv-button>
                <fv-list-view
                    :value="thisDBList"
                    :theme="theme"
                    style="width: 100%; height: auto; margin-top: 15px;"
                    @chooseItem="switchDSDB($event)"
                >
                    <template v-slot:listItem="x">
                        <div class="list-view-item" :class="[{choosen: data_index === x.index, disabled: SourceIndexDisabled(x.index)}]">
                            <img draggable="false" class="icon-img" :src="img.OneDrive" alt="">
                            <p class="item-name">{{x.item.name}}</p>
                            <fv-button
                                :theme="theme"
                                class="control-btn"
                                :title="local(`Unlink this source`)"
                                @click="removeDS(x.item)"
                            >
                                <i class="ms-Icon ms-Icon--RemoveLink"></i>
                            </fv-button>
                        </div>
                    </template>
                </fv-list-view>
            </div>
            <div class="s-item-block">
                <p class="s-item-title">{{local('Theme')}}</p>
                <fv-button
                    :theme="theme"
                    fontSize="16"
                    borderRadius="50"
                    :is-box-shadow="true"
                    style="width: 40px; height: 40px;"
                    :title="theme === 'light' ? `${local('Switch to the dark theme')}` : `${local('Switch to the light theme')}`"
                    @click="toggleTheme(v)"
                >
                    <i
                        class="ms-Icon"
                        :class="[`ms-Icon--${theme === 'light' ? 'Sunny' : 'ClearNight'}`]"
                    ></i>
                </fv-button>
            </div>
            <div class="s-item-block">
                <p class="s-item-title">{{local('Language')}}</p>
                <fv-Combobox
                    v-model="cur_language"
                    :theme="theme"
                    :options="languages"
                    :placeholder="local('Choose A Language')"
                    :background="theme === 'dark' ? 'rgba(36, 36, 36, 1)' : ''"
                    @choose-item="chooseLanguage"
                ></fv-Combobox>
            </div>
        </div>
        <add-ds
            :show.sync="show.addDS"
            :theme="theme"
        >
        </add-ds>
    </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import addDs from "@/components/settings/addDs.vue";

import OneDrive from "@/assets/settings/OneDrive.svg";

export default {
    components: {
        addDs
    },
    data() {
        return {
            cur_language: {},
            languages: [
                { key: "en", text: "English" },
                { key: "cn", text: "简体中文" },
            ],
            thisDataIndex: -1,
            img: {
                OneDrive
            },
            show: {
                addDS: false,
            },
            lock: {
                switchDSDB: true,
            },
        };
    },
    watch: {
        $route() {
            this.languageInit();
        },
        language() {
            this.languageInit();
        }
    },
    computed: {
        ...mapState({
            init_status: (state) => state.init_status,
            data_index: (state) => state.data_index,
            data_path: (state) => state.data_path,
            dbList: (state) => state.dbList,
            language: (state) => state.language,
            theme: (state) => state.theme,
        }),
        ...mapGetters(["local", "cur_db"]),
        v() {
            return this;
        },
        thisDBList () {
            let pathList = this.data_path;
            let thisDBList = [];
            pathList.forEach((el, idx) => {
                thisDBList.push({
                    key: idx,
                    name: pathList[idx],
                    path: pathList[idx],
                    index: idx,
                    choosen: idx === this.data_index,
                    disabled: () => el.status === 500 || !this.lock.switchDSDB
                });
            });
            return thisDBList;
        },
        SourceIndexDisabled() {
            return (index) => {
                if (!this.dbList[index]) return true;
                if(this.data_path[index] !== this.dbList[index].key) return true;
                return !this.dbList[index].init;
            };
        },
    },
    mounted() {
        this.languageInit();
    },
    methods: {
        ...mapMutations({
            reviseConfig: "reviseConfig",
            reviseDS: "reviseDS",
            reviseData: "reviseData",
            toggleTheme: "toggleTheme",
            syncDS: "syncDS",
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
        switchDSDB(event) {
            let index = this.data_path.indexOf(event.item.path);
            if(this.SourceIndexDisabled(index)) return;
            this.lock.switchDSDB = false;
            this.reviseConfig({
                v: this,
                data_index: index,
            });
            this.lock.switchDSDB = true;
        },
        removeDS(db_item) {
            this.$infoBox(
                this.local("Are you sure to remove this data source?"),
                {
                    status: "error",
                    title: this.local("Remove Data Source"),
                    confirmTitle: this.local("Confirm"),
                    cancelTitle: this.local("Cancel"),
                    theme: this.theme,
                    confirm: () => {
                        let url = db_item.path;
                        let index = this.data_path.indexOf(url);
                        this.data_path.splice(index, 1);
                    },
                    cancel: () => {},
                }
            );
        },
    },
};
</script>

<style lang="scss">
.settings-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: whitesmoke;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s;

    &.dark {
        background: rgba(36, 36, 36, 1);

        .s-title {
            color: whitesmoke;
        }

        .scroll-view {
            .s-item-block {
                .s-item-title {
                    color: whitesmoke;
                }
            }
        }
    }

    .s-row {
        position: relative;
        margin: 25px 0px;
        padding: 0px 15px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
    }

    .s-title {
        font-size: 24px;
        user-select: none;
        cursor: default;
    }

    .scroll-view {
        position: relative;
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;

        .s-item-block {
            position: relative;
            width: calc(100% - 30px);
            height: auto;
            line-height: 2.5;
            display: flex;
            flex-direction: column;

            .s-item-title {
                user-select: none;
                cursor: default;
            }

            .list-view-item {
                position: relative;
                width: 100%;
                padding-left: 5px;
                border-left: rgba(0, 98, 158, 0) solid 5px;
                border-radius: 3px;
                display: flex;
                align-items: center;

                &.disabled
                {
                    filter: grayscale(100%);
                }

                &.choosen
                {
                    border-color: rgba(0, 98, 158, 0.6);
                }

                .icon-img
                {
                    width: 20px;
                    height: auto;
                }

                .item-name {
                    margin-left: 15px;
                    font-size: 13px;
                    flex: 1;
                }

                .control-btn {
                    width: 35px;
                    height: 35px;
                    margin-right: 5px;
                }
            }
        }
    }
}
</style>