<template>
  <b-container fluid class="my-4">
    <b-card class="custom-card p-4">
      <h3 class="mb-4">{{ title }}</h3>

      <div class="recipe-list" :class="[displayMode, { blur: blur }]">
        <RecipePreview
          v-for="r in displayedRecipes"
          :key="r.id"
          :recipe="r"
        />
      </div>
    </b-card>
  </b-container>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: { RecipePreview },
  props: {
    title: { type: String, required: true },
    recipes: { type: Array, default: () => [] },
    blur: { type: Boolean, default: false }, 
    displayMode: { type: String, default: "grid" } 

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

.recipe-list {
  display: grid;
  gap: 1.5rem;
}


.recipe-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.recipe-list.list {
  display: flex;
  flex-direction: column;
}

.blur {
  filter: blur(3px);
  pointer-events: none;
  user-select: none;
  opacity: 0.8;
}

</style>
