// import util from '@/libs/util'
import db from '@/libs/db'

const saveState = function (state) {
  db.set('vuex.books', state).write()
}

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  }
}
