<template>
  <section @click="isShowFilterPanel = false" class="page-flex">
    <van-nav-bar
      :title="courseTitle"
      @click-left="$router.go(-1)"
      left-arrow
    >
      <van-icon @click="$router.push('/')" name="home" slot="right"/>
    </van-nav-bar>
    <div @click.stop class="m-course-filter-panel">
      <span @click="isShowFilterPanel = !isShowFilterPanel" class="time-filter">
        {{this.filter.limit }}&nbsp;&nbsp;<van-icon :name="isShowFilterPanel ? 'arrow-up' : 'arrow-down'" size="12px"/>
      </span>
      <span @click="sort" class="sort" v-show="!isShowFilterPanel">
        <i :class="['iconfont', filter.sort.time === 'ascending' ? 'icon-sort-asc' : 'icon-sort-desc']"></i>排序
      </span>
      <!--<a class="play-btn">-->
      <!--<van-icon name="play" size="12px"/>&nbsp;&nbsp;播放全部-->
      <!--</a>-->
      <transition name="fade">
        <div class="options-time" v-show="isShowFilterPanel">
          <span @click="changeFilterLimit(1, $event)">全部</span>
          <span
            :key="index"
            @click="changeFilterLimit(index, $event)"
            v-for="index in Math.ceil(courseContentTotal/paging.pageSize)">
            {{`${(index-1)*paging.pageSize + 1}~${Math.ceil(courseContentTotal/paging.pageSize) === index ? courseContentTotal : ((index-1)*paging.pageSize + paging.pageSize)}`}}
          </span>
        </div>
      </transition>
    </div>
    <van-pull-refresh :disabled="isDisabledPullRefresh" @refresh="onRefresh" class="page-container" ref="pageContainer" v-model="pullRefreshLoading">
      <van-list
        :finished="finished"
        @load="loadData"
        class="m-course-content-list"
        v-model="loading">
        <div
          class="no-result"
          v-if="courseContentList.length === 0 && !loading">没有数据
        </div>
        <div
          :class="['book-item', 'van-hairline--bottom', courseMarkRead.indexOf(courseContent.objectId) > -1 && 'active', playAudioId === courseContent.objectId && 'playing']"
          :key="courseContent.id"
          v-for="courseContent in courseContentList">
          <div class="content">
            <div class="title">{{ courseContent.title }}</div>
            <div class="meta">
              {{ courseContent.time }}
              {{ (courseContent.audios && courseContent.audios.length) ? '&nbsp;&nbsp;/&nbsp;&nbsp;' + $options.filters.formatFileSize(courseContent.audios[0].size) : '' }}
            </div>
          </div>
          <div class="controls">
            <!--<div class="status">
              <van-icon name="passed"/>
              已学习
            </div>-->
            <!--<div class="cart">加入列表</div>-->
            <div @click="playAudio(courseContent.objectId)" class="play">
              <van-icon name="play"/>
              {{playAudioId === courseContent.objectId ? '当前' : ''}}播放
            </div>
            <div @click="$router.push('/course/detail/content/' + courseContent.objectId)" class="detail">
              <van-icon name="pending-orders"/>
              文稿
            </div>
          </div>
        </div>
        <div class="no-more" v-if="courseContentList.length !== 0 && finished">~ 没有更多数据了 ~</div>
      </van-list>
    </van-pull-refresh>

  </section>
</template>

<script>
  import util from '@/libs/util'
  import db from '@/libs/db'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
  import scrollMixin from '@/mixins/scrollBehavior.mixin'

  const CACHE_PAGE_STATE = false

  export default {
    name: 'CourseDetail',
    mixins: [scrollMixin],
    data () {
      return {
        courseTitle: '课程详情',
        scrollTop: 0,
        pullRefreshLoading: false,
        loading: false,
        finished: false,
        paging: {
          // currentPage: 1,
          currentIndex: 1,
          pageSize: 30
        },
        courseInfo: null,
        courseContentList: [],
        // 过滤
        isShowFilterPanel: false,
        filter: {
          limit: '全部',
          time: {
            year: null,
            month: null,
          },
          sort: { time: 'ascending' }
        },
        courseContentTotal: 0
      }
    },
    computed: {
      id () {
        return this.$route.params.id
      },
      ...mapGetters('player', [
        'playAudioId',
      ]),
      ...mapState('player', [
        'markReadList',
      ]),
      audioPlayer () {
        return this.$refs.audioPlayer
      },
      isDisabledPullRefresh () {
        return this.courseInfo && this.courseInfo.status === '已完结' || this.filter.limit !== '全部'
      },
      courseMarkRead () {
        return this.markReadList && this.markReadList['course-' + this.id] || []
      }
    },
    watch: {
      'courseContentList': function () {
        CACHE_PAGE_STATE && db.set('page.index.state', this.$data).write()
      }
    },
    methods: {
      ...mapActions('player', [
        'addAudioToPlaylist',
      ]),
      getCourseInfo () {
        this.$api.course.detail(this.id).then(res => {
          this.courseInfo = res
          this.courseTitle = res.name
          this.courseContentTotal = res.courseContentTotal
        })
      },
      loadData () {
        this.$api.course.contentList(this.id, { time: this.filter.time }, this.filter.sort, this.paging).then(res => {
          if (res) {
            // this.paging.currentPage++
            this.paging.currentIndex = this.paging.currentIndex + this.paging.pageSize
            this.courseContentList = this.courseContentList.concat(res || [])
            if (res.length < this.paging.pageSize) {
              this.finished = true
            }
          } else {
            this.finished = true
          }
          this.loading = false
          this.pullRefreshLoading = false
        }).catch(() => {
          this.finished = true

          this.loading = false
          this.pullRefreshLoading = false
        })
      },
      onRefresh () {
        this.courseContentList = []
        // this.paging.currentPage = 1
        this.paging.currentIndex = 1
        if (this.finished) {
          this.finished = false
        } else {
          this.loadData()
        }
      },
      playAudio (id) {
        // 更新播放列表
        this.addAudioToPlaylist({ channel: 'course-' + this.courseInfo.objectId, audio: this.courseContentList })
        this.$nextTick(() => {
          this.$root.$audioPlayer.playAudioById(id)
        })
      },
      changeFilterLimit (index, e) {
        this.courseContentList = []
        // this.paging.currentPage = index
        this.paging.currentIndex = index + this.paging.pageSize

        this.filter.limit = e.target.innerText

        if (this.finished) {
          this.finished = false
        } else {
          this.loadData()
        }
        this.isShowFilterPanel = false
      },
      sort () {
        this.courseContentList = []
        // this.paging.currentPage = 1
        this.paging.currentIndex = 1
        this.filter.limit = '全部'
        this.filter.sort.time = this.filter.sort.time === 'ascending' ? 'descending' : 'ascending'

        if (this.finished) {
          this.finished = false
        } else {
          this.loadData()
        }
      }
    },
    beforeMount () {
      if (CACHE_PAGE_STATE) {
        let cacheState = db.get('page.index.state').value()
        Object.assign(this, cacheState)
      }
    },
    mounted () {
      this.getCourseInfo()
    },
    activated () {
      // next()
    },
  }
</script>
