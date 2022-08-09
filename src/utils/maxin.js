import store from '@/store'

export const maxin = {
  // created() {
  //   console.log('混入的creared')
  // },
  // mounted () {
  //   console.log('混入的mounted')
  // },
  methods: {
    checkPermission (key) {
      // console.log(!store.state.user.userInfo.roles.points.includes(key))
      return !store.state.user.userInfo.roles.points.includes(key)
    }
  }
}
