import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

//theme
import "primevue/resources/themes/lara-light-indigo/theme.css";     
    
//core
import "primevue/resources/primevue.min.css";
// createApp(App).mount('#app')

const app = createApp(App);
app.use(PrimeVue);
app.mount('#app')
