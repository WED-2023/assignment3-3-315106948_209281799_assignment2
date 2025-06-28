<!-- src/components/NavBar.vue -->
<template>
  <b-navbar class="navbar sticky-top" toggleable="lg" type="dark" variant="primary">
    <b-container>
      <b-navbar-brand to="/">Vue Recipes</b-navbar-brand>
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
            <b-nav-item disabled>Hello Guest</b-nav-item>
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
            <b-nav-item :to="{ name: 'createRecipe' }">
              Create New Recipe
            </b-nav-item>

            <!-- Meal Plan indicator -->
            <b-nav-item :to="{ name: 'mealPlan' }">
              Meal Plan
              <b-badge pill variant="light">{{ mealPlanCount }}</b-badge>
            </b-nav-item>

            <!-- Logout -->
            <b-button
              variant="outline-light"
              size="sm"
              class="ms-2"
              @click="$emit('logout')"
            >
              Logout
            </b-button>
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
  },
  data() {
    return {
      mealPlanCount: 0
    };
  },
  async mounted() {
    // fetch count when component mounts and user is logged in
    if (this.store.username) {
      await this.fetchMealPlanCount();
    }
  },
  watch: {
    // re-fetch when login/logout happens
    'store.username'(newVal) {
      if (newVal) {
        this.fetchMealPlanCount();
      } else {
        this.mealPlanCount = 0;
      }
    }
  },
  methods: {
    async fetchMealPlanCount() {
      try {
        const response = await window.axios.get(
          `${this.store.server_domain}/recipes/meal-plan`
        );
        this.mealPlanCount = Array.isArray(response.data)
          ? response.data.length
          : 0;
      } catch (err) {
        console.error("Failed to fetch meal plan count:", err);
        this.mealPlanCount = 0;
      }
    }
  }
};
</script>

<style scoped>
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
