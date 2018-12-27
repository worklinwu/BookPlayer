import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import packageInfo from '../../package'

const adapter = new LocalStorage(`BooksPlayer-${packageInfo.version}`)
const db = low(adapter)

db
  .defaults({})
  .write()

export default db
