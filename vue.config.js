module.exports = {
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "@/style/global.scss";`
            }
        }
    },
    devServer: {
        port: 8080
    },
    publicPath: "/FunBook/"
};