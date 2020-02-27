import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import socket from './socket';
import VueApexCharts from 'vue-apexcharts'
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faWifi, faFingerprint, faLightbulbSlash, faWifiSlash, faSearch, faTimes,faLink, faArrowLeft,
    faSpiderWeb
} from '@fortawesome/pro-light-svg-icons';
import {
  faCog, faBiohazard, faCheckCircle, faTimesHexagon, faSortAlphaUp, faSortAlphaDown, faChevronDown,
  faServer, faQuestion, faChessRookAlt, faShieldCheck, faBan

} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faWifi, faChessRookAlt, faCog, faFingerprint, faShieldCheck, faBiohazard, faBan,
    faLightbulbSlash, faCheckCircle, faTimesHexagon, faSortAlphaUp, faSortAlphaDown, faSearch,
    faTimes, faServer, faQuestion, faWifiSlash, faLink, faChevronDown,faSpiderWeb, faArrowLeft
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
