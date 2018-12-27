// import util from '@/libs/util'
import db from '@/libs/db'
import findIndex from 'lodash/findIndex'

// 比较野蛮的方式缓存数据
const saveState = function (state) {
  db.set('vuex.player', state).write()
}

export default {
  namespaced: true,
  state: {
    // 播放状态
    playerStatus: {
      play: true,
      speed: 1
    },
    // 频道
    channel: 'book',
    // 播放列表
    playlist: [],
    // 已读列表
    markReadList: {
      book: []
    },
    // 当前播放在播放列表中的索引
    playIndex: -1,
    // 当前播放的数据对象
    playAudioCurrent: null,
  },
  getters:{
    // 当前播放的数据id
    playAudioId: state => {
      let targetAudio = state.playlist[state.playIndex]
      return targetAudio ? targetAudio.objectId : undefined
    }
  },
  mutations: {
    /**
     * 添加到播放列表
     * @param state
     * @param channel
     * @param audio
     */
    addAudioToPlaylist (state, { channel, audio }) {
      // 过滤掉重复项
      let audios = audio instanceof Array ? audio : [audio]

      if(state.channel === channel){
        audios.forEach(audio => {
          if (!state.playlist.some(item => item.objectId === audio.objectId)) {
            state.playlist.push(audio)
            saveState(state)
          }
        })
      }else{
        state.channel = channel
        state.playlist = audios
      }
    },
    /**
     * 移除出播放列表
     * @param state
     * @param index
     */
    removeAudioFromPlaylist (state, index) {
      state.playlist.splice(index, 1)
      saveState(state)
    },
    /**
     * 清空播放列表
     * @param state
     */
    clearPlaylist (state) {
      state.playlist = []
      saveState(state)
    },
    /**
     * 切换当前播放
     * @param state
     * @param index
     */
    changePlayIndex( state, index) {
      state.playIndex = index
      state.playAudioCurrent = state.playlist[index]
      saveState(state)
    },
    /**
     * 切换当前播放
     * @param state
     * @param audio
     */
    changeCurrentPlayAudio( state, audio) {
      state.playAudioCurrent = audio
      state.playIndex = findIndex(state.playlist, { objectId: audio.objectId })
      saveState(state)
    },
    /**
     * 添加到已读
     * @param state
     * @param id
     */
    addRecordToMarkReadList (state, id) {
      debugger
      // 过滤掉重复项
      if(!state.markReadList[state.channel]){
        state.markReadList[state.channel] = []
      }
      if(state.markReadList[state.channel].indexOf(id) === -1){
        state.markReadList[state.channel].push(id)
        saveState(state)
      }
    },
  },
  actions: {
    /**
     * 添加到播放列表
     * @param dispatch
     * @param commit
     * @param channel
     * @param audio
     */
    addAudioToPlaylist ({ dispatch, commit }, { channel, audio}) {
      // 可能传入一组数据或者多组数据
      let audios = audio instanceof Array ? audio : [audio]
      let availableAudios = []

      // 检查audio的可用性，必须包含名称和mp3路径
      audios.forEach(audio => {
        if (audio.audioPath && audio.title) {
          availableAudios.push(audio)
        }
      })

      availableAudios.length && commit('addAudioToPlaylist', {
        channel, audio: availableAudios
      })
    }
  }
}
