import Vue from "vue";
import rules from "./rules.json";
import stars from "./stars.json";
import * as _ from "lodash";
import idbs from "../api/idbService";

const stores = ["selectedStars", "selectedRules", "starPlans"];

/* NOTES:
 ** Possible types
 ** All - requires all that fit the criteria
 ** Single - only requires one of the type
 ** Random - pick randomly from the courses that fit the criteria, that one is required
 ** One Per Course - requires one from each course, requires getting distinct courses
 */
const storedState = JSON.parse(localStorage.getItem("scavengerCode"));
const initialState = {
  rules: rules,
  stars: stars,
  selectedRules: [],
  selectedStars: [],
  starPlans: [],
  encodedString: storedState ? storedState : ""
};

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

function setMax(userSetting, maxLength, ceiling = maxLength - 1) {
  var maxNumberOfRules = userSetting;
  if (maxNumberOfRules <= 0) {
    maxNumberOfRules = 0;
  } else if (maxNumberOfRules > ceiling) {
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
  state: () => initialState,
  mutations: {
    setState(state, { store, data }) {
      Vue.set(state, store, data);
    },
    updateSelectedRules(state, payload) {
      state.selectedRules = payload;
    },
    updateSelectedStars(state, payload) {
      state.selectedStars = payload;
    },
    updateStarPlanner(state, payload) {
      state.starPlans = payload;
    },
    insertSelectedRule(state, payload) {
      state.selectedRules.push(payload);
    },
    async setEncodedString(state, payload) {
      try {
        var encoded = payload ? btoa(JSON.stringify(payload)) : "";
      } catch (error) {
        console.log(error);
        console.log(payload);
        return error;
      }

      state.encodedString = encoded;
      localStorage.setItem(
        "scavengerCode",
        JSON.stringify(state.encodedString)
      );
    }
  },
  actions: {
    async randomizeSelectedRules(
      { state, commit, dispatch, rootState },
      payload
    ) {
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
        stars.length
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
      commit("updateStarPlanner", []);
      commit("updateSelectedRules", selectedRules);
      await dispatch("saveToDb", {
        store: "selectedRules",
        items: selectedRules
      });
      await dispatch("getSelectedStars");
      await commit("setEncodedString", selectedRules);
      console.log("Randomized!");
    },
    async addSelectedRules({ commit, dispatch, rootState }, payload) {
      // create a new array and a copy of the existing rules
      var stars = rootState.stars.stars;

      _.forEach(payload, selectedRule => {
        if (selectedRule.type && selectedRule.type !== "single-star") {
          selectedRule.stars = getStars(selectedRule, stars);
        }
      });
      commit("updateStarPlanner", []);
      commit("updateSelectedRules", payload);
      await dispatch("saveToDb", { store: "selectedRules", items: payload });
      dispatch("getSelectedStars");
      commit("setEncodedString", payload);
    },
    async getSelectedStars({ state, commit, dispatch }) {
      var mappedStars = [];
      var selectedRules = Object.assign([], state.selectedRules);
      _.forEach(selectedRules, rule => {
        if (rule.type === "single-star") {
          var mappedStar = _.filter(mappedStars, mappedStar => {
            return mappedStar.name === rule.name;
          })[0];
          if (!mappedStar) {
            mappedStar = Object.assign({}, rule);
            mappedStar.required = true;
            mappedStars.push(mappedStar);
          }
        } else {
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
              if (rule.type === "all" || mappedStar.required) {
                mappedStar.required = true;
              } else {
                mappedStar.required = false;
              }
            }
          });
        }
      });

      // var flattened = _.flatten(starMap);
      // _.forEach(flattened, star => {
      //   star.rules = _.uniq(star.rules);
      // });
      var sorted = _.sortBy(mappedStars, ["id"]);
      commit("updateSelectedStars", sorted);
      await dispatch("saveToDb", { store: "selectedStars", items: sorted });
      dispatch("getStarPlanner");
    },
    async getStarPlanner({ state, commit, dispatch, rootState }) {
      var stars =
        state.starPlans && state.starPlans.length
          ? state.starPlans
          : JSON.parse(JSON.stringify(rootState.stars.stars));
      var selectedStars = state.selectedStars;

      _.forEach(stars, star => {
        var rule = _.filter(selectedStars, selected => {
          return selected.id === star.id;
        })[0];

        if (rule) {
          star.rules = rule.rules;
          if (rule.required) {
            star.checked = true;
            star.required = true;
          }
          //else if (star.checked) {
          //   star.checked = true;
          //   star.required = false;
          // }
          else {
            star.checked = star.checked || false;
            star.required = false;
          }
        } else {
          star.required = null;
          star.checked = star.checked || false;
        }
      });

      commit("updateStarPlanner", stars);
      await dispatch("saveToDb", { store: "starPlans", items: stars });
    },
    async decodeString({ commit, dispatch }, payload) {
      try {
        var decoded = JSON.parse(atob(payload));
        commit("setState", { store: "selectedRules", data: decoded });
        await dispatch("saveToDb", { store: "selectedRules", items: decoded });
        commit("updateStarPlanner", []);
        dispatch("getSelectedStars");
        commit("setEncodedString", decoded);
      } catch (e) {
        console.log("error decoding string");
        commit("updateSelectedRules", []);
        commit("updateSelectedStars", []);
        commit("updateStarPlanner", []);
        commit("setEncodedString", "");
      }
    },
    async saveToDb({ state, dispatch }, payload) {
      await dispatch("clear", payload.store);
      console.log(state);
      try {
        await idbs.save(payload.store, payload.items);
      } catch (e) {
        console.log("Error saving " + payload.store + ": " + e);
      }
    },
    async clear({ state }, payload) {
      console.log(state);
      idbs.clear(payload);
    },
    async initState({ commit }) {
      stores.forEach(async store => {
        try {
          let data = await idbs.getAll(store);
          if (data === null) data = [];
          commit("setState", { store, data });
        } catch (e) {
          // The value in storage was invalid or corrupt so just set it to blank
          console.log(e);
          commit("setState", { store, data: [] });
        }
      });
    }
  },
  modules: {}
};
