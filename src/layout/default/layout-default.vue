<template>
  <div
    :class="['layout-default', isShowTabBar && 'hasTabBar']"
    @touchmove="onTouchMove"
    @touchstart="touchStart"
  >
    <transition name="fade-transverse">
      <!--<keep-alive :include="keepAlive">-->
      <!--vue-navigation 插件-->
      <navigation>
        <router-view/>
      </navigation>
    </transition>

    <audio-player
      :addAudioToPlaylist="addAudioToPlaylist"
      :channel.sync="channel"
      :clearPlaylist="clearPlaylist"
      :playIndex.sync="playIndex"
      :playlist.sync="playlist"
      :removeAudioFromPlaylist="removeAudioFromPlaylist"
      @ended="onEnded"
      ref="audioPlayer"
    />

    <transition name="fadeOutDownInUp">
      <van-tabbar v-if="isShowTabBar" v-model="menuActive">
        <van-tabbar-item to="/" replace>
          <span>听书</span>
          <span class="iconfont icon-listen" slot="icon"></span>
        </van-tabbar-item>
        <van-tabbar-item to="/course" replace>
          <span>课程</span>
          <span class="iconfont icon-course" slot="icon"></span>
        </van-tabbar-item>
      </van-tabbar>
    </transition>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'
  // import { keepAliveRoutes } from '../../router/routes'
  import AudioPlayer from '@/components/AudioPlaer.vue'
  import touchMixin from '@/mixins/touch.mixin'
  import util from '@/libs/util'

  export default {
    name: 'LayoutBlank',
    mixins: [touchMixin],
    components: { AudioPlayer },
    data () {
      return {
        menuActive: 0,
        // keepAlive: keepAliveRoutes,
        isShowTabBar: true,
        appTransition: 'fade-transverse'
      }
    },
    computed: {
      ...mapState('player', [
        'playlist',
        'channel',
      ]),
      playIndex: {
        set (index) {
          this.changePlayIndex(index)
        },
        get () {
          return this.$store.state.player.playIndex
        }
      },
    },
    methods: {
      ...mapActions('player', [
        'addAudioToPlaylist',
      ]),
      ...mapMutations('player', [
        'changePlayIndex',
        'removeAudioFromPlaylist',
        'clearPlaylist',
        'addRecordToMarkReadList'
      ]),
      onEnded (audio) {
        // 播放结束，就标记当前记录为已读
        this.addRecordToMarkReadList(audio.objectId)
      },
      onTouchMove (e) {
        this.touchMove(e)
        this.$root.touchDirection = this.touchDirection
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        this.$root.$audioPlayer = this.$refs.audioPlayer
      })

      // 导航高亮
      this.$navigation.on('forward', (to, from) => {
        this.menuActive = ['/', '/course'].indexOf(this.$route.path)
      })
      this.$navigation.on('back', (to, from) => {
        this.menuActive = ['/', '/course'].indexOf(this.$route.path)
      })
    },
    beforeRouteUpdate (to, from, next) {
      // 进入详情页需要隐藏tab栏
      if (to.meta.isShowTabBar === false) {
        this.isShowTabBar = false
        this.$root.$audioPlayer.isShowPlayer = false
      } else {
        this.isShowTabBar = true
      }
      next()
    }
  }
</script>

<style type="text/scss" lang="scss">
  // 注册主题
  @import '../../assets/style/public';
</style>
