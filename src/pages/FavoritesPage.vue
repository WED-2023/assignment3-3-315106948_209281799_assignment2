<template>
  <div class="container mt-4">
    <b-card class="transparent-card p-4">
    <b-row class="justify-content-center">
      <b-col cols="12" md="10" >
          <h1 class="title text-center">My Favorite Recipes</h1>

          <div v-if="favorites.length === 0" class="text-center mt-4">
            <p>You have no favorite recipes yet.</p>
          </div>
          <b-row v-else class="g-4">
            <b-col
              v-for="recipe in favorites"
              :key="recipe.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
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
  name: "FavoritesPage",
  components: { RecipePreview },
  data() {
    return {
      favorites: []
    };
  },
  async created() {
    try {
      const response = await window.axios.get('/user/favorites');
      this.favorites = response.data || [];
    } catch (err) {
      console.error('Failed to load favorite recipes:', err);
    }
  }
};
</script>

<style scoped>
.favorites-page h1 {
  margin-bottom: 1rem;
}
</style>
