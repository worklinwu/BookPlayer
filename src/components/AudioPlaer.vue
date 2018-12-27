<template>
  <transition name="fadeOutDownInUp">
    <section
      @click.stop
      @touchend.stop
      @touchmove.stop
      @touchstart.stop
      class="m-player"
      v-show="isShowPlayer">
      <!--播放器插件-->
      <vue-plyr
        :options="playerOptions"
        ref="audioPlayer"
        v-bind="$attrs">
        <audio></audio>
      </vue-plyr>
      <!--播放列表-->
      <transition name="fadeOutDownInUp">
        <div class="m-player-playlist" v-show="isShowPlaylist">
          <div class="controls" v-show="playlist.length">
            <span class="indicator">{{ `${playIndex !== -1 ? (playIndex + 1) + '/' : ''}${playlist.length || ''}` }}</span>
            <span @click.stop="clearPlaylist" class="delete"><van-icon name="delete"/> 清空全部</span>
          </div>
          <div
            class="no-result"
            v-if="playlist.length === 0">（无）
          </div>
          <ul class="list" v-show="playlist.length">
            <li
              :class="{active: playIndex === index, play: true}"
              :key="item.objectId"
              v-for="(item, index) in playlist">

              <span class="no">{{ index + 1 }}.</span>
              <span class="title">{{ item.title }}</span>
              <a class="delete">
                <van-icon @click.stop="removeAudioFromPlaylist(index)" name="delete"/>
              </a>
              <a :class="{active: playIndex === index, play: true}">
                <van-icon @click.stop="play(index, $event)" name="play"/>
              </a>
              <a @click="gotoDetail(item)" class="doc">
                <van-icon name="pending-orders"/>
              </a>

            </li>
          </ul>
        </div>
      </transition>
    </section>
  </transition>
</template>

