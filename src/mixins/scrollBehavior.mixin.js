import util from '@/libs/util'
import { ImagePreview } from 'vant'

export default {
  data () {
    return {
      scrollTop: 0
    }
  },
  computed: {},
  methods: {},
  activated () {
    if(this.$refs.pageContainer){
      this.$refs.pageContainer.$el.scrollTop = this.scrollTop
    }
  },
  deactivated () {
    if(this.$refs.pageContainer){
      this.scrollTop = this.$refs.pageContainer.$el.scrollTop
    }
  }
}
