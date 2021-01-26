<template>
  <div id="app">
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
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    NavBar
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
