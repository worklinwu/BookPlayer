// 文档 https://baianat.github.io/vee-validate/

import VeeValidate, { Validator } from 'vee-validate'

const formatFileSize = function (size) {
  let units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let threshold = 1024;
  size = Number(size) * threshold;
  let i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));
  return (((size / Math.pow(threshold, i)).toFixed(2) * 1) + " " + (units[i]));
}

export default {
  install (Vue, options) {
    const fieldName = ''
    Validator.localize('zh_CN', {
      name: 'zh_CN',
      messages: {
        _default: (field) => `${fieldName}无效`,
        after: (field, [target]) => `${fieldName}必须在${target}之后`,
        alpha_dash: (field) => `${fieldName}能够包含字母数字字符、破折号和下划线`,
        alpha_num: (field) => `${fieldName}只能包含字母数字字符`,
        alpha_spaces: (field) => `${fieldName}只能包含字母字符和空格`,
        alpha: (field) => `${fieldName}只能包含字母字符`,
        before: (field, [target]) => `${fieldName}必须在${target}之前`,
        between: (field, [min, max]) => `${fieldName}必须在${min}与${max}之间`,
        confirmed: (field, [confirmedField]) => `${fieldName}不能和${confirmedField}匹配`,
        credit_card: (field) => `${fieldName}格式错误`,
        date_between: (field, [min, max]) => `${fieldName}必须在${min}和${max}之间`,
        date_format: (field, [format]) => `${fieldName}必须符合${format}格式`,
        decimal: (field, [decimals = '*'] = []) => `${fieldName}必须是数字，且能够保留${decimals === '*' ? '' : decimals}位小数`,
        digits: (field, [length]) => `${fieldName}必须是数字，且精确到${length}位数`,
        dimensions: (field, [width, height]) => `${fieldName}必须在${width}像素与${height}像素之间`,
        email: (field) => `${fieldName}不是一个有效的邮箱`,
        ext: (field) => `${fieldName}不是一个有效的文件`,
        image: (field) => `${fieldName}不是一张有效的图片`,
        included: (field) => `${fieldName}不是一个有效值`,
        integer: (field) => `${fieldName}必须是整数`,
        ip: (field) => `${fieldName}不是一个有效的地址`,
        length: (field, [length, max]) => {
          if (max) {
            return `${fieldName}长度必须在${length}到${max}之间`
          }
          return `${fieldName}长度必须为${length}`
        },
        max: (field, [length]) => `${fieldName}不能超过${length}个字符`,
        max_value: (field, [max]) => `${fieldName}必须小于或等于${max}`,
        mimes: (field) => `${fieldName}不是一个有效的文件类型`,
        min: (field, [length]) => `${fieldName}必须至少有${length}个字符`,
        min_value: (field, [min]) => `${fieldName}必须大于或等于${min}`,
        excluded: (field) => `${fieldName}不是一个有效值`,
        numeric: (field) => `${fieldName}只能包含数字字符`,
        regex: (field) => `${fieldName}格式无效`,
        required: (field) => `${fieldName}不能为空`,
        size: (field, [size]) => `${fieldName}必须小于${formatFileSize(size)}`,
        url: (field) => `${fieldName}不是一个有效的url`
      },
      attributes: {}
    })
    Vue.use(VeeValidate)
  }
}
