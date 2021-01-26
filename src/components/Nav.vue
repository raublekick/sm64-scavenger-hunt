<template>
  <b-navbar class="is-primary">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <b-icon icon="mushroom" size="is-large" />
      </b-navbar-item>
    </template>
    <template #start>
      <!-- <b-navbar-item href="#">
        Home
      </b-navbar-item>
      <b-navbar-dropdown label="Info">
        <b-navbar-item href="#">
          About
        </b-navbar-item>
        <b-navbar-item href="#">
          Contact
        </b-navbar-item>
      </b-navbar-dropdown> -->
      <b-navbar-item
        tag="a"
        href="https://github.com/raublekick/sm64-scavenger-hunt"
      >
        <b-icon icon="github" />
      </b-navbar-item>
    </template>

    <template #end> </template>
  </b-navbar>
</template>
