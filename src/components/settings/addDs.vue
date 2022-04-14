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
                    :font-size="15"
                    :theme="theme"
                    style="width: 100%; height: 50px;"
                    @keyup.enter="addDS"
                ></fv-text-box>
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

export default {
    components: {
        floatWindowBase,
    },
    props: {
        show: {
            default: false,
        }
    },
    data() {
        return {
            thisShow: this.show,
            name: "",
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
            if(this.name === '') return;
            this.data_path.push(this.name);
            await this.reviseConfig({
                v: this,
                data_path: this.data_path,
            });
            this.$emit("finished");
            this.thisShow = false;
        }
    },
};
</script>

<style lang="scss">
</style>