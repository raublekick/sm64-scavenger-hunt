<template>
  <div>
    <div class="columns">
      <div class="column is-two-fifths">
        <b-field label="Difficulty">
          <b-select v-model="options.difficulty">
            <option value="1">Easy</option>
            <option value="2">Normal</option>
            <option value="3">Hard</option>
          </b-select>
        </b-field>
        <b-field label="Min number of rules">
          <b-input type="number" v-model="options.minNumberOfRules"></b-input>
        </b-field>
        <b-field label="Max number of rules">
          <b-input type="number" v-model="options.maxNumberOfRules"></b-input>
        </b-field>
        <p class="control">
          <b-button class="is-primary" @click="randomizeSelectedRules(options)"
            >Randomize</b-button
          >
        </p>
      </div>
      <div class="column">
        <div v-if="selectedRules.length">
          <b-table
            :data="selectedRules"
            detailed
            detail-key="title"
            :show-detail-icon="true"
          >
            <b-table-column
              field="title"
              label="Name"
              v-slot="props"
              searchable
            >
              {{ props.row.title }}
            </b-table-column>
            <b-table-column field="tags" label="Tags" v-slot="props" searchable>
              <span
                v-for="(tag, i) in !props.row.tags
                  ? []
                  : props.row.tags.split(',')"
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
              <h3 class="subtitle">Possble Stars</h3>
              <div v-for="course in props.row.stars" :key="course.code">
                {{ course.code }} - {{ course.title }}
              </div>
            </template>
          </b-table>
        </div>
      </div>
    </div>
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
        minNumberOfRules: 1
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
