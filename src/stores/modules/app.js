import { defineStore } from 'pinia'

const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const token = localStorage.getItem('token')

export const useAppStore = defineStore('app', {
  state: () => ({
    // 用户信息
    userInfo: userInfo || null,
    token: token || '',
  }),

  actions: {
    setUserInfo(v) {
      this.userInfo = v
      localStorage.setItem('userInfo', JSON.stringify(v))
    },
    setToken(v) {
      this.token = v
      localStorage.setItem('token', v)
    },
  },
  getters: {},
})
