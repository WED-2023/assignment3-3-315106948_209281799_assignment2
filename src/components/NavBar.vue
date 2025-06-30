<!-- src/components/NavBar.vue -->
<template>
  <b-navbar class="navbar sticky-top" toggleable="lg" type="dark" variant="primary">
    <b-container>
      <b-navbar-brand to="/">Y&D Recipes</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <!-- Always-visible links -->
        <b-navbar-nav>
          <b-nav-item :to="{ name: 'main' }">Recipes</b-nav-item>
          <b-nav-item :to="{ name: 'search' }">Search</b-nav-item>
          <b-nav-item :to="{ name: 'about' }">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right-side: Guest vs. Logged-in -->
        <b-navbar-nav class="ms-auto">
          <!-- Guest -->
          <template v-if="!store.username">
            <b-nav-item disabled style="color: grey" >Hello Guest</b-nav-item>
            <b-nav-item :to="{ name: 'login' }">Login</b-nav-item>
            <b-nav-item :to="{ name: 'register' }">Register</b-nav-item>
          </template>

          <!-- Logged-in -->
          <template v-else>
            <!-- Greeting -->
            <b-nav-item disabled>Hello, {{ store.username }}</b-nav-item>

            <!-- Personal Area dropdown -->
            <b-nav-item-dropdown text="Personal Area" right>
              <b-dropdown-item :to="{ name: 'favorites' }">
                My Favorite Recipes
              </b-dropdown-item>
              <b-dropdown-item :to="{ name: 'myRecipes' }">
                My Recipes
              </b-dropdown-item>
              <b-dropdown-item :to="{ name: 'familyRecipes' }">
                My Family Recipes
              </b-dropdown-item>
            </b-nav-item-dropdown>

            <!-- Create New Recipe -->
            <b-nav-item @click="$emit('openCreateRecipe')" variant="success">
              Create New Recipe
            </b-nav-item>

            <!-- Meal Plan indicator -->
            <b-nav-item :to="{ name: 'mealPlan' }">
              Meal Plan
            </b-nav-item>

            <!-- Logout -->
            <b-nav-item @click.prevent="$emit('logout')" href="#" class="ms-2">
              Logout
            </b-nav-item>
          </template>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
export default {
  emits: ['openCreateRecipe'],
  name: "NavBar",
  props: {
    store: {
      type: Object,
      required: true
    }
  },
};
</script>

<style scoped>
nav.navbar {
  background-color: #8fafce93 !important;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-weight:100;
  font-size: 1.2rem;
}

.navbar-brand {
  font-size: 2rem;
  font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-weight: 800;
  letter-spacing: 1px;
}



</style>
