<template>
  <div class="card h-100">
    <!-- Clickable image wraps router-link -->
    <router-link :to="{ name: 'recipe', params: { recipeId: recipe.id } }">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        class="card-img-top recipe-image clickable"
        alt="Recipe image"
      />
    </router-link>

    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>

      <!-- Dietary badges -->
      <div class="mb-2">
        <b-badge variant="success" v-if="recipe.vegan" pill>Vegan</b-badge>
        <b-badge variant="info" v-else-if="recipe.vegetarian" pill>Vegetarian</b-badge>
        <b-badge variant="warning" v-if="recipe.glutenFree" pill>Gluten Free</b-badge>
      </div>

      <!-- Status indicators -->
      <div class="status-indicators d-flex justify-content-center align-items-center gap-2">
        <!-- Only for logged-in users -->
        <b-badge variant="secondary" v-if="store.username && recipe.watched" pill>
          Viewed
        </b-badge>

        <!-- Favorite button (still only for logged-in users) -->
        <b-badge
          v-if="store.username"
          :variant="localFavorite ? 'danger' : 'light'"
          pill
          class="favorite-badge"
          @click="addToFavorites"
        >
          {{ localFavorite ? 'Favorited' : 'Add to Favorites' }}
        </b-badge>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      // Use the server‐provided `favorite` field as initial state
      localFavorite: this.recipe.favorite || false
    };
  },
  computed: {
    // Access global store via this.$root
    store() {
      return this.$root.store;
    }
  },
  methods: {
    async addToFavorites() {
      if (!this.localFavorite) {
        try {
          await window.axios.post('/user/favorites', { recipeId: this.recipe.id });
          this.localFavorite = true;
        } catch (err) {
          console.error('Failed to add favorite:', err);
        }
      }
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(6px);
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.recipe-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}
.clickable {
  cursor: pointer;
  transition: opacity 0.2s;
}
.clickable:hover {
  opacity: 0.8;
}
.card-title {
  font-family: 'Lucida Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}
.card-text {
  font-family: 'Lucida Sans', sans-serif;
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.4rem;
}
.status-indicators {
  margin-top: 0.5rem;
}
.favorite-badge {
  cursor: pointer;
}
</style>
