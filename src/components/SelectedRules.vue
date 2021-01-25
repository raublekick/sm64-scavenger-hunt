<template>
  <div>
    <div v-if="selectedRules.length">
      <b-table
        :data="selectedRules"
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
          <span
            :class="{
              tag: true,
              'is-success': props.row.difficulty === 1,
              'is-warning': props.row.difficulty === 2,
              'is-danger': props.row.difficulty === 3,
              'mr-3': true
            }"
          >
            {{
              props.row.difficulty === 1
                ? "Easy"
                : props.row.difficulty === 2
                ? "Normal"
                : props.row.difficulty === 3
                ? "Hard"
                : "Normal"
            }}
          </span>
        </b-table-column>

        <template #detail="props">
          <div>{{ props.row.notes }}</div>
          <div v-if="props.row.type !== 'single-star'">
            <hr />
            <h3 class="subtitle">Possble Stars</h3>
            <div v-for="course in props.row.stars" :key="course.code">
              {{ course.code }} - {{ course.title }}
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "SelectedRules",
  computed: {
    ...mapState("rules", ["rules", "selectedRules"])
  }
};
</script>
