<template>
  <div class="home">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title has-text-primary">
            Super Mario 64 Scavenger Hunt Randomizer
          </h1>
          <h2 class="subtitle">
            Welcome to the Super Mario 64 Scavenger Hunt.
          </h2>
          <p>
            This tool can be used to create semi-randomized routes for running
            Super Mario 64. I created this with two uses in mind:
          </p>
          <ol class="pl-6">
            <li>
              To randomize stars "required" before beating a ~70 star run.
            </li>
            <li>
              To make "scavenger hunts" where completion is completing all of
              the stars defined by the generated rule set.
            </li>
          </ol>

          <p class="mt-2">
            I am open to any feedback on rules, especially new rules to add, or
            input on the difficulty rating. Difficulty is meant to be a balance
            between skill and time required.
          </p>
          <p class="mt-2">Some notes:</p>
          <ul class="pl-6">
            <li>
              Currently the randomizer does not check for any collisions in
              rules. For example, it could have conflicting rules like "No coin
              stars" and "All coin stars".
            </li>
            <li>
              Any pre-requisite stars are assumed to be known to the player.
            </li>
            <li>
              You can optionally add individual rules and stars to your liking.
            </li>
          </ul>

          <p class="mt-2">
            Star list and notes taken without permission from
            <a
              href="https://www.mariomayhem.com/consoles/walkthroughs/mario_64_120_stars_guide.php"
              target="_blank"
              >Mario Mayhem</a
            >.
          </p>
        </div>
      </div>
    </section>

    <!-- <h3 class="title has-text-primary">Randomizer</h3> -->
    <div class="columns">
      <div class="column is-two-fifths">
        <randomizer-controls />
      </div>
      <div class="column">
        <selected-rules />
        <selected-stars />
      </div>
    </div>

    <hr />
    <!-- unique tags -->
    <div class="subtitle">All tags</div>
    <span v-for="(tag, i) in uniqueTags" :key="'unique' + i" class="tag mr-2">
      {{ tag }}
    </span>
    <hr />
    <div class="subtitle">Tags w/ Rules</div>
    <span v-for="(tag, i) in tagsWithRules" :key="'rules' + i" class="tag mr-2">
      {{ tag }}
    </span>
    <hr />
    <div class="subtitle">Tags w/out Rules</div>
    <span
      v-for="(tag, i) in tagsWithoutRules"
      :key="'noRules' + i"
      class="tag mr-2"
    >
      {{ tag }}
    </span>

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
import SelectedStars from "@/components/SelectedStars";
import { mapState } from "vuex";
import * as _ from "lodash";

export default {
  name: "Home",
  computed: {
    ...mapState("stars", ["stars"]),
    ...mapState("rules", ["rules"]),
    uniqueTags() {
      var ruleTags = _.map(this.rules, rule => {
        return rule.tags ? rule.tags.split(",") : [];
      });
      var starTags = _.map(this.stars, star => {
        return star.tags ? star.tags.split(",") : [];
      });
      return _.uniq(_.concat(_.flatten(ruleTags), _.flatten(starTags)));
    },
    tagsWithRules() {
      var ruleTags = _.map(this.rules, rule => {
        return rule.tags ? rule.tags.split(",") : [];
      });
      return _.uniq(_.flatten(ruleTags));
    },
    tagsWithoutRules() {
      var ruleTags = _.map(this.rules, rule => {
        return rule.tags ? rule.tags.split(",") : [];
      });
      var starTags = _.map(this.stars, star => {
        return star.tags ? star.tags.split(",") : [];
      });
      return _.uniq(_.difference(_.flatten(starTags), _.flatten(ruleTags)));
    }
  },
  components: {
    StarList,
    RuleList,
    RandomizerControls,
    SelectedRules,
    SelectedStars
  }
};
</script>
