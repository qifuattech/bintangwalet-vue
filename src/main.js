import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import Notifications from 'vue-notification'
// import VueToast from 'vue-toast-notification';
import axios from 'axios';
import '@mdi/font/css/materialdesignicons.css';
// import VueHtmlToPaper from "vue-html-to-paper";
import { setHeaderToken } from './utils/auth.js'
import JsonExcel from "vue-json-excel";
import VueCryptojs from 'vue-cryptojs'
import numeral from 'numeral'
import moment from 'moment'
 

Vue.component("DownloadExcel", JsonExcel);
// axios.defaults.baseURL = 'http://192.168.54.2/web-mjc-api/api/'
// axios.defaults.baseURL = 'http://192.168.2.8:8000/api/'
// axios.defaults.baseURL = 'http://192.168.2.8/api-webmjc/api'
// axios.defaults.baseURL = 'http://192.168.2.10/api-it/api'
// axios.defaults.baseURL = 'http://192.168.2.10/api-it-dev/api'
// axios.defaults.baseURL = 'http://localhost:8000/api'
// axios.defaults.baseURL = 'http://192.168.1.5:8000/api'
// axios.defaults.baseURL = 'https://bintangwalet-api.qifuattech.my.id/public/api'
axios.defaults.baseURL = 'https://api.sinarpanganfood.com/public/api'

// import 'vue-toast-notification/dist/theme-sugar.css';
// import './registerServiceWorker'
// Vue.use(VueToast);
// Vue.use(VueHtmlToPaper, options);
Vue.mixin({
  methods: {
    formatNumber: value => numeral(value).format("0,0"),
    formatDate: value => {
      if (moment(String(value)).isValid()) {
        return moment(String(value)).format("DD-MM-YYYY");
      }
      return "-";
    },
    formatDateTime: value => {
      if (moment(String(value)).isValid()) {
        return moment(String(value)).format("DD MMM YYYY HH:mm:ss");
      }
      return "-";
    },
    formatDateTime2: value => {
      if (moment(String(value)).isValid()) {
        return moment(String(value)).format("DD MMM YYYY HH:mm");
      }
      return "-";
    }
  }
})

Vue.use(Notifications)
Vue.use(VueCryptojs)

Vue.config.productionTip = false

// const options = {
//   name: "_blank",
//   specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
// };

const token = localStorage.getItem('token');
Vue.config.keyCodes = {
  shift: 20,
  backspace: 21,
}

if (token) {
  setHeaderToken(token)
}

store.dispatch('get_user', token)
  .then(() => {
    new Vue({
      router,
      store,
      vuetify,
      
      render: h => h(App)
    }).$mount('#app')
  }).catch((error) => {
    console.error(error)
  })
