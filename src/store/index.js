import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiServer: 'http://localhost:8000',
    // apiLokal: 'http://192.168.2.8:8000/api/',
    apiLokal: 'http://localhost:8000',
    // menu: [],
    today: "",
    isOnline: true,
    breadcrumbs: ['Dashboard','Software'],

  },
  mutations: {
    setApi(state, api) {
      var arrApi = []
      arrApi = api.split(";")
      state.apiServer = arrApi[0]
      state.apiLokal = arrApi[1]
    },
    
    setOnline(state) {
      state.isOnline = true
    },
    
    setOffline(state) {
      state.isOnline = false
    }
  },
  getters: {
    // dataMenu(state) {
    //   return state.menu
    // },
    getToday(state) {
      var today = new Date()
      var mm = String(today.getMonth() +1).padStart(2,'0')
      var yyyy = today.getFullYear()
      today = yyyy + '-'+ mm
      return state.today
    }
  },
  actions: {
    setToday(state) {
      var today = new Date()
      var mm = String(today.getMonth() +1).padStart(2,'0')
      var yyyy = today.getFullYear()
      state.today = yyyy + '-'+ mm
    }
    //   store.commit('authenticate', {
    //     token,
    //     expiration,
    // });
  },
  modules: {
    auth
  }
})
