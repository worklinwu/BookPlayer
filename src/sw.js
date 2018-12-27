// workbox.strategies.staleWhileRevalidate()
// workbox.strategies.networkFirst()
// workbox.strategies.cacheFirst()
// workbox.strategies.networkOnly()
// workbox.strategies.cacheOnly()

workbox.routing.registerRoute(
  new RegExp('https:\/\/dwd0b9ti\.api\.lncld\.net/1\.1/classes/Book\?where.*'), // 书籍列表
  workbox.strategies.staleWhileRevalidate()
)
workbox.routing.registerRoute(
  new RegExp('https:\/\/dwd0b9ti\.api\.lncld\.net/1\.1/classes/Book/.{24}'), // 书籍详情
  workbox.strategies.cacheFirst()
)
workbox.routing.registerRoute(
  new RegExp('https:\/\/dwd0b9ti\.api\.lncld\.net/1\.1/classes/Course\?where.*'), // 课程列表
  workbox.strategies.staleWhileRevalidate()
)
workbox.routing.registerRoute(
  new RegExp('https:\/\/dwd0b9ti\.api\.lncld\.net/1\.1/classes/Course/.{24}'), // 课程详情
  workbox.strategies.cacheFirst()
)
workbox.routing.registerRoute(
  new RegExp('https:\/\/dwd0b9ti\.api\.lncld\.net/1\.1/classes/CourseContent\?where.*'), // 课程内容列表
  workbox.strategies.staleWhileRevalidate()
)
workbox.routing.registerRoute(
  new RegExp('https:\/\/dwd0b9ti\.api\.lncld\.net/1\.1/classes/CourseContent/.{24}'), // 课程内容详情
  workbox.strategies.cacheFirst()
)
workbox.routing.registerRoute(
  new RegExp('https:\/\/book-player-1252290422\.picsh\.myqcloud\.com\/books.*'), // 书籍图片
  workbox.strategies.cacheFirst()
)
workbox.routing.registerRoute(
  new RegExp('https:\/\/course-1252290422\.picsh\.myqcloud\.com.*'), // 课程图片
  workbox.strategies.cacheFirst()
)
