import { createApp, reactive } from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
window.axios = axios;

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';

import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.bundle.js';

import {BootstrapVue3, BModal} from 'bootstrap-vue-3';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import { BContainer, BRow, BCol } from 'bootstrap-vue-3';
import Vuelidate from '@vuelidate/core';
import './assets/custom.css';


// Router setup
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Shared store
const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: 'http://localhost:3000',
  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log('login', this.username);
  },
  logout() {
    console.log('logout');
    localStorage.removeItem('username');
    this.username = undefined;
  },
});

// Axios interceptors
axios.interceptors.request.use((config) => config, (error) => Promise.reject(error));
axios.interceptors.response.use((response) => response, (error) => Promise.reject(error));

// Create app
const app = createApp(App);

// Plugins
app.use(router);
app.use(VueAxios, axios);
app.use(BootstrapVue3);
app.component('BModal', BModal);
app.use(Vuelidate); 
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
});

// Register global BootstrapVue3 components
app.component('BContainer', BContainer);
app.component('BRow', BRow);
app.component('BCol', BCol);

// Global store
app.config.globalProperties.store = store;

// Mount app
app.mount('#app');
