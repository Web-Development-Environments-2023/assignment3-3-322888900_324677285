import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import 'dotenv/config'
axios.defaults.withCredentials = true

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
import routes from "./routes";
import VueRouter from "vue-router";
Vue.use(VueRouter);
const router = new VueRouter({
  routes,
});

import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {
  ModalPlugin,
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
} from "bootstrap-vue";
[
  ModalPlugin,
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
].forEach((x) => Vue.use(x));
Vue.use(Vuelidate);

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

const shared_data = {
  server_domain: "https://Exprecipes.cs.bgu.ac.il",
 // server_domain:"http://localhost:3000",
  username: localStorage.username,
  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    localStorage.setItem("lastSearch", JSON.stringify({}));
    this.lastSearch = {}
    localStorage.setItem("watchedRecipes", JSON.stringify({"recipes_id":[]}))
    this.watchedRecipes = {"recipes_id":[]}

  },
  
  logout() {
    localStorage.removeItem("username");
    this.username = undefined;
    localStorage.removeItem("lastSearch");
    this.lastSearch = undefined
    localStorage.removeItem("watchedRecipes") 
    this.watchedRecipes = undefined

  },
};
// Vue.prototype.$root.store = shared_data;

new Vue({
  router,
  data() {
    return {
      store: shared_data,
    };
  },
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000,
      });
    },
  },
  render: (h) => h(App),
}).$mount("#app");
