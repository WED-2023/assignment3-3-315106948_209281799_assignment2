<template>
  <b-navbar class="navbar sticky-top" toggleable="lg" type="dark" variant="primary">
    <b-container>
      <b-navbar-brand to="/">Vue Recipes</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'main' }" >Home</b-nav-item>
          <b-nav-item :to="{ name: 'search' }">Search</b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ms-auto">
          <template v-if="!store.username">
            <b-nav-item disabled>Guest</b-nav-item>
            <b-nav-item :to="{ name: 'register' }">Register</b-nav-item>
            <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
          </template>
          <template v-else>
            <b-nav-item disabled>{{ store.username }}</b-nav-item>
            <b-button variant="outline-light" size="sm" @click="$emit('logout')">Logout</b-button>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    store: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
/* Target the actual HTML tags inside BootstrapVue components */

nav.navbar {
  background-color: #ffffff !important;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  font-family: 'Segoe UI Variable Small Light', sans-serif;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.navbar-nav .nav-link {
  margin-left: 15px;
  font-weight: 500;
  color: #2c3e50 !important;
}


</style>

