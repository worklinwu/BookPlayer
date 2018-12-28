# BookPlayer 每天听本书App

## 该项目实现了：
- 播放器功能
  - 倍速播放
  - 连续播放
  - 播放列表
  - ...
- 听书
  - 排序
  - 分月/区间浏览
  - 已读变灰色
  - 图片的预览图和高清图切换
  - 解析xmind文件
  - 书籍的搜索
  - 历史记录
- 课程
  - 和听书类似
  - 没有xmind只有图片文稿
- App
  - PWA 集成
  - 可借助 Lavas 生成 Android App
...

## 技术栈

- vue + vuex + vue-router + vue cli3 + LeanCloud + PWA（可以借助Lavas生成AndroidApp） + 腾讯云对象存储

## 项目运行
```
git clone https://github.com/worklinwu/BookPlayer.git

cd BookPlayer

npm i  或 yarn

npm run dev
```

## LeanCloud 配置

1. 先注册 `LeanCloud` 账号
2. 创建应用，命名为 `BookPlayer`, 或者自己喜欢的
3. 进入应用后，在存储的`创建 Class`旁边有个加号，点击选择数据导入
4. 把目录下的 json 文件导入
5. 查看侧边栏的`设置 -> 应用key`，复制替换掉该项目的 `.env` 的 `VUE_APP_LEANCLOUD_APP_ID` 和 `VUE_APP_LEANCLOUD_APP_KEY`
6. 重启项目，看看效果吧

## 效果演示
[传送门](https://book-player-preview.leanapp.cn/)

## Android App 下载
![二维码](https://ws3.sinaimg.cn/large/006tNbRwgy1fym9fxlh8ej309y0a0aa3.jpg)

## 总结
因为自己有个需求，特别的痒，昼夜难免。第二天就开始起手做这个项目，利用业余时间，大概持续了10天时间（因为边学边做），从设计到数据（包括解析物理文件）到前端。总于把我想要的效果做出来了。
因为数据涉及到版权问题，所以只搞了部分数据来做演示，哈哈。

如果这个项目能帮助到你，给个 star 支持一下。
