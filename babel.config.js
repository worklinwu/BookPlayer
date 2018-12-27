module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    // vant 的样式自动导入
    [
      'import',
      {
        libraryName: 'vant',
        libraryDirectory: 'es',
        // 指定样式路径
        style: name => `${name}/style/less`
      },
      'vant'
    ]
  ]
}
