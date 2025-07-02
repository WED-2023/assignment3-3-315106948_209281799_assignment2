<!-- src/pages/MyRecipesPage.vue -->
<template>
  <div class="container mt-4">
    <b-card class="transparent-card p-4">
    <b-row class="justify-content-center">
      <b-col cols="12" md="10" >
          <h1 class="title text-center">My Recipes</h1>

<!-- <template>
  <div class="my-recipes-page container mt-4">
    <h1>My Recipes</h1> -->

          <div v-if="recipes.length === 0" class="text-center mt-4">
            <p>You haven't created any recipes yet.</p>
          </div>

          <b-row v-else class="g-4">
            <b-col
              v-for="recipe in recipes"
              :key="recipe.id"
              cols="12"
              sm="6"
              md="4"
              lg="4"
            >
              <RecipePreview :recipe="recipe" />
            </b-col>
          </b-row>
      </b-col>
    </b-row>
    </b-card>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";

export default {
  name: "MyRecipesPage",
  components: { RecipePreview },
  data() {
    return {
      recipes: []
    };
  },
  async created() {
    try {
      const response = await window.axios.get('/user/myRecipes');
      this.recipes = response.data || [];
    } catch (err) {
      console.error('Failed to load my recipes:', err);
    }
  }
};
</script>

