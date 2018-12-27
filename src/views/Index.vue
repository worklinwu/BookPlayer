<template>
  <section class="page-flex" @click="isShowDatePicker = false">
    <!--<van-nav-bar
      title="每天听本书"
      v-if="!$isWeixin"
    />-->
    <div :class="{'m-search-bar':true, 'active': isShowSearchPanel}">
      <van-search
        :show-action="isShowSearchPanel"
        @cancel="onCancelSearch"
        @clear="clearSearch()"
        @search="search(true)"
        placeholder="请输入书籍名称关键词"
        ref="searchBar"
        v-model="condition.title"
      />
      <div class="m-books-filter-panel" @click.stop>
        <span @click="isShowDatePicker = !isShowDatePicker" class="time-filter">
          {{this.filter.time.month ? this.filter.time.month + ' 月' : '全部' }}&nbsp;&nbsp;<van-icon :name="isShowDatePicker ? 'arrow-up' : 'arrow-down'" size="12px"/>
        </span>
        <!--<a class="play-btn">-->
        <!--<van-icon name="play" size="12px"/>&nbsp;&nbsp;播放全部-->
        <!--</a>-->
        <transition name="fade">
          <div class="options-time" v-show="isShowDatePicker">
            <span @click="changeFilterTime()">全部</span>
            <span :key="item" @click="changeFilterTime(2018, item)" v-for="item in 12">{{item}}月</span>
          </div>
        </transition>
      </div>
      <!--<transition name="fade">-->
      <div class="search-panel" v-if="isShowSearchPanel">
        <van-list
          :finished="finishedSearch"
          :immediate-check="false"
          @load="search(false)"
          class="m-book-list"
          v-model="loadingSearch">
          <div class="search-history" v-if="bookListSearch.length === 0">
            <ul>
              <li :key="index" @click.self="() => { condition.title = text; search(true, false) }" v-for="(text, index) in searchHistoryList">
                {{text}}
                <van-icon @click.self="removeTextFromSearchHistoryList" name="cross" size="1em"/>
              </li>
            </ul>
            <div @click="clearSearchHistorylist" class="clear van-hairline--top" v-show="searchHistoryList.length !== 0">清除历史记录</div>
          </div>
          <!--<div
            class="no-result"
            v-if="bookListSearch.length === 0 && !loadingSearch">没有数据
          </div>-->
          <div :class="{'book-item':true, 'active': markReadList.book.indexOf(book.objectId) > -1}" :key="book.id" v-for="book in bookListSearch">
            <div class="cover">
              <img v-lazy="book.coverPath + getImageSuffix(140,61)"/>
            </div>
            <div class="content">
              <div class="title">{{ book.title }}</div>
              <div class="meta">文件大小：{{ book.audioSize | formatFileSize }}</div>
              <div class="meta">日期：{{ book.time }}</div>
            </div>
            <div class="controls">
              <div class="status">
                <van-icon name="passed"/>
                已学习
              </div>
              <!--<div class="cart">加入列表</div>-->
              <div @click="playAudio(book.objectId)" class="play">
                <van-icon name="play"/>
                {{playAudioId === book.objectId ? '当前' : ''}}播放
              </div>
              <div @click="$router.push('/book/' + book.objectId)" class="detail">
                <van-icon name="pending-orders"/>
                文稿
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <!--</transition>-->
    </div>
    <van-pull-refresh @refresh="onRefresh" class="page-container" ref="pageContainer" v-model="pullRefreshLoading" :disabled="!!filter.time.month">
      <van-list
        :finished="finished"
        @load="loadData"
        class="m-book-list"
        v-model="loading">
        <div
          class="no-result"
          v-if="bookList.length === 0 && !loading">没有数据
        </div>
        <div :class="{'book-item':true, 'active': markReadList.book.indexOf(book.objectId) > -1}" :key="book.id" v-for="book in bookList">
          <div class="cover">
            <img v-lazy="book.coverPath + getImageSuffix(140,61)"/>
          </div>
          <div class="content">
            <div class="title">{{ book.title }}</div>
            <div class="meta">文件大小：{{ book.audioSize | formatFileSize }}</div>
            <div class="meta">日期：{{ book.time }}</div>
          </div>
          <div class="controls">
            <div class="status">
              <van-icon name="passed"/>
              已学习
            </div>
            <!--<div class="cart">加入列表</div>-->
            <div @click="playAudio(book.objectId)" class="play">
              <van-icon name="play"/>
              {{playAudioId === book.objectId ? '当前' : ''}}播放
            </div>
            <div @click="$router.push('/book/' + book.objectId)" class="detail">
              <van-icon name="pending-orders"/>
              文稿
            </div>
          </div>
        </div>
        <div class="no-more" v-if="bookList.length !== 0 && finished">~ 没有更多数据了 ~</div>
      </van-list>
    </van-pull-refresh>
  </section>
