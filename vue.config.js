module.exports = {
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  },
  devServer: {
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/style.scss";'
      }
    }
  }
};
