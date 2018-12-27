import log from './util.log.js'
import cookies from './util.cookies.js'
import dayjs from 'dayjs'

let util = {
  cookies,
  log
}

/**
 * @description 更新标题
 * @param {String} titleText 标题
 */
util.title = function (titleText) {
  const processTitle = process.env.VUE_APP_TITLE || '每天听本书'
  window.document.title = titleText || processTitle
}

/**
 * 获取url参数
 * @param name
 * @returns {*}
 */
util.getUrlParam = function (name) {
  let search = document.location.search
  // alert(search);
  let pattern = new RegExp('[?&]' + name + '=([^&]+)', 'g')
  let matcher = pattern.exec(search)
  let items = null
  if (matcher != null) {
    try {
      items = decodeURIComponent(decodeURIComponent(matcher[1]))
    } catch (e) {
      try {
        items = decodeURIComponent(matcher[1])
      } catch (e) {
        items = matcher[1]
      }
    }
  }
  return items
}

/**
 * 数组结构转换为树结构数据
 * @param arrayData 源数据
 * @param parentId 父节点字段
 * @param parentIdKey
 * @returns {Array}
 */
util.toTreeData = function (arrayData, parentId, parentIdKey = 'parentId') {
  let treeObejct = []
  let remainderArrayData = []

  arrayData.forEach(function (item) {
    if (item[parentIdKey] === parentId) {
      treeObejct.push(item)
    } else {
      remainderArrayData.push(item)
    }
  })
  treeObejct.forEach(function (item) {
    let _childrenData = util.toTreeData(remainderArrayData, item.id, parentIdKey)
    _childrenData && _childrenData.length > 0 && (item.children = _childrenData)
  })
  return treeObejct
}

/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */
util.debounce = function (func, wait = 50, immediate = true) {
  let timer, context, args

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args)
      context = args = null
    }
  }, wait)

  // 这里返回的函数是每次实际调用的函数
  return function (...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later()
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      } else {
        context = this
        args = params
      }
      // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
      // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer)
      timer = later()
    }
  }
}

util.formatDate = function (date, format = 'YYYY-M-D HH:mm:ss') {
  date = date instanceof Date ? date : new Date(date)
  return dayjs(date).format(format)
}

util.getMonthLength = function (date) {
  // 将日期设置为下月一号
  date.setMonth(date.getMonth() + 1)
  date.setDate('1')
  // 获取本月最后一天
  date.setDate(date.getDate() - 1)
  return date.getDate()
}

util.getDateTimeMap = function (startTime, endTime) {
  startTime = startTime instanceof Date ? startTime : new Date(startTime)
  endTime = endTime instanceof Date ? endTime : new Date(endTime)

  let startYear = startTime.getFullYear()
  let startMonth = startTime.getMonth() + 1
  let endYear = endTime.getFullYear()
  let endMonth = endTime.getMonth() + 1

  let result = {}

  for (let year = startYear; year <= endYear; year++) {
    result[year] = []
    for (let month = startMonth; month <= startYear === endYear ? endMonth : 12; month++) {
      result[year].push(month)
    }
  }

  return result
}

export default util
