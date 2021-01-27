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

function transposeDifficulty(difficulty) {
  switch (difficulty) {
    case "Easy":
      return 0;
    case "Normal":
      return 2;
    case "Hard":
      return 3;
    default:
      return 0;
  }
}

function filterDifficulty(rules, difficulty) {
  if (difficulty !== "" || difficulty !== null) {
    return _.filter(rules, rule => {
      return (
        transposeDifficulty(rule.difficulty) <= transposeDifficulty(difficulty)
      );
    });
  }
  return rules;
}

function setMax(userSetting, maxLength, ceiling = maxLength) {
  return !userSetting || userSetting > maxLength ? ceiling : userSetting;
}

function setMin(userSetting, maxLength, floor = 1) {
  var minNumberOfRules = userSetting;
  if (!minNumberOfRules) {
    minNumberOfRules = floor;
  } else if (minNumberOfRules > maxLength) {
    minNumberOfRules = maxLength;
  } else if (minNumberOfRules <= 0) {
    minNumberOfRules = floor;
  }
  return minNumberOfRules;
}

function setTotal(min, max) {
  //var total = Math.floor(Math.random() * (max - min + 1) + min);
  var total = Math.floor(Math.random() * (max - min + 1)) + min;
  return total;
}

export default {
  namespaced: true,
  state: () => ({
    rules: rules,
    selectedRules: [],
    encodedString: ""
  }),
  mutations: {
    updateSelectedRules(state, payload) {
      state.selectedRules = payload;
    },
    insertSelectedRule(state, payload) {
      state.selectedRules.push(payload);
    },
    setEncodedString(state, payload) {
      var encoded = btoa(JSON.stringify(payload));
      state.encodedString = encoded;
    }
    // randomizeSelectedRules(state, payload) {
    //   state.selectedRules =
    // }
  },
  actions: {
    randomizeSelectedRules({ state, commit, rootState }, payload) {
      // create a new array and a copy of the existing rules
      var stars = Object.assign([], rootState.stars.stars);
      var selectedRules = [];
      var rulesCopy = Object.assign([], state.rules);

      // filter for difficulty
      rulesCopy = filterDifficulty(rulesCopy, payload.difficulty);

      // validate max and min settings
      var maxNumberOfRules = setMax(
        parseInt(payload.maxNumberOfRules),
        rulesCopy.length,
        0
      );

      var minNumberOfRules = setMin(
        parseInt(payload.minNumberOfRules),
        maxNumberOfRules,
        0
      );

      var maxRandomStars = setMax(
        parseInt(payload.maxRandomStars),
        stars.length,
        0
      );

      var minRandomStars = setMin(
        parseInt(payload.minRandomStars),
        maxRandomStars,
        0
      );

      var totalToSelect = setTotal(minNumberOfRules, maxNumberOfRules);

      var i, selectedRuleIndex, selectedRule;
      // get X random rules
      for (i = 1; i <= totalToSelect; i++) {
        selectedRuleIndex = Math.floor(
          Math.random() * Math.floor(rulesCopy.length)
        );
        selectedRule = rulesCopy[selectedRuleIndex];
        selectedRule.stars = getStars(selectedRule, stars);
        selectedRules.push(selectedRule);
        // splice selected rule from the list so it can't be used again
        rulesCopy.splice(selectedRuleIndex, 1);
      }

      stars = filterDifficulty(stars, payload.difficulty);

      var totalRandomStars = !maxRandomStars
        ? 0
        : setTotal(minRandomStars, maxRandomStars);
      for (i = 1; i <= totalRandomStars; i++) {
        selectedRuleIndex = Math.floor(
          Math.random() * Math.floor(stars.length)
        );
        selectedRule = stars[selectedRuleIndex];
        selectedRule.type = "single-star";
        // var starRule = {
        //   title: selectedRule.code + " " + selectedRule.title,
        //   type: "single-star",
        //   notes: selectedRule.notes,
        //   difficulty: selectedRule.difficulty,
        //   tags: selectedRule.tags
        // };
        // selectedRule.name = selectedRule.code + " " + selectedRule.title;
        // selectedRule.type = "single-star";
        selectedRules.push(selectedRule);
        // splice selected rule from the list so it can't be used again
        stars.splice(selectedRuleIndex, 1);
      }

      commit("updateSelectedRules", selectedRules);
      commit("setEncodedString", selectedRules);
    },
    addSelectedRules({ commit, rootState }, payload) {
      // create a new array and a copy of the existing rules
      var stars = rootState.stars.stars;

      _.forEach(payload, selectedRule => {
        if (selectedRule.type) {
          selectedRule.stars = getStars(selectedRule, stars);
        } else if (!selectedRule.type || selectedRule.type === "single-star") {
          // selected rule is a star and needs mapped
          // selectedRule.name = selectedRule.code + " " + selectedRule.title;
          // selectedRule.type = "single-star";
        }
      });

      commit("updateSelectedRules", payload);
      commit("setEncodedString", payload);
    },
    decodeString({ commit }, payload) {
      try {
        var decoded = JSON.parse(atob(payload));
        commit("updateSelectedRules", decoded);
      } catch (e) {
        console.log("error decoding string");
        commit("updateSelectedRules", []);
      }
    }
  },
  modules: {}
};
