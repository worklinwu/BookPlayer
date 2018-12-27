import util from '@/libs/util'

export default {
  data () {
    return {}
  },
  computed: {},
  methods: {
    setTitle (title) {
      util.title(title)
    },
    // 腾讯数据万象服务，缩略图后缀
    getImageSuffix (width = '375', quality = '61', type = 'jpg') {
      return `?imageMogr2/thumbnail/${width}x/format/${type}/quality/${quality}`
    }
  }
}
