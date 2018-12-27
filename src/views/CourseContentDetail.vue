<template>
  <section class="page-flex">
    <van-nav-bar
      @click-left="$router.go(-1)"
      left-arrow
      title="课程详情"
    >
      <van-icon @click="$router.push('/')" name="home" slot="right"/>
    </van-nav-bar>
    <van-loading class="page-loading" v-if="loading"/>
    <transition name="fade">
      <div class="page-container m-course-content-detail" v-if="courseContentInfo">
        <div class="course-content-header" v-if="!courseContentInfo.images || courseContentInfo.images.length === 0">
          <div class="title">{{ courseContentInfo.title }}</div>
          <!--<div class="meta">作者：{{ courseContentInfo.author }}</div>-->
          <!--<div class="meta">时间：{{ courseContentInfo.time }}</div>-->
        </div>
        <div class="course-content-content">
          <!--<img
            :src="$bucketsCourse + imgSrc + getImageSuffix(375, 50)"
            v-for="imgSrc in courseContentInfo.images"
          />-->
          <large-image
            :src="$bucketsCourse + imgSrc + getImageSuffix(750,90)"
            :thumbnail="$bucketsCourse + imgSrc + getImageSuffix(375,20)"
            v-for="imgSrc in courseContentInfo.images"
          />
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
    name: 'CourseContentDetail',
    components: { LargeImage },
    data () {
      return {
        loading: true,
        courseContentInfo: null,
      }
    },
    computed: {},
    methods: {
      ...mapActions('player', [
        'addAudioToPlaylist',
      ]),
      play () {
        this.addAudioToPlaylist({ channel: 'course-' + this.courseInfo.objectId, audio: this.courseContentInfo })
        this.$nextTick(() => {
          this.$root.$audioPlayer.playAudioById(this.courseContentInfo.objectId)
        })
      },
      initCourseContentInfo () {
        let id = this.$route.params.id
        util.title('课程详情')

        this.$api.course.contentDetail(id).then(res => {
          this.courseContentInfo = res
          util.title('课程详情 |' + this.courseContentInfo.title)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }
    },
    mounted () {
      this.initCourseContentInfo()
    },
    // 从播放器跳转到详情的情况
    beforeRouteUpdate (to, from, next) {
      next()
      this.initCourseContentInfo()
    }
  }
</script>

<style type="text/scss" lang="scss" scoped>
  .m-course-content-detail {
    background: #fff;

    .course-content-header {
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

    .course-content-content {
      padding: 0;
      margin-bottom: 80px;
      img{
        max-width: 100%;
      }
    }
  }
</style>
