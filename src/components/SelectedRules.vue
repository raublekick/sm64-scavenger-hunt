<template>
  <div>
    <b-field label="Code">
      <b-input type="textarea" v-model="encodedString"></b-input>
    </b-field>
    <div class="is-size-7">Copy and paste to share</div>

    <div v-if="selectedRules.length">
      <b-table
        :data="selectedRules"
        detailed
        detail-key="name"
        :show-detail-icon="true"
      >
        <b-table-column field="name" label="Name" v-slot="props" searchable>
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
          <div v-if="props.row.type !== 'single-star'">
            <hr />
            <h3 class="subtitle">Possible Stars</h3>
            <div v-for="course in props.row.stars" :key="course.code">
              {{ course.name }}
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "SelectedRules",
  computed: {
    ...mapState("rules", ["rules", "selectedRules"]),
    encodedString: {
      get() {
        return this.$store.state.rules.encodedString;
      },
      set(value) {
        this.decodeString(value);
      }
    }
  },
  methods: {
    ...mapActions("rules", ["decodeString"])
  }
};
</script>
