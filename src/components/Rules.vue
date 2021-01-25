<template>
  <div>
    <b-button class="is-primary" @click="randomizeSelectedRules"
      >Randomize</b-button
    >
    <b-table
      :data="rules"
      checkable
      :checked-rows.sync="selectedRules"
      detailed
      detail-key="title"
      :show-detail-icon="true"
    >
      <b-table-column field="title" label="Name" v-slot="props" searchable>
        {{ props.row.title }}
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
        {{ props.row.difficulty }}
      </b-table-column>

      <template #detail="props">
        <div>{{ props.row.notes }}</div>
      </template>
    </b-table>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Rules",
  data() {
    return {
      checkedRows: []
    };
  },
  methods: {
    ...mapMutations("rules", ["randomizeSelectedRules"])
  },
  computed: {
    ...mapState("rules", ["rules"]),
    selectedRules: {
      get() {
        return this.$store.state.rules.selectedRules;
      },
      set(value) {
        this.$store.commit("rules/updateSelectedRules", value);
      }
    }
  },
  components: {}
};
</script>
