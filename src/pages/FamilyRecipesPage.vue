<!-- src/pages/FamilyRecipesPage.vue -->
<template>
  <div class="family-recipes-page container mt-4">
    <h1>My Family Recipes</h1>

    <div v-if="familyRecipes.length === 0" class="text-center mt-4">
      <p>No family recipes shared yet.</p>
    </div>

    <b-row v-else class="g-4">
      <b-col
        v-for="recipe in familyRecipes"
        :key="recipe.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RecipePreview :recipe="recipe" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RecipePreview from "@/components/RecipePreview.vue";

export default {
  name: "FamilyRecipesPage",
  components: { RecipePreview },
  data() {
    return {
      familyRecipes: []
    };
  },
  async created() {
    try {
      const response = await window.axios.get('/user/familyRecipes');
      this.familyRecipes = response.data || [];
    } catch (err) {
      console.error('Failed to load family recipes:', err);
    }
  }
};
</script>

<style scoped>
.family-recipes-page h1 {
  margin-bottom: 1rem;
}
</style>
