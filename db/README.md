# 数据文件使用指南
数据是基于 LeanCloud 的，所以：

1. 先注册 `LeanCloud` 账号
2. 创建应用，命名为 `BookPlayer`, 或者自己喜欢的
3. 进入应用后，在存储的`创建 Class`旁边有个加号，点击选择数据导入
4. 把目录下的 json 文件导入
5. 查看侧边栏的`设置 -> 应用key`，复制替换掉该项目的 `.env` 的 `VUE_APP_LEANCLOUD_APP_ID` 和 `VUE_APP_LEANCLOUD_APP_KEY`
6. 重启项目，看看效果吧
