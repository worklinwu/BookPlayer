import AV from 'leancloud-storage'
import Vue from 'vue'
import util from '@/libs/util'

function converCourseData (course) {
  course = course.toJSON()
  course.audioPath = course.audios[0] ? Vue.prototype.$bucketsCourse + course.audios[0].path : null
  course.time = util.formatDate(course.time, 'YYYY-M-D')
  return course
}

export default {
  list () {
    return new Promise((resolve, reject) => {
      let query = new AV.Query('Course')
      query.select('name category slogan cover author'.split(' '))
      query.include('category.name')
      query.include('category.parent.name')
      query.find().then(results => {
        results = results.map(item => {
          return item.toJSON()
        })
        resolve(results)
      }).catch(error => {
        console.error(error)
        reject([])
      })
    })
  },
  detail(courseId){
    return new Promise(function (resolve, reject) {
      new AV.Query('Course').get(courseId).then(res => {
        if (!res) {
          reject('没有该数据')
        } else {
          resolve(res.toJSON())
        }
      })
    });
  },
  contentList (courseId, { title, time }, sort = {time: 'ascending'}, paging) {
    return new Promise((resolve, reject) => {
      let query = new AV.Query('CourseContent')
      query.equalTo('course', AV.Object.createWithoutData('Course', courseId))
      if(sort && sort.time){
        query[sort.time]('time')
      }
      if (title) {
        query.contains('title', title)
      }
      if (time && time.year && time.month) {
        let timeMin = new Date(`${time.year}/${time.month}/1`)
        let timeMax = new Date(`${time.year}/${time.month}/${util.getMonthLength(new Date(`${time.year}/${time.month}/1`))}`)
        query.greaterThanOrEqualTo('time', timeMin)
        query.lessThanOrEqualTo('time', timeMax)
      }
      if (paging) {
        query.limit(paging.pageSize)
        // query.skip((paging.currentPage - 1) * paging.pageSize)
        query.skip(paging.currentIndex - 1)
      }

      query.find().then(results => {
        results = results.map(item => {
          return converCourseData(item)
        })

        resolve(results)
      }).catch(error => {
        console.error(error)
        resolve([])
      })
    })
  },
  contentDetail (courseContentId) {
    return new Promise(function (resolve, reject) {
      new AV.Query('CourseContent').get(courseContentId).then(res => {
        if (!res) {
          reject('没有该数据')
        } else {
          resolve(res.toJSON())
        }
      })
    });
  },
}
