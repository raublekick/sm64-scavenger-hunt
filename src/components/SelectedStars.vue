<template>
  <div>
    <div v-if="selectedRules.length">
      <b-table
        :data="starMap"
        detailed
        detail-key="name"
        :show-detail-icon="true"
      >
        <b-table-column field="name" label="Name" v-slot="props" searchable>
          <b-icon
            icon="star"
            :class="{ 'has-text-danger': props.row.required === true }"
          />
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="tags" label="Tags" v-slot="props" searchable>
          <span
            v-for="(tag, i) in !props.row.tags ? [] : props.row.tags.split(',')"
            :key="i"
            class="tag is-success mr-3"
          >
            {{ tag }}
          </span>
        </b-table-column>

        <b-table-column
          field="difficulty"
          label="Difficulty"
          v-slot="props"
          searchable
        >
          <span
            :class="{
              tag: true,
              'is-success': props.row.difficulty === 'Easy',
              'is-warning': props.row.difficulty === 'Normal',
              'is-danger': props.row.difficulty === 'Hard',
              'mr-3': true
            }"
          >
            {{ props.row.difficulty }}
          </span>
        </b-table-column>

        <template #detail="props">
          <div>{{ props.row.notes }}</div>
          <div>
            <hr />
            <div v-for="rule in props.row.rules" :key="rule.name">
              {{ rule.name }}
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import * as _ from "lodash";

export default {
  name: "SelectedStars",
  computed: {
    ...mapState("rules", ["rules", "selectedRules"]),
    encodedString: {
      get() {
        return this.$store.state.rules.encodedString;
      },
      set(value) {
        this.decodeString(value);
      }
    },
    starMap() {
      var starMap = _.map(this.selectedRules, rule => {
        var stars = rule.stars;
        _.forEach(stars, star => {
          if (!star.rules) {
            star.rules = [];
          }
          if (star.rules.indexOf(rule.name) === -1) {
            star.rules.push(rule);
            if (rule.type === "all") {
              star.required = true;
            }
          }
        });
        return stars;
      });
      var flattened = _.flatten(starMap);
      _.forEach(flattened, star => {
        star.rules = _.uniq(star.rules);
      });
      var sorted = _.sortBy(flattened, ["name"]);
      return sorted;
    }
  },
  methods: {
    ...mapActions("rules", ["decodeString"])
  }
};
</script>
<style lang="scss"></style>
