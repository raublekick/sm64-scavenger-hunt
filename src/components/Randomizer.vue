<template>
  <div>
    <b-field label="Max Difficulty">
      <b-select v-model="options.difficulty">
        <option value="Easy">Easy</option>
        <option value="Normal">Normal</option>
        <option value="Hard">Hard</option>
      </b-select>
    </b-field>
    <b-field label="Min number of rules">
      <b-input type="number" v-model="options.minNumberOfRules"></b-input>
    </b-field>
    <b-field label="Max number of rules">
      <b-input type="number" v-model="options.maxNumberOfRules"></b-input>
    </b-field>
    <b-field label="Min number of random stars">
      <b-input type="number" v-model="options.minRandomStars"></b-input>
    </b-field>
    <b-field label="Max number of random stars">
      <b-input type="number" v-model="options.maxRandomStars"></b-input>
    </b-field>
    <p class="control">
      <b-button class="is-primary" @click="randomizeSelectedRules(options)"
        >Randomize</b-button
      >
    </p>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Rules",
  data() {
    return {
      checkedRows: [],
      options: {
        difficulty: null,
        maxNumberOfRules: 1,
        minNumberOfRules: 1,
        maxRandomStars: 0,
        minRandomStars: 0
      }
    };
  },
  methods: {
    ...mapActions("rules", ["randomizeSelectedRules"])
  },
  computed: {
    ...mapState("rules", ["rules", "selectedRules"])
  },
  components: {},
  created() {
    if (this.rules) {
      this.options.maxNumberOfRules = this.rules.length;
    }
  }
};
</script>
