<!-- src/pages/RecipeViewPage.vue -->
<template>
  <b-container fluid class="mt-4" v-if="recipe">
    <b-row>
      <b-col>
        <div class="text-center mb-4">
          <h1>{{ recipe.title }}</h1>
          <img :src="recipe.image" class="img-fluid my-3" alt="Recipe image" />
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

        <div class="mb-3">
          <strong>Ready in:</strong> {{ recipe.readyInMinutes }} minutes<br/>
          <strong>Dietary:</strong>
          <span v-if="recipe.vegan">🌱 Vegan</span>
          <span v-else-if="recipe.vegetarian">🥕 Vegetarian</span>
          <span v-if="recipe.glutenFree">🚫 Gluten-Free</span>
        </div>

        <b-row>
          <b-col md="6">
            <h4>Ingredients</h4>
            <ul>
              <li v-for="ing in recipe.ingredients" :key="ing.id">
                {{ ing.original || `${ing.amount} ${ing.unit} ${ing.name}` }}
              </li>
            </ul>
          </b-col>
          <b-col md="6">
            <h4>Instructions</h4>
            <p v-html="recipe.instructions"></p>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
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
