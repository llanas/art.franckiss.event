import 'leaflet/dist/leaflet.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';
import VueGeolocation from 'vue-browser-geolocation';
import { LMap, LMarker, LPopup, LTileLayer } from 'vue2-leaflet';
import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster';
import { firestorePlugin } from 'vuefire';

import App from './App.vue';

Vue.use(firestorePlugin)

Vue.component('v-marker-cluster', Vue2LeafletMarkerCluster);

Vue.use(VueGeolocation);

library.add(faSpinner);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-popup', LPopup);

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
