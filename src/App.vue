<template>
  <div id="app">
    <b-loading :is-full-page="true" v-model="isLoading"></b-loading>
    <div class="has-background-primary">
      <div class="container">
        <nav-bar />
      </div>
    </div>
    <div class="container">
      <router-view />
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/Nav";
import { mapState, mapActions } from "vuex";
export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    ...mapState("rules", ["isLoading"])
  },
  methods: {
    ...mapActions("rules", ["initState"])
  },
  components: {
    NavBar
  },
  created() {
    this.initState();
  }
};
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;
}
</style>
