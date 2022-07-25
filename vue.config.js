module.exports = {
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "@/style/global.scss";`
            }
        }
    },
    devServer: {
        port: 8080,
        // https: true
    },
    publicPath: process.env.NODE_ENV === 'production'
    ? '/FunBook/'
    : '/'
};