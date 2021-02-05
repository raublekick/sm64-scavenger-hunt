<template>
  <div>
    <div v-if="selectedStars.length">
      <b-table
        :data="selectedStars"
        detailed
        detail-key="name"
        :show-detail-icon="false"
      >
        <b-table-column field="name" label="Name" v-slot="props" searchable>
          <b-icon
            icon="star"
            :class="{ 'has-text-danger': props.row.required === true }"
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
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "SelectedStars",
  computed: {
    ...mapState("rules", ["rules", "selectedStars"]),
    encodedString: {
      get() {
        return this.$store.state.rules.encodedString;
      },
      set() {
        //this.decodeString(value);
      }
    }
  }
};
</script>
<style lang="scss"></style>