<script>
  import { VuePlyr } from 'vue-plyr'

  const BEHAVIOR_NEXT = 'normal' // stop  点击下一首的行为，如果没有下一首音乐是停止还是继续播放

  export default {
    name: 'AudioPlayer',
    inheritAttrs: false,
    components: { VuePlyr },
    props: {
      // 分组，区别不同播放内容做缓存
      channel: {
        type: String,
        default: 'book'
      },
      // 播放列表
      playlist: {
        type: Array,
        default () {
          return []
        }
      },
      // 当前播放的索引
      playIndex: {
        type: Number,
        default: -1
      },
      // 播放，播放列表中的音乐
      // ! 之所以把方法放在 props 中定义，是为保证组件的完整性，实际使用过程中会把播放器中的数据托管在vuex。 索然说把组件挂在 vm.$root 也是可行的
      play: {
        type: Function,
        default: function (index) {
          this.player.stop()
          if (index > -1 && this.playlist[index] && this.playlist[index].audioPath) {
            this.$emit('update:playIndex', index)
            this.media.src = this.playlist[index].audioPath
            this.$nextTick(() => {
              this.player.play()
            })
          } else {
            this.$emit('update:playIndex', -1)
            this.$toast('播放错误！')
          }
        }
      },
      // 播放模式
      playMode: {
        type: String,
        default: 'normal',
        validator: function (value) {
          return [
            'normal', // 按列表顺序播放
            'once', // 播放单曲一次
            'repeat', // 重复一首播放
            // 'random', // 随机
          ].indexOf(value) !== -1
        }
      },
      // 下一首
      next: {
        type: Function,
        default: function (e) {
          e.stopPropagation()
          if (BEHAVIOR_NEXT === 'stop') {
            this.media.stop()
          } else {
            if (this.playIndex + 1 >= this.playlist.length) {
              this.$emit('update:playIndex', -1)
              this.$toast('没有播放内容啦~')
            } else {
              this.play(this.playIndex + 1)
            }
          }
        }
      },
      // 添加到播放列表
      addAudioToPlaylist: {
        type: Function,
        default: function (channel, audio, e) {
          if (this.channel !== channel) {
            this.$emit('update:channel', channel)
            this.playlist = []
          }
          if (audio instanceof Array) {
            this.$emit('update:playlist', [...this.playlist, ...audio])
          } else {
            this.$emit('update:playlist', [...this.playlist, audio])
          }
        }
      },
      // 情况播放列表
      clearPlaylist: {
        type: Function,
        default: function () {
          this.$emit('update:playIndex', -1)
          this.$emit('update:playlist', [])
        }
      },
      // 删除播放列表中的某个音乐
      removeAudioFromPlaylist: {
        type: Function,
        default: function (index) {
          this.playlist.splice(index, 1)
        }
      },
    },
    data () {
      return {
        isShowPlayer: false, // 是否显示播放器
        isShowPlaylist: false, // 是否显示播放列表
        speedCache: 1, // 速度控制，因为 plyr 插件的速度在播放下一首的时候会被重置，需缓存下来
        speed: {  // 速度选项
          selected: 1,
          options: [1, 1.25, 1.5, 1.75, 2]
        },
        playerOptions: {
          controls: `
          <div class="plyr__controls js-plyr-controls">
            <!--快退-->
            <!--<button type="button" class="plyr__control" data-plyr="rewind">
                <svg role="presentation"><use xlink:href="#plyr-rewind"></use></svg>
                <span class="plyr__tooltip" role="tooltip">快退 {seektime} 秒</span>
            </button>-->
            <!--播放-->
            <button type="button" class="plyr__control" aria-label="Play, {title}" data-plyr="play">
                <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
                <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
                <span class="label--pressed plyr__tooltip" role="tooltip">暂停</span>
                <span class="label--not-pressed plyr__tooltip" role="tooltip">播放</span>
            </button>
            <!--快进-->
            <!--<button type="button" class="plyr__control" data-plyr="fast-forward">
                <svg role="presentation"><use xlink:href="#plyr-fast-forward"></use></svg>
                <span class="plyr__tooltip" role="tooltip">快进 {seektime} 秒</span>
            </button>-->
            <!--下一首-->
            <button type="button" class="plyr__control plyr__control_next" data-plyr-custom="next">
                <i class="iconfont icon-next"></i>
            </button>
            <!--进度条-->
            <div class="plyr__progress">
                <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
                <progress class="plyr__progress__buffer" min="0" max="100" value="0">% 缓冲</progress>
                <span role="tooltip" class="plyr__tooltip">00:00</span>
            </div>
            <!--倒计时-->
            <div class="plyr__time plyr__time--current" aria-label="Current time">00:00</div>
            <!--<div class="plyr__time plyr__time&#45;&#45;duration" aria-label="Duration">00:00</div>隐藏这个和设置invertTime：false就能实现时间倒计时-->
            <!--速度-->
            <button type="button" class="plyr__control plyr__control_speed" data-plyr-custom="speed">x1</button>
            <!--播放列表-->
            <button type="button" class="plyr__control plyr__control_playlist" data-plyr-custom="playlist">
                <i class="iconfont icon-list"></i>
            </button>
            <!--关闭播放器-->
            <button type="button" class="plyr__control plyr__control_close" data-plyr-custom="close">
              <i class="iconfont icon-close-o"></i>
            </button>
          </div>`
        }
      }
    },
    watch: {
      // 清除播放列表的时候隐藏播放器
      playlist: function () {
        this.isShowPlayer = this.playlist && !!this.playlist.length
      },
      playIndex: function () {
        this.isShowPlayer = true
      }
    },
    computed: {
      // 当前播放器实例
      player () {
        return this.$refs.audioPlayer.player
      },
      // video 实例
      media () {
        return this.player.media
      }
    },
    methods: {
      //
      bodyClickHandle (e) {
        this.isShowPlaylist = false
      },
      speedChangeHandle (e) {
        let speedOptions = this.$refs.audioPlayer.player.config.speed.options
        let changeSpeedIndex = speedOptions.indexOf(this.$refs.audioPlayer.player.speed) + 1
        let changeSpeed = changeSpeedIndex >= speedOptions.length ? speedOptions[0] : speedOptions[changeSpeedIndex]
        this.$refs.audioPlayer.player.speed = changeSpeed
        e.srcElement.innerText = 'x' + changeSpeed
        this.speedCache = changeSpeed
      },
      togglePlaylistHandle (e) {
        e.stopPropagation()
        this.isShowPlaylist = !this.isShowPlaylist
      },
      closePlayerHandle: function (e) {
        e.stopPropagation()
        this.player.stop()
        this.clearPlaylist()
      },
      playAudioById (id) {
        let audioIndex = -1
        for (let i = 0; i < this.playlist.length; i++) {
          if (this.playlist[i].objectId === id) {
            audioIndex = i
            break
          }
        }
        this.play(audioIndex)
        this.isShowPlayer = true
      },
      scrollHandle: function (e) {
        if (this.$root.touchDirection === 'up') {
          this.isShowPlayer = false
        } else if (this.$root.touchDirection === 'down') {
          if (this.playlist && this.playlist.length) {
            this.isShowPlayer = true
          }
        }
      },
      gotoDetail (item) {
        if (this.channel === 'book') {
          // 听书
          this.$router.push('/book/' + item.objectId)
        } else {
          // 课程
          this.$router.push(`/course/detail/content/${item.objectId}`)
        }
        this.isShowPlaylist = false
      }
    },
    mounted () {
      let _this = this
      this.$nextTick(() => {
        document.querySelector('[data-plyr-custom="speed"]').addEventListener('click', this.speedChangeHandle)
        document.querySelector('[data-plyr-custom="next"]').addEventListener('click', this.next.bind(this))
        document.querySelector('[data-plyr-custom="playlist"]').addEventListener('click', this.togglePlaylistHandle)
        document.querySelector('[data-plyr-custom="close"]').addEventListener('click', this.closePlayerHandle.bind(this))
        document.body.addEventListener('click', this.bodyClickHandle)
        document.body.addEventListener('touchmove', this.scrollHandle)
        document.body.addEventListener('touchend', this.bodyClickHandle)
      })
      // 播放控制
      this.player.on('play', () => {
        _this.$refs.audioPlayer.player.speed = _this.speedCache
        // playIndex 指向错误的情况下，直接点击播放默认播放第一条数据
        if (_this.playlist.length && (_this.playIndex < 0 || _this.playIndex >= _this.playlist.length)) {
          _this.$emit('update:playIndex', 0)
          _this.media.src = _this.playlist[0].audioPath
        } else if (_this.playlist.length === 0) {
          _this.$emit('update:playIndex', -1)
          _this.$toast('播放列表没有数据，快去添加音频吧！')
          _this.player.stop()
        }
      })
      // 自动播放下一首
      this.player.on('ended', () => {
        if (_this.playMode === 'normal') {
          _this.play(_this.playIndex + 1)
        } else if (_this.playMode === 'once') {
          _this.player.stop()
        } else if (_this.playMode === 'repeat') {
          _this.player.restart()
        }
        this.$emit('ended', _this.playlist[_this.playIndex], _this)
      })
      // 初始化数据
      if (this.playlist.length) {
        if (this.playIndex > -1) {
          this.media.src = this.playlist[this.playIndex].audioPath
        }
      } else {
        this.$emit('update:playIndex', -1)
      }
    }
  }
