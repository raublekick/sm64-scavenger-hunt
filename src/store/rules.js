import rules from "./rules.json";

export default {
  namespaced: true,
  state: () => ({
    rules: rules,
    selectedRules: []
  }),
  mutations: {
    updateSelectedRules(state, payload) {
      state.selectedRules = payload;
    },
    randomizeSelectedRules(state) {
      // create a new array and a copy of the existing rules
      var selectedRules = [];
      var rulesCopy = Object.assign([], state.rules);

      // get total length of rules so we have a ceiling
      var totalRules = rulesCopy.length - 1;
      var totalToSelect = Math.floor(Math.random() * Math.floor(totalRules));
      totalToSelect = totalToSelect === 0 ? 1 : totalToSelect;

      // get X random rules
      for (var i = 1; i <= totalToSelect; i++) {
        var selectedRuleIndex = Math.floor(
          Math.random() * Math.floor(rulesCopy.length)
        );
        selectedRules.push(rulesCopy[selectedRuleIndex]);
        // splice selected rule from the list so it can't be used again
        rulesCopy.splice(selectedRuleIndex, 1);
      }

      state.selectedRules = selectedRules;
    }
  },
  actions: {},
  modules: {}
};
