<template>
  <section class="page-flex">
    <van-nav-bar
      @click-left="$router.go(-1)"
      left-arrow
      title="书籍详情"
    >
        <van-icon name="home" slot="right" @click="$router.push('/')"/>
    </van-nav-bar>
    <van-loading class="page-loading" v-if="loading"/>
    <transition name="fade">
      <div class="page-container m-book-detail" v-if="bookInfo">
        <div class="book-cover" v-if="bookInfo.coverPath">
          <img v-lazy="bookInfo.coverPath + getImageSuffix(320)"/>
          <van-icon @click="play" class="play" name="play"/>
        </div>
        <div class="book-header">
          <div class="title">{{ bookInfo.title }}</div>
          <div class="meta" v-if="bookInfo.author">作者：{{ bookInfo.author }}</div>
        </div>
        <div class="book-content">
          <large-image
            :src="bookInfo.xmindPath"
            :thumbnail="bookInfo.xmindPath + getImageSuffix()"
            v-if="bookInfo.xmindPath"
          />
          <div class="xmind-content" v-html="xmindStrArray.join('<br>')"></div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
  import util from '@/libs/util'
  import { mapActions } from 'vuex'
  import LargeImage from '@/components/LargeImage'

  export default {
    name: 'BookDetail',
    components: { LargeImage },
    data () {
      return {
        loading: true,
        bookInfo: null,
        xmindStrArray: [],
      }
    },
    computed: {},
    methods: {
      ...mapActions('player', [
        'addAudioToPlaylist',
      ]),
      parseXmindObjToStrArray (obj, level = 1) {
        let result = []
        let space = (new Array(level)).join('&emsp;&emsp;') + ''
        result.push(`${space}${obj.title}`)
        if (obj.children) {
          obj.children.forEach(item => {
            result = result.concat(this.parseXmindObjToStrArray(item, level + 1))
          })
        }
        return result
      },
      play () {
        this.addAudioToPlaylist({ channel: 'book', audio: this.bookInfo })
        this.$root.$audioPlayer.playAudioById(this.bookInfo.objectId)
      },
      initBookInfo () {
        let id = this.$route.params.id
        util.title('书籍详情')

        this.$api.book.detail(id).then(res => {
          this.bookInfo = res
          util.title('书籍详情 |' + this.bookInfo.title)
          if (this.bookInfo.xmind) {
            this.xmindStrArray = this.parseXmindObjToStrArray(this.bookInfo.xmind)
          }
          this.$previewRefresh()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    mounted () {
      this.initBookInfo()
    },
    // 从播放器跳转到详情的情况
    beforeRouteUpdate (to, from, next) {
      next()
      this.initBookInfo()
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .m-book-detail {
    background: #f9f9f9;

    .book-cover {
      position: relative;
      background-color: #fff;
      padding: 60px 0;

      img {
        display: block;
        width: 160px;
        margin: 0 auto;
      }

      .play {
        position: absolute;
        right: 20px;
        bottom: 20px;
        color: #333;
        font-size: 44px;
      }
    }

    .book-header {
      padding: 40px 20px 20px;
      text-align: center;

      .title {
        font-size: 16px;
        color: #000;
        margin-bottom: 10px;
      }

      .meta {
        font-size: 12px;
        color: #999;
      }
    }

    .book-content {
      padding: 20px;
      margin-bottom: 80px;

      .xmind-content {
        /*border-left: 4px solid #ddd;*/
        /*padding: 10px;*/
        width: 335px;
        box-sizing: border-box;
        overflow-x: auto;
        margin-top: 40px;
        color: #333;
        font-size: 13px;
        line-height: 1.8;
        white-space: nowrap;
      }
    }
  }
</style>
