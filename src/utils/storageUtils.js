import store from 'store'
const USER_DATA = 'user_data';
export default {
  saveUser (user) {
    store.set(USER_DATA, user)
  },
  getUser () {
    return store.get(USER_DATA) || {}
  },
  removeUser () {
    store.remove(USER_DATA)
  }
}