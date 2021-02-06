<template>
  <div>
    <div class="columns">
      <div class="column">
        <b-field class="mt-2">
          <b-switch
            v-model="checkedFilter"
            type="is-warning"
            :true-value="true"
            :false-value="false"
            :rounded="false"
            passive-type="is-danger"
          >
            {{ checkedFilter ? "Only checked items" : "All items" }}
          </b-switch>
        </b-field>
      </div>
      <div class="column">
        <b-button
          class="is-pulled-right"
          type="is-primary"
          tag="router-link"
          :to="{ path: '/' }"
          >Randomizer</b-button
        >
      </div>
    </div>
    <div class="is-clearfix"></div>
    <b-message>
      <div><b-icon icon="star" class="has-text-danger" /> Required</div>
      <div><b-icon icon="star" class="has-text-info" /> Optional</div>
      <div><b-icon icon="star" /> Not needed</div>
    </b-message>
    <b-table
      :data="checkedFilter ? checkedRows : starPlans"
      detailed
      detail-key="name"
      checkable
      :checked-rows.sync="checkedRows"
      :is-row-checkable="row => !row.required"
      :show-detail-icon="false"
    >
      <b-table-column
        field="completed"
        label="Completed"
        v-slot="props"
        cell-class="checkbox-cell"
      >
        <b-field>
          <b-checkbox v-model="completedRows" :native-value="props.row.id">
          </b-checkbox>
        </b-field>
      </b-table-column>
      <b-table-column field="name" label="Name" v-slot="props" searchable>
        <b-icon
          icon="star"
          :class="{
            'has-text-danger': props.row.required === true,
            'has-text-info': props.row.required === false
          }"
        />
        <a @click="props.toggleDetails(props.row)">
          {{ props.row.name }}
        </a>
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
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import * as _ from "lodash";

export default {
  name: "StarPlanner",
  data() {
    return {
      checkedFilter: false
    };
  },
  computed: {
    ...mapState("rules", ["starPlans"]),
    checkedRows: {
      get() {
        var items = [];
        _.forEach(this.starPlans, star => {
          if (star.checked) {
            items.push(star);
          }
        });
        return items;
      },
      set(value) {
        _.forEach(this.starPlans, item => {
          var match = _.filter(value, row => {
            return row.id === item.id;
          })[0];

          if (match) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        this.updateStarPlanner(this.starPlans);
      }
    },
    completedRows: {
      get() {
        var items = [];
        _.forEach(this.starPlans, star => {
          if (star.completed) {
            items.push(star.id);
          }
        });
        return items;
      },
      set(value) {
        console.log(value);
        _.forEach(this.starPlans, item => {
          var match = _.filter(value, row => {
            return row === item.id;
          })[0];

          if (match) {
            item.completed = true;
          } else {
            item.completed = false;
          }
        });
        this.updateStarPlanner(this.starPlans);
        this.saveToDb({ store: "starPlans", items: this.starPlans });
      }
    }
  },
  methods: {
    ...mapMutations("rules", ["updateStarPlanner"]),
    ...mapActions("rules", ["saveToDb"]),
    setSelectedStars(starPlans) {
      _.forEach(starPlans, star => {
        if (star.checked) {
          this.checkedRows.push(star);
        }
      });
    },
    updateCompleted(value) {
      _.forEach(this.starPlans, item => {
        var match = _.filter(value, row => {
          return row.id === item.id;
        })[0];

        if (match) {
          match.completed = true;
        }
      });
      this.updateStarPlanner(this.starPlans);
    }
  },
  created() {
    //this.setSelectedStars(this.starPlanner);
  }
};
</script>
<style lang="scss"></style>
