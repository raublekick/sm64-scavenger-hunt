import rules from "./rules.json";
import * as _ from "lodash";

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
    randomizeSelectedRules(state, payload) {
      // create a new array and a copy of the existing rules
      var selectedRules = [];
      var rulesCopy = Object.assign([], state.rules);

      // filter for difficulty
      if (payload.difficulty) {
        rulesCopy = _.filter(rulesCopy, rule => {
          return rule.difficulty <= parseInt(payload.difficulty);
        });
      }

      // get total length of rules so we have a ceiling
      var maxNumberOfRules = parseInt(payload.maxNumberOfRules);
      maxNumberOfRules =
        !maxNumberOfRules || maxNumberOfRules > rulesCopy.length
          ? rulesCopy.length
          : maxNumberOfRules;

      var minNumberOfRules = parseInt(payload.minNumberOfRules);
      if (!minNumberOfRules) {
        minNumberOfRules = 1;
      } else if (minNumberOfRules > maxNumberOfRules) {
        minNumberOfRules = maxNumberOfRules;
      } else if (minNumberOfRules <= 0) {
        minNumberOfRules = 1;
      }

      var totalToSelect = Math.floor(
        Math.random() * (maxNumberOfRules - minNumberOfRules + 1) +
          minNumberOfRules
      );
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
