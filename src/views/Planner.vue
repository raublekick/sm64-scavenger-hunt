<template>
  <div class="home">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-primary">
            Super Mario 64 Scavenger Hunt Planner
          </h1>
          <h2 class="subtitle">
            Plan your route
          </h2>
        </div>
      </div>
    </section>
    <div class="columns">
      <div class="column">
        <b-field label="Code">
          <b-input type="textarea" v-model="encodedString"></b-input>
        </b-field>
        <div class="is-size-7">Copy and paste to share</div>
        <star-planner />
      </div>
    </div>

    <hr />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import StarPlanner from "@/components/StarPlanner";

export default {
  name: "Home",
  data() {
    return {
      viewMode: "Rules"
    };
  },
  computed: {
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
  },
  components: { StarPlanner },
  created() {
    this.decodeString(this.encodedString);
  }
};
</script>
