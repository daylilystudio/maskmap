module.exports = {
  publicPath: './',
  configureWebpack: {
    plugins: [
      // avoid warning https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags
      // Webpack automatically replaces these constants at build time
      new (require('webpack')).DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ]
  }
}