</template>

<script>
  import db from '@/libs/db'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
  import scrollMixin from '@/mixins/scrollBehavior.mixin'

  const CACHE_PAGE_STATE = false

  export default {
    name: 'Index',
    mixins: [scrollMixin],
    data () {
      return {
        scrollTop: 0,
        pullRefreshLoading: false,
        loading: false,
        finished: false,
        paging: {
          currentIndex: 1,
          pageSize: 31
        },
        condition: {
          title: '',
        },
        bookList: [],
        // 搜索相关
        isShowSearchPanel: false,
        loadingSearch: false,
        finishedSearch: false,
        pagingSearch: {
          currentIndex: 1,
          pageSize: 31
        },
        bookListSearch: [],
        // 过滤
        isShowDatePicker: false,
        filter: {
          time: {
            year: null,
            month: null,
          }
        },
      }
    },
    computed: {
      ...mapState('app', [
        'searchHistoryList'
      ]),
      ...mapState('player', [
        'markReadList',
      ]),
      ...mapGetters('player', [
        'playAudioId',
      ]),
      audioPlayer () {
        return this.$refs.audioPlayer
      }
    },
    watch: {
      'bookList': function () {
        CACHE_PAGE_STATE && db.set('page.index.state', this.$data).write()
      }
    },
    methods: {
      ...mapActions('player', [
        'addAudioToPlaylist',
      ]),
      ...mapMutations('app', [
        'addTextToSearchHistoryList',
        'removeTextFromSearchHistoryList',
        'clearSearchHistorylist',
      ]),
      loadData () {
        this.$api.book.list({ time: this.filter.time }, this.paging).then(res => {
          if (res) {
            this.paging.currentIndex = this.paging.currentIndex + this.paging.pageSize
            this.bookList = this.bookList.concat(res || [])
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
        this.loading = true
        // 刷新操作，即请求大于当前列表中第一条记录发布时间的记录，合并到原列表
        if (this.bookList && this.bookList.length) {
          this.$api.book.refresh(new Date(this.bookList[0].time)).then(res => {
            if (res) {
              this.bookList = res.concat(this.bookList)
            }
            this.loading = false
            this.pullRefreshLoading = false
          }).catch(() => {
            this.loading = false
            this.pullRefreshLoading = false
          })
        } else {
          this.loadData()
        }

      },
      playAudio (id) {
        // 更新播放列表
        this.addAudioToPlaylist({ channel: 'book', audio: this.bookList })
        this.$nextTick(() => {
          this.$root.$audioPlayer.playAudioById(id)
        })
      },
      search (reset, recordText = true) {
        if (reset) {
          this.clearSearch()
          if (recordText) {
            setTimeout(() => {
              this.addTextToSearchHistoryList(this.condition.title)
            }, 100)
          }
        }
        this.$api.book.list({ title: this.condition.title }, this.pagingSearch).then(res => {
          if (res && res.length) {
            this.paging.currentIndex = this.paging.currentIndex + this.paging.pageSize
            this.bookListSearch = this.bookListSearch.concat(res || [])
            if (res.length < this.pagingSearch.pageSize) {
              this.finishedSearch = true
            }
          } else {
            this.$toast('没有查询到数据')
            this.finishedSearch = true
          }
          this.loadingSearch = false
        }).catch(() => {
          this.finishedSearch = true
          this.loadingSearch = false
        })
      },
      onCancelSearch () {
        this.isShowSearchPanel = false
        this.pagingSearch.currentIndex = 1
        this.bookListSearch = []
      },
      clearSearch () {
        this.isShowSearchPanel = true
        this.pagingSearch.currentIndex = 1
        this.bookListSearch = []
      },
      changeFilterTime (year, month) {
        this.filter.time.year = year || null
        this.filter.time.month = month || null

        this.bookList = []
        this.paging.currentIndex = 1

        if (this.finished) {
          this.finished = false
        } else {
          this.loadData()
        }
        this.isShowDatePicker = false
      }
    },
    beforeMount () {
      if(CACHE_PAGE_STATE){
        let cacheState = db.get('page.index.state').value()
        Object.assign(this, cacheState)
      }
    },
    mounted () {
      this.$refs.searchBar.$el.querySelector('input').addEventListener('focus', (e) => {
        this.isShowSearchPanel = true
      })
    },
    activated () {
      this.$refs.pageContainer.$el.scrollTop = this.scrollTop
    },
    deactivated () {
      this.scrollTop = this.$refs.pageContainer.$el.scrollTop
    }
  }
</script>

<style type="text/scss" lang="scss">
</style>
