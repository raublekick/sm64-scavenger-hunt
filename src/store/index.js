import Vue from "vue";
import Vuex from "vuex";
import stars from "./stars";
import rules from "./rules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { stars, rules }
});
