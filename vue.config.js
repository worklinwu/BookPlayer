module.exports = {
  baseUrl: '/',
  lintOnSave: false,
  outputDir: 'dist',
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      less: {
        // vant 自定义主题设置
        modifyVars: {
          'red': '#E4331F',
          'green': '#4DBA87',
          'black': '#333333',
          'orange-dark': '#fc6b21',
          'blue':'#fc6b21',
        }
      }
    }
  },
  // pwa 设置，有许多设置貌似没有用。最终的 manifest.json 文件以 /public/manifest.json 为模板
  pwa: {
    name: '每天听本书',
    themeColor: '#fff',
    msTileColor: '#fc6b21',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'white',
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    },
    // 设置 workbox
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/sw.js',
      swDest: 'sw.js',
    }
  }
}
