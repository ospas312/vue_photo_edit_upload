import Vue from 'vue'
import App from './App.vue'
/*import Croppa from 'vue-croppa'*/

import { firestorePlugin } from 'vuefire'
import firebase from 'firebase/app' 
import 'firebase/firestore'
import 'firebase/firebase-storage'

Vue.use( firestorePlugin )
firebase.initializeApp({
 projectId: "test-2e90c", 
 databaseURL: "https://test-2e90c.firebaseio.com",
})
export const db = firebase.firestore()

/*Vue.use(Croppa)   */
Vue.config.productionTip = false

new Vue({
  render: h => h(App),

}).$mount('#app')
