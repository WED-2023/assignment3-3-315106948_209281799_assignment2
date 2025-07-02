<!-- src/pages/RecipeViewPage.vue -->
<template>
  <div class="container mt-4">
    <b-row class="justify-content-center">
      <b-col cols="12" sm="10" md="10" lg="8">
        <div class="fixed-card-wrapper">
          <b-card class="transparent-card p-4" v-if="recipe">
            <div class="text-center mb-4">
              <h1 class="title">{{ recipe.title }}</h1>
              <img :src="recipe.image" class="img-fluid my-3 rounded fixed-recipe-image" alt="Recipe image" />
            </div>

            <div class="mb-4 text-center">
              <b-button variant="outline-primary" @click="addToMealPlan">
                Add to Upcoming Meal
              </b-button>
            </div>

            <div class="mb-3 text-center">
              <p><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</p>
              <p>
                <strong>Dietary:</strong>
                <span v-if="recipe.vegan">🌱 Vegan</span>
                <span v-else-if="recipe.vegetarian">🥕 Vegetarian</span>
                <span v-if="recipe.glutenFree">🚫 Gluten-Free</span>
              </p>
            </div>

            <div class="mb-4">
              <h3 class="subtitle">Ingredients</h3>
              <ul v-if="recipe.ingredients && recipe.ingredients.length" class="custom-list">
                <li v-for="ing in recipe.ingredients" :key="ing.id || ing.name">
                  {{ ing.original || `${ing.amount} ${ing.unit} ${ing.name}` }}
                </li>
              </ul>
              <p v-else class="fallback-text">No ingredients provided.</p>
            </div>

            <div>
              <h3 class="subtitle">Instructions</h3>
              <p v-html="recipe.instructions || 'No instructions provided.'" class="fallback-text" />
            </div>
          </b-card>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const recipe = ref(null);
const recipeId = route.params.recipeId;

onMounted(async () => {
  try {
    const { data } = await window.axios.get(`/recipes/${recipeId}`);
    recipe.value = data;
  } catch (err) {
    console.error("Failed to load recipe:", err);
    toast.error("Could not load recipe.");
    router.replace({ name: "notFound" });
  }
});

async function addToMealPlan() {
  try {
    await window.axios.post(`/recipes/meal-plan`, { recipeId });
    toast.success("Recipe added to your meal plan!");
  } catch (err) {
    console.error("Failed to add to meal plan:", err);
    toast.error("Could not add recipe to meal plan.");
  }
}
</script>

<style scoped>
.img-fluid {
  max-width: 100%;
  height: auto;
}
.fixed-recipe-image {
  width: 100%;
  height: auto;
  max-height: 250px;
  object-fit: cover;
}

.transparent-card {
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
}


</style>
