<template>
    <float-window-base v-model="thisShow" :title="local('Add Page')" :theme="theme">
        <template v-slot:content>
            <div class="w-p-block">
                <p class="w-title">{{ local('Page Name') }}</p>
                <fv-text-box v-model="name" :placeholder="local('Input page name...')" :theme="theme" :font-size="18"
                    :font-weight="'bold'" underline :focus-border-color="'rgba(123, 139, 209, 1)'" :is-box-shadow="true"
                    style="width: 100%; height: 60px; margin-top: 15px;" @keyup.enter="add"></fv-text-box>
            </div>
            <div class="w-p-block">
                <p class="w-title">{{ local('From Template') }}</p>
                <div style="height: 300px; flex: 1;">
                    <template-grid :value="templates" @choose-items="currentChoosen = $event"
                        @item-click="openEditor($event)">
                    </template-grid>
                </div>
            </div>
        </template>
        <template v-slot:control>
            <fv-button theme="dark" background="rgba(0, 153, 204, 1)"
                :disabled="name === '' || !cur_db || currentChoosen.length > 1" @click="add">{{ local('Confirm') }}
            </fv-button>
            <fv-button :theme="theme" @click="thisShow = false">{{ local('Cancel') }}</fv-button>
        </template>
    </float-window-base>
</template>

<script>
import floatWindowBase from "../window/floatWindowBase.vue";
import templateGrid from "@/components/templates/templateGrid.vue";
import { page } from "@/js/data_sample.js";
import { mapMutations, mapState, mapGetters } from "vuex";
import { ConflictBehavior } from "msgraphapi";

export default {
    components: {
        floatWindowBase,
        templateGrid,
    },
    props: {
        show: {
            default: false,
        },
        item: {
            default: null,
        },
    },
    data() {
        return {
            thisShow: this.show,
            name: "",
            currentChoosen: [],
        };
    },
    watch: {
        show(val) {
            this.thisShow = val;
        },
        thisShow(val) {
            this.$emit("update:show", val);
            this.name = "";
        },
    },
    computed: {
        ...mapState({
            root: (state) => state.root,
            data_index: (state) => state.data_index,
            data_path: (state) => state.data_path,
            templates: (state) => state.data_structure.templates,
            items: (state) => state.data_structure.items,
            theme: (state) => state.theme,
        }),
        ...mapGetters(["local", "cur_db"]),
        v() {
            return this;
        },
    },
    methods: {
        ...mapMutations({
            reviseDS: "reviseDS",
            reviseEditor: "reviseEditor",
            toggleEditor: "toggleEditor",
        }),
        async add() {
            if (!this.cur_db || !this.item || this.name === "" || this.currentChoosen.length > 1) return;
            let _page = JSON.parse(JSON.stringify(page));
            _page.id = this.$Guid();
            _page.name = this.name;
            _page.emoji = "📑";
            _page.createDate = this.$SDate.DateToString(new Date());
            let item = this.items.find((it) => it.id === this.item.id);
            item.pages.push(_page);
            this.item.pages = item.pages;
            if (this.root !== null) {
                this.reviseDS({
                    $index: this.data_index,
                    items: this.items,
                });
                try {
                    await this.root.clone().path(`root/items`).createListAsync({
                        name: item.id,
                        conflict: ConflictBehavior.Fail
                    })
                } catch (e) {
                    console.log(e)
                }

                // 获取父目录文件夹
                const parent = await this.root.clone().path(`root/items/${item.id}`).getAsync()
                let templateContent =
                this.currentChoosen.length == 1
                    ? JSON.stringify(this.currentChoosen[0].content)
                    : "";
                if (parent !== undefined) {
                    await this.root.clone().item(parent.id).path(`${_page.id}.json`).uploadAsync({
                        file: new File([templateContent], `${_page.id}.json`, {
                            type: "application/json"
                        }),
                        conflict: ConflictBehavior.Fail
                    })
                }
                this.thisShow = false;
            }
        },
        openEditor(template) {
            this.reviseEditor({
                type: "template",
                target: template,
            });
            this.toggleEditor(true);
        },
    },
};
</script>

<style lang="scss">
</style>