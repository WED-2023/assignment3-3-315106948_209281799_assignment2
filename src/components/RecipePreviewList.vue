<template>
  <div class="container">
    <h3>{{ title }}</h3>

    <div class="row">
      <div class="col" v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: { RecipePreview },
  props: {
    title: { type: String, required: true },
    recipes: { type: Array, default: () => [] },
  },
  data() {
    return {
      internalRecipes: [],
    };
  },
  mounted() {
    // If recipes prop is empty — load random
    if (!this.recipes || this.recipes.length === 0) {
      this.loadRandomRecipes();
    }
  },
  methods: {
    async loadRandomRecipes() {
      try {
        const response = await window.axios.get("/recipes/random");
        this.internalRecipes = response.data || [];
        console.log("Loaded random recipes:", this.internalRecipes);
      } catch (err) {
        console.error("Failed to load random recipes:", err);
      }
    },
  },
  computed: {
    // Use passed recipes if present — else use internal
    displayedRecipes() {
      return this.recipes && this.recipes.length > 0
        ? this.recipes
        : this.internalRecipes;
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 400px;
}
</style>
