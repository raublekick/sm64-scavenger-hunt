<template>
  <div>
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
    <b-table
      :data="checkedFilter ? checkedRows : starPlanner"
      detailed
      detail-key="name"
      checkable
      :checked-rows.sync="checkedRows"
      :is-row-checkable="row => !row.required"
      :show-detail-icon="false"
    >
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
import { mapState, mapMutations } from "vuex";
import * as _ from "lodash";

export default {
  name: "StarPlanner",
  data() {
    return {
      checkedFilter: false
    };
  },
  computed: {
    ...mapState("rules", ["starPlanner"]),
    checkedRows: {
      get() {
        var items = [];
        _.forEach(this.starPlanner, star => {
          if (star.checked) {
            items.push(star);
          }
        });
        return items;
      },
      set(value) {
        _.forEach(this.starPlanner, item => {
          var match = _.filter(value, row => {
            return row.id === item.id;
          })[0];

          if (match) {
            match.checked = true;
          }
        });
        this.updateStarPlanner(this.starPlanner);
      }
    }
  },
  methods: {
    ...mapMutations("rules", ["updateStarPlanner"]),
    setSelectedStars(starPlanner) {
      _.forEach(starPlanner, star => {
        if (star.checked) {
          this.checkedRows.push(star);
        }
      });
    }
  },
  created() {
    //this.setSelectedStars(this.starPlanner);
  }
};
</script>
<style lang="scss"></style>
