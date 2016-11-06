import Vue from 'vue'
import App from './App.vue'
import Rx from 'rxjs/Rx'
import VueRx from 'vue-rx'

Vue.use(VueRx, Rx)

new Vue({
  el: '#app',
  render: h => h(App)
})
