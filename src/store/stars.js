import courses from "./stars.json";

export default {
  namespaced: true,
  state: () => ({
    stars: courses,
    selectedStars: []
  }),
  mutations: {},
  actions: {},
  modules: {}
};
