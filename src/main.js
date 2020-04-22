import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import socket from './socket';
import VueApexCharts from 'vue-apexcharts'
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faWifi, faFingerprint, faSearch, faTimes,faLink, faArrowLeft,
    faCog, faBiohazard, faCheckCircle, faSortAlphaUp, faSortAlphaDown, faChevronDown,
  faServer, faQuestion, faBan, faToggleOn, faToggleOff
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faWifi, faCog, faFingerprint, faBiohazard, faBan,
     faCheckCircle, faSortAlphaUp, faSortAlphaDown, faSearch,
    faTimes, faServer, faQuestion, faLink, faChevronDown, faArrowLeft, faToggleOn, faToggleOff
);

Vue.component('apexchart', VueApexCharts);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.prototype.$socket = socket;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
