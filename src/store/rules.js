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
  if (difficulty !== "" && difficulty !== null) {
    return _.filter(rules, rule => {
      return (
        transposeDifficulty(rule.difficulty) <= transposeDifficulty(difficulty)
      );
    });
  }
  return rules;
}

function setMax(userSetting, maxLength, ceiling = maxLength) {
  var maxNumberOfRules = userSetting;
  if (maxNumberOfRules <= 0) {
    maxNumberOfRules = 0;
  } else if (maxNumberOfRules > maxLength) {
    maxNumberOfRules = ceiling;
  } else if (!maxNumberOfRules) {
    maxNumberOfRules = ceiling;
  }
  return maxNumberOfRules;
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
    selectedStars: [],
    encodedString: ""
  }),
  mutations: {
    updateSelectedRules(state, payload) {
      state.selectedRules = payload;
    },
    updateSelectedStars(state, payload) {
      state.selectedStars = payload;
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
    randomizeSelectedRules({ state, commit, dispatch, rootState }, payload) {
      // create a new array and a copy of the existing rules
      var stars = Object.assign([], rootState.stars.stars);
      var selectedRules = [];
      var rulesCopy = Object.assign([], state.rules);

      // filter for difficulty
      rulesCopy = filterDifficulty(rulesCopy, payload.difficulty);

      // validate max and min settings
      var maxNumberOfRules = setMax(
        parseInt(payload.maxNumberOfRules),
        rulesCopy.length
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
      dispatch("getSelectedStars");
    },
    addSelectedRules({ commit, dispatch, rootState }, payload) {
      // create a new array and a copy of the existing rules
      var stars = rootState.stars.stars;

      _.forEach(payload, selectedRule => {
        if (selectedRule.type && selectedRule.type !== "single-star") {
          selectedRule.stars = getStars(selectedRule, stars);
        }
      });

      commit("updateSelectedRules", payload);
      commit("setEncodedString", payload);
      dispatch("getSelectedStars");
    },
    getSelectedStars({ state, commit }) {
      var mappedStars = [];
      _.forEach(state.selectedRules, rule => {
        _.forEach(rule.stars, star => {
          var mappedStar = _.filter(mappedStars, mappedStar => {
            return mappedStar.name === star.name;
          })[0];
          if (!mappedStar) {
            mappedStar = Object.assign({}, star);
            mappedStars.push(mappedStar);
          }
          if (!mappedStar.rules) {
            mappedStar.rules = [];
          }
          if (mappedStar.rules.indexOf(rule.name) === -1) {
            mappedStar.rules.push(rule);
            if (rule.type === "all") {
              mappedStar.required = true;
            }
          }
        });
      });

      // var flattened = _.flatten(starMap);
      // _.forEach(flattened, star => {
      //   star.rules = _.uniq(star.rules);
      // });
      var sorted = _.sortBy(mappedStars, ["name"]);
      commit("updateSelectedStars", sorted);
    },
    decodeString({ commit, dispatch }, payload) {
      try {
        var decoded = JSON.parse(atob(payload));
        commit("updateSelectedRules", decoded);
        dispatch("getSelectedStars");
      } catch (e) {
        console.log("error decoding string");
        commit("updateSelectedRules", []);
        commit("updateSelectedStars", []);
      }
    }
  },
  modules: {}
};
