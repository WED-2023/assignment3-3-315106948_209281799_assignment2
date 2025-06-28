<!-- src/pages/RecipeViewPage.vue -->
<template>
  <div class="container mt-4" v-if="recipe">
    <div class="recipe-header text-center mb-4">
      <h1>{{ recipe.title }}</h1>
      <img :src="recipe.image" class="img-fluid my-3" alt="Recipe image" />
    </div>

    <div class="mb-3">
      <strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes<br/>
      <strong>Dietary:</strong>
        <span v-if="recipe.vegan">🌱 Vegan</span>
        <span v-else-if="recipe.vegetarian">🥕 Vegetarian</span>
        <span v-if="recipe.glutenFree">🚫 Gluten-Free</span>
    </div>

    <div class="row">
      <div class="col-md-6">
        <h4>Ingredients</h4>
        <ul>
          <li v-for="ing in recipe.ingredients" :key="ing.id">
            {{ ing.original || `${ing.amount} ${ing.unit} ${ing.name}` }}
          </li>
        </ul>
      </div>
      <div class="col-md-6">
        <h4>Instructions</h4>
        <!-- instructions is a text blob -->
        <p v-html="recipe.instructions"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeViewPage",
  props: ["recipeId"],
  data() {
    return {
      recipe: null
    };
  },
  async created() {
    try {
      // Call your backend's GET /recipes/:id route
      const response = await window.axios.get(
        `${this.$root.store.server_domain}/recipes/${this.recipeId}`
      );
      this.recipe = response.data;
    } catch (err) {
      console.error("Failed to load recipe:", err);
      // Redirect to your NotFound route if anything goes wrong
      this.$router.replace({ name: "notFound" });
    }
  }
};
</script>

<style scoped>
.img-fluid {
  max-width: 100%;
  height: auto;
}
</style>
