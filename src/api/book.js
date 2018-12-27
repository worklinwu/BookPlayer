import AV from 'leancloud-storage'
import Vue from 'vue'
import util from '@/libs/util'

function converBookData (book) {
  book = book.toJSON()
  book.time = util.formatDate(book.time, 'YYYY-M-D')
  book.audioPath = book.audioPath ? Vue.prototype.$bucketsBooks + book.audioPath : undefined
  book.xmindPath = book.xmindPath ? Vue.prototype.$bucketsBooks + book.xmindPath : undefined
  book.xmindFilePath = book.xmindFilePath ? Vue.prototype.$bucketsBooks + book.xmindFilePath : undefined
  book.coverPath = book.coverPath ? Vue.prototype.$bucketsBooks + book.coverPath : undefined
  return book
}

export default {
  list ({ title, time }, paging = { currentIndex: 1, pageSize: 0 }) {
    return new Promise((resolve, reject) => {
      let query = new AV.Query('Book')
      query.select('title time audioPath audioSize xmindPath xmindSize xmindFilePath xmindFileSize coverPath coverSize'.split(' '))
      query.equalTo('publish', true)
      query.descending('time')
      if (title) {
        query.contains('title', title)
      }
      if (time && time.year && time.month) {
        let timeMin = new Date(`${time.year}/${time.month}/1`)
        let timeMax = new Date(`${time.year}/${time.month}/${util.getMonthLength(new Date(`${time.year}/${time.month}/1`))}`)
        query.greaterThanOrEqualTo('time', timeMin)
        query.lessThanOrEqualTo('time', timeMax)
      } else {
        // 取小于当下时间的记录
        query.lessThanOrEqualTo('time', new Date())
      }
      if (paging.pageSize) {
        query.limit(paging.pageSize)
        query.skip(paging.currentIndex - 1)
      }

      query.find().then(results => {
        results = results.map(item => {
          return converBookData(item)
        })
        resolve(results)
      }).catch(error => {
        console.error(error)
        reject([])
      })
    })
  },
  refresh (time) {
    return new Promise((resolve, reject) => {
      let query = new AV.Query('Book')
      query.select('title time audioPath audioSize xmindPath xmindSize xmindFilePath xmindFileSize coverPath coverSize'.split(' '))
      query.greaterThan('time', time)
      query.lessThanOrEqualTo('time', new Date())
      query.descending('time')

      query.find().then(results => {
        results = results.map(item => {
          return converBookData(item)
        })
        resolve(results)
      }).catch(error => {
        console.error(error)
        reject([])
      })
    })
  },
  detail (id) {
    return new Promise((resolve, reject) => {
      let query = new AV.Query('Book')
      query.get(id).then(book => {
        resolve(converBookData(book))
      }).catch(error => {
        console.error(error)
        reject([])
      })
    })
  }
}
