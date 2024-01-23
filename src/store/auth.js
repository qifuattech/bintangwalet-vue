import axios from "axios"
import { removeHeaderToken, setHeaderToken } from "../utils/auth"

export default {
    state: {
        user: null,
        isLoggedIn: false,
        menu: [],
        company: "",
    },
    mutations: {
        set_user(state, data) {
            state.user = data
            state.isLoggedIn = true
        },
        reset_user(state) {
            state.user = null
            state.isLoggedIn = false
        },
        set_menu(state, data) {
            state.menu = data
        },
        reset_menu(state) {
            state.menu = null
        },
        set_company(state, data) {
            state.company = data
        }
    },
    getters: {
        isLoggedIn(state) {
            return state.isLoggedIn
        },
        user(state) {
            return state.user
        },
        menu(state) {
            return state.menu
        },
        company(state) {
            return state.company
        }
    },
    actions: {
        async get_company({ commit }) {
            await axios.post('company')
                .then((res) => {
                    commit('set_company', res.data.data)
                })
        },
        login({ dispatch, commit }, data) {
            return new Promise((resolve, reject) => {
                axios.post('login', data)
                    .then(response => {
                        const token = response.data.token
                        localStorage.setItem('token', token)
                        setHeaderToken(token)
                        dispatch('get_user')
                        resolve(response)
                    })
                    .catch(err => {
                        commit('reset_user')
                        localStorage.removeItem('token')
                        reject(err)
                    })
            })
        },
        async get_user({ commit }) {
            if (!localStorage.getItem('token')) {
                return
            }
            try {
                let response = await axios.get('user')
                commit('set_user', response.data.data)
                axios.get("menu/" + response.data.data.name + "/byusername")
                    .then((res) => {
                        commit('set_menu', res.data.data)
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } catch (error) {
                commit('reset_user')
                removeHeaderToken()
                localStorage.removeItem('token')
                return error
            }
        },
        logout({ commit }) {
            return new Promise((resolve) => {
                commit('reset_user')
                commit('reset_menu')
                localStorage.removeItem('token')
                removeHeaderToken()
                resolve()
            })
        },
        register({ commit }, data) {
            return new Promise((resolve, reject) => {
                axios.post('register', data)
                    .then(resp => {
                        resolve(resp)
                    })
                    .catch(err => {
                        commit('reset_user')
                        reject(err)
                    })
            })
        },

    }
}