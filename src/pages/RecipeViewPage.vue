<!-- src/pages/RecipeViewPage.vue -->
<template>
  <div class="container mt-4">
    <b-row class="justify-content-center">
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card class="transparent-card p-4" v-if="recipe">

          <!-- Title and image -->
          <div class="text-center mb-4">
            <h1 class="title">{{ recipe.title }}</h1>
            <img :src="recipe.image" class="img-fluid my-3 rounded" alt="Recipe image" />
          </div>

        <!-- Prepare & Meal-Plan Buttons -->
        <div class="mb-4 text-center">
          <b-button variant="primary" class="me-2" @click="goToPreparation">
            Prepare Recipe
          </b-button>
          <b-button variant="outline-primary" @click="addToMealPlan">
            Add to Upcoming Meal
          </b-button>
        </div>

          <!-- Basic Info -->
          <div class="mb-3 text-center">
            <p><strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes</p>
            <p>
              <strong>Dietary:</strong>
              <span v-if="recipe.vegan">🌱 Vegan</span>
              <span v-else-if="recipe.vegetarian">🥕 Vegetarian</span>
              <span v-if="recipe.glutenFree">🚫 Gluten-Free</span>
            </p>
          </div>

          <!-- Ingredients and Instructions -->
          <b-row>
            <!-- Ingredients -->
            <h3 class="subtitle">Ingredients</h3>
            <div v-if="recipe.ingredients && recipe.ingredients.length">
              <ul class="custom-list">
                <li v-for="ing in recipe.ingredients" :key="ing.id || ing.name">
                  {{ ing.original || `${ing.amount} ${ing.unit} ${ing.name}` }}
                </li>
              </ul>
            </div>
            <p v-else class="fallback-text">No ingredients provided.</p>

            <!-- Instructions -->
            <h3 class="subtitle">Instructions</h3>
            <p v-html="recipe.instructions || 'No instructions provided.'" class="fallback-text" />
          </b-row>
        </b-card>
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

function goToPreparation() {
  router.push({ name: "prepare", params: { recipeId } });
}

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

</style>
