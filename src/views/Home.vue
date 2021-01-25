<template>
  <div class="home">
    <p>
      Welcome to the Super Mario 64 Scavenger Hunt. This tool can be used to
      create semi-randomized routes for running Super Mario 64.
    </p>

    <p>
      Star list and notes taken without permission from
      <a
        href="https://www.mariomayhem.com/consoles/walkthroughs/mario_64_120_stars_guide.php"
        target="_blank"
        >Mario Mayhem</a
      >.
    </p>
    <h3 class="title">Rules</h3>
    <randomizer-controls />
    <hr />
    <!-- rules -->
    <b-collapse :open="false" aria-id="detailControls" animation="slide">
      <template #trigger="props">
        <a aria-controls="detailControls">
          <b-icon :icon="!props.open ? 'menu-down' : 'menu-up'"></b-icon>
          {{ !props.open ? "Show details" : "Hide details" }}
        </a>
      </template>
      <h3 class="title">All Rules</h3>
      <rule-list />
      <!-- stars -->
      <h3 class="title">Stars</h3>
      <star-list />
    </b-collapse>
  </div>
</template>

<script>
import StarList from "@/components/Stars";
import RuleList from "@/components/Rules";
import RandomizerControls from "@/components/Randomizer";

export default {
  name: "Home",
  computed: {
    // ...mapState("courses", ["stars"]),
    // ...mapState("rules", ["rules"])
  },
  components: { StarList, RuleList, RandomizerControls }
};
</script>
