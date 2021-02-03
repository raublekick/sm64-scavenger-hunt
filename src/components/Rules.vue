<template>
  <div>
    <b-table
      :data="rules"
      checkable
      :checked-rows.sync="selectedRules"
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
    </b-table>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Rules",
  data() {
    return {
      checkedRows: []
    };
  },
  methods: {
    ...mapActions("rules", ["addSelectedRules"])
  },
  computed: {
    ...mapState("rules", ["rules"]),
    selectedRules: {
      get() {
        return this.$store.state.rules.selectedRules;
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
