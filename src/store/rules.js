import rules from "./rules.json";
import * as _ from "lodash";

/* NOTES:
 ** Possible types
 ** All - requires all that fit the criteria
 ** Single - only requires one of the type
 ** Random - pick randomly from the courses that fit the criteria, that one is required
 ** One Per Course - requires one from each course, requires getting distinct courses
 */

function getStars(rule, stars) {
  // TODO: set required/optional status based on rule type
  return _.filter(stars, star => {
    return rule.tags.split(",").some(r => star.tags.split(",").includes(r));
  });
}

function filterDifficulty(rules, difficulty) {
  if (difficulty) {
    return _.filter(rules, rule => {
      return rule.difficulty <= difficulty;
    });
  }
  return rules;
}

function setMaxNumberOfRules(userSetting, maxLength) {
  return !userSetting || userSetting > maxLength ? maxLength : userSetting;
}

function setMinNumberOfRules(userSetting, maxLength) {
  var minNumberOfRules = userSetting;
  if (!minNumberOfRules) {
    minNumberOfRules = 1;
  } else if (minNumberOfRules > maxLength) {
    minNumberOfRules = maxLength;
  } else if (minNumberOfRules <= 0) {
    minNumberOfRules = 1;
  }
  return minNumberOfRules;
}

function setTotal(min, max) {
  var total = Math.floor(Math.random() * (max - min + 1) + min);
  return total === 0 ? 1 : total;
}

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
    insertSelectedRule(state, payload) {
      state.selectedRules.push(payload);
    }
    // randomizeSelectedRules(state, payload) {
    //   state.selectedRules =
    // }
  },
  actions: {
    randomizeSelectedRules({ state, commit, rootState }, payload) {
      // create a new array and a copy of the existing rules
      var stars = rootState.stars.stars;
      var selectedRules = [];
      var rulesCopy = Object.assign([], state.rules);

      // filter for difficulty
      rulesCopy = filterDifficulty(rulesCopy, parseInt(payload.difficulty));

      // validate max and min settings
      var maxNumberOfRules = setMaxNumberOfRules(
        parseInt(payload.maxNumberOfRules),
        rulesCopy.length
      );

      var minNumberOfRules = setMinNumberOfRules(
        parseInt(payload.minNumberOfRules),
        maxNumberOfRules
      );

      var totalToSelect = setTotal(maxNumberOfRules, minNumberOfRules);

      // get X random rules
      for (var i = 1; i <= totalToSelect; i++) {
        var selectedRuleIndex = Math.floor(
          Math.random() * Math.floor(rulesCopy.length)
        );
        var selectedRule = rulesCopy[selectedRuleIndex];
        selectedRule.stars = getStars(selectedRule, stars);
        selectedRules.push(selectedRule);
        // splice selected rule from the list so it can't be used again
        rulesCopy.splice(selectedRuleIndex, 1);
      }

      //state.selectedRules = selectedRules;
      commit("updateSelectedRules", selectedRules);
    },
    addSelectedRules({ commit, rootState }, payload) {
      // create a new array and a copy of the existing rules
      var stars = rootState.stars.stars;

      _.forEach(payload, selectedRule => {
        selectedRule.stars = getStars(selectedRule, stars);
      });

      //state.selectedRules = selectedRules;
      commit("updateSelectedRules", payload);
    }
  },
  modules: {}
};
