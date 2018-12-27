<template>
  <section class="page-flex">
    <div class="course-list-title">全部课程</div>
    <van-list
      :finished="finished"
      :loading="loading"
      @load="loadData"
      class="m-course-list page-container">
      <div class="no-result" v-if="courseList.length === 0 && !loading">没有数据</div>
      <div class="course-item" :key="course.id" v-for="course in courseList" @click="$router.push(`/course/detail/${course.objectId}`)">
        <div class="cover" v-lazy:background-image="$bucketsCourse + course.cover + getImageSuffix(280,61)"></div>
        <div class="content">
          <div class="title">{{ course.name }}</div>
          <div class="meta">{{ course.slogan }}</div>
        </div>
      </div>
    </van-list>
  </section>
</template>

<script>
  import db from '@/libs/db'
  import scrollMixin from '@/mixins/scrollBehavior.mixin'

  const CACHE_PAGE_STATE = false

  export default {
    name: 'CourseList',
    mixins:[scrollMixin],
    data () {
      return {
        loading: false,
        finished: false,
        courseList: [],
      }
    },
    computed: {
    },
    watch: {
      'courseList': function () {
        CACHE_PAGE_STATE && db.set('page.index.state', this.$data).write()
      }
    },
    methods: {
      loadData () {
        this.loading = true
        this.$api.course.list().then(res => {
          this.courseList = res || []
          this.finished = true
          this.loading = false
        }).catch(() => {
          this.finished = true
          this.loading = false
        })
      },
    },
    beforeMount () {
      if(CACHE_PAGE_STATE){
        let cacheState = db.get('page.index.state').value()
        Object.assign(this, cacheState)
      }
    },
    mounted () {

    },
  }
</script>

<style type="text/scss" lang="scss">
</style>
