<template>
  <div class="container mt-4">
    <b-row class="justify-content-center">
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card class="transparent-card p-4">
          <h1 class="title text-center">My Family Recipes</h1>

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
              lg="4"
            >
              <RecipePreview :recipe="recipe" />
            </b-col>
          </b-row>
        </b-card>
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
