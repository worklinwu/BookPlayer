export default {
  install (Vue) {
    /**
     * 日期格式化
     */
    Vue.filter('dateFormat', (value, format) => {
      if (!value) return
      if (!(value instanceof Date)) {
        value = new Date(value)
      }
      let o = {
        'M+': value.getMonth() + 1, // month
        'd+': value.getDate(), // day
        'h+': value.getHours(), // hour
        'm+': value.getMinutes(), // minute
        's+': value.getSeconds(), // second
        'q+': Math.floor((value.getMonth() + 3) / 3), // quarter
        'S': value.getMilliseconds() // millisecond
      }

      if (!format || format === '') {
        format = 'yyyy-MM-dd hh:mm:ss'
      }

      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (value.getFullYear() + '').substr(4 - RegExp.$1.length))
      }

      for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
      }
      return format
    })

    /**
     * 日期计算
     */
    Vue.filter('dateDiff', (value, interval, compareDate) => {
        if (!value || !interval || !compareDate) return

        let d = value instanceof Date ? value : new Date(value)
        let i = {}
        let t = d.getTime()
        let t2 = compareDate.getTime()
        i['y'] = compareDate.getFullYear() - d.getFullYear()
        i['q'] = i['y'] * 4 + Math.floor(compareDate.getMonth() / 4) - Math.floor(d.getMonth() / 4)
        i['m'] = i['y'] * 12 + compareDate.getMonth() - d.getMonth()
        i['ms'] = compareDate.getTime() - d.getTime()
        i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000))
        i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000)
        i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000)
        i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000)
        i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000)
        return i[interval]
      }
    )

    /**
     * 文件大小格式化
     */
    Vue.filter('formatFileSize', (value) => {
        if (!value) return

        let units = ['', 'Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        let threshold = 1024
        value = Number(value) * threshold
        let i = value === 0 ? 0 : Math.floor(Math.log(value) / Math.log(threshold))
        return (((value / Math.pow(threshold, i)).toFixed(2) * 1) + ' ' + (units[i]))
      }
    )
  }
}
