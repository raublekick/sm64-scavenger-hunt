<template>
  <div>
    <b-table
      :data="rules"
      checkable
      :checked-rows.sync="checkedRows"
      detailed
      detail-key="name"
      :show-detail-icon="false"
    >
      <b-table-column field="name" label="Name" v-slot="props" searchable>
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
      </template>
      <template #bottom-left>
        <b>Total checked</b>: {{ checkedRows.length }}
      </template>
    </b-table>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import * as _ from "lodash";
export default {
  name: "Rules",
  data() {
    return {};
  },
  methods: {
    ...mapActions("rules", ["addSelectedRules"])
  },
  computed: {
    ...mapState("rules", ["rules", "selectedRules"]),
    checkedRows: {
      get() {
        var items = [];
        _.forEach(this.selectedRules, rule => {
          if (rule.type !== "single-star") {
            var found = _.filter(this.rules, item => {
              return item.name === rule.name;
            })[0];
            if (found) {
              items.push(found);
            }
          }
        });
        return items;
      },
      set(value) {
        this.addSelectedRules(value);
      }
    }
  },
  components: {},
  created() {}
};
</script>
