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
    <h3 class="title">Randomizer</h3>
    <div class="columns">
      <div class="column is-two-fifths">
        <randomizer-controls />
      </div>
      <div class="column">
        <selected-rules />
      </div>
    </div>

    <hr />
    <!-- rules -->
    <b-collapse :open="false" aria-id="detailControls" animation="slide">
      <template #trigger="props">
        <a aria-controls="detailStars">
          <span class="title has-text-primary">All Rules</span>
          <b-icon
            size="is-large"
            :icon="!props.open ? 'menu-down' : 'menu-up'"
          ></b-icon>
        </a>
      </template>
      <rule-list />
    </b-collapse>

    <hr />
    <!-- stars -->
    <b-collapse :open="false" aria-id="detailStars" animation="slide">
      <template #trigger="props">
        <a aria-controls="detailStars">
          <span class="title has-text-primary">Stars</span>
          <b-icon
            size="is-large"
            :icon="!props.open ? 'menu-down' : 'menu-up'"
          ></b-icon>
        </a>
      </template>
      <star-list />
    </b-collapse>

    <hr />
  </div>
</template>

<script>
import StarList from "@/components/Stars";
import RuleList from "@/components/Rules";
import RandomizerControls from "@/components/Randomizer";
import SelectedRules from "@/components/SelectedRules";

export default {
  name: "Home",
  computed: {
    // ...mapState("courses", ["stars"]),
    // ...mapState("rules", ["rules"])
  },
  components: { StarList, RuleList, RandomizerControls, SelectedRules }
};
</script>
