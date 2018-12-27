import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import player from './modules/player'
// import book from './modules/book'
// import course from './modules/course'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    player,
    // book,
    // course,
  }
})
