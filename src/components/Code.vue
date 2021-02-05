<template>
  <div class="columns">
    <div class="column">
      <b-field message="Copy to share with others!">
        <b-input
          placeholder=""
          disabled
          type=""
          icon="content-copy"
          v-model="encodedString"
        >
        </b-input>
        <p class="control">
          <b-button
            type="is-primary"
            label="Copy"
            @click="copy(encodedString)"
          />
        </p>
      </b-field>
    </div>
    <div class="column has-text-centered">
      <span>- or -</span>
    </div>
    <div class="column">
      <b-field message="Enter a code to generate data!">
        <b-input
          placeholder=""
          type=""
          icon="content-paste"
          v-model="newString"
        >
        </b-input>
        <p class="control">
          <b-button
            type="is-primary"
            label="Save"
            @click="decodeString(newString)"
          />
        </p>
      </b-field>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Code",
  data() {
    return {
      canCopy: false,
      newString: ""
    };
  },
  computed: {
    ...mapState("rules", ["encodedString"])
  },
  methods: {
    ...mapActions("rules", ["decodeString"]),
    async copy(s) {
      await navigator.clipboard.writeText(s);
      this.$buefy.toast.open({
        message: "Copied to clipboard!",
        type: "is-success"
      });
    }
  },
  created() {
    this.canCopy = !!navigator.clipboard;
  }
};
</script>
