// import util from '@/libs/util'
import db from '@/libs/db'

const saveState = function (state) {
  db.set('vuex.app', state).write()
}

const MAX_SEARCH_HISTORY = 3

export default {
  namespaced: true,
  state: {
    searchHistoryList: [] // 图书搜索记录
  },
  mutations: {
    addTextToSearchHistoryList (state, text) {
      if(text.replace(/(^\s*)|(\s*$)/g, '')){
        // 判断重复
        let indexTemp= state.searchHistoryList.indexOf(text)
        if(indexTemp > -1){
          state.searchHistoryList.splice(indexTemp, 1)
        }

        // 添加到开头
        state.searchHistoryList.unshift(text)
        // 超出限制删除末尾的
        if(state.searchHistoryList.length > MAX_SEARCH_HISTORY){
          state.searchHistoryList.pop()
        }
        saveState(state)
      }
    },
    removeTextFromSearchHistoryList (state, index) {
      state.searchHistoryList.splice(index, 1)
      saveState(state)
    },
    clearSearchHistorylist (state) {
      state.searchHistoryList = []
      saveState(state)
    }
  },
  actions: {
  }
}
