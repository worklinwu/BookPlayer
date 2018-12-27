// import util from '@/libs/util'
import db from '@/libs/db'

const saveState = function (state) {
  db.set('vuex.course', state).write()
}

export default {
  namespaced: true,
  state: {
  },
  mutations: {
  }
}
