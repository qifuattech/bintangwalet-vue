// const path = require("path");
module.exports = {
  // pwa: {
  //   name: 'watch',
  //   themeColor: '#4DBA87',
  //   msTileColor: '#000000',
  //   appleMobileWebAppCapable: 'yes',
  //   appleMobileWebAppStatusBarStyle: 'black',

  //   // configure the workbox plugin
  //   workboxPluginMode: 'InjectManifest',
  //   workboxOptions: {
  //     // swSrc is required in InjectManifest mode.
  //     swSrc: 'dev/sw.js',
  //     // ...other Workbox options...
  //   }
  // },
  // devServer: {
  //   // proxy: "http://192.168.2.8:8005",
  //   // compress: true,
  //   // disableHostCheck: true, 
  // },
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: "/",
  // watchOptions: {
  //   poll: true
  // }
  // outputDir: path.resolve("../webmjc"),
  // assetsDir: "../../webmjc/as"
}