</script>


<style type="text/scss" lang="scss">
  @import '../assets/style/variable';

  .m-player {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;

    .plyr {
      position: relative;
      z-index: 100;
    }

    .plyr--audio .plyr__controls {
      background-color: #{$color-gray-1};
      border-radius: 0;
      color: #{$color-text-normal};
    }

    .plyr--audio .plyr__control.plyr__tab-focus,
    .plyr--audio .plyr__control:hover,
    .plyr--audio .plyr__control[aria-expanded=true] {
      background: #{$color-gray-4};
      color: #{$color-text-normal};
    }

    .plyr__control.plyr__tab-focus {
      box-shadow: none;
    }

    .plyr--full-ui input[type=range] {
      color: #{$color-info};
    }

    .plyr {
      .plyr__control_speed {
        width: 44px;
      }

      .plyr__control_close,
      .plyr__control_playlist,
      .plyr__control_next {
        position: relative;

        i {
          position: relative;
          top: 3px;
          line-height: 1;
          color: #{$color-text-normal};
        }

        i:before {
          font-size: 21px;
          line-height: 0;
        }

        &:hover i,
        &.plyr__tab-focus i {
          color: #{$color-text-normal};
        }
      }

      .plyr__control_close {
        i {
          color: #ccc;
        }
      }
    }

    .hasTabBar & {
      bottom: 50px;
    }

    & + .van-tabbar {
      z-index: 201 !important;
    }
  }

  .m-player-playlist {
    position: absolute;
    bottom: 48px;
    left: 0;
    right: 0;
    z-index: 99;
    background-color: #{$color-gray-1};
    color: #{$color-text-normal};
    border-radius: 0;
    box-shadow: 0 -999px 0 999px rgba(0, 0, 0, .4);

    .controls {
      padding: 10px;
      line-height: 24px;
      height: 24px;
      font-size: 12px;

      .delete {
        float: right;
        color: #{$color-text-normal};

        i {
          vertical-align: -2px;
        }
      }
    }

    .no-result {
      background-color: #{$color-gray-3};
      color: #{$color-text-normal};
    }

    .list {
      background-color: #{$color-gray-1};
      max-height: 280px;
      padding: 10px 0;
      overflow: auto;

      li {
        line-height: 40px;
        height: 40px;
        padding: 0 10px;
        color: #{$color-text-normal};

        &.active {
          color: #{$color-primary};
        }

        .no {
          float: left;
        }

        .title {
          float: left;
          width: 220px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .play,
        .doc,
        .delete {
          position: relative;
          top: 2px;
          float: right;
          margin: 0 8px;
          font-size: 16px;
        }

        .play.active {
          //color: #000;
        }
      }
    }
  }
</style>
