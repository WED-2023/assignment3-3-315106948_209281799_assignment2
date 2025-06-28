<!-- src/pages/PreparationPage.vue -->
<template>
  <div>
    <!-- Loading spinner until recipe is populated -->
    <b-container
      v-if="!recipe"
      fluid
      class="d-flex justify-content-center align-items-center"
      style="height: 50vh"
    >
      <b-spinner label="Loading recipe…" />
    </b-container>

    <!-- Once we have recipe data, render it -->
    <b-container v-else fluid class="mt-4">
      <b-row>
        <b-col>
          <h1>{{ recipe.title }}</h1>

          <div class="mb-3 d-flex align-items-center">
            <strong>Servings:</strong>
            <span class="ms-2">{{ servings }}</span>
            <b-button
              size="sm"
              variant="outline-secondary"
              class="ms-3"
              @click="multiplyServings"
            >
              ×2
            </b-button>
          </div>

          <h4>Ingredients</h4>
          <ul>
            <li v-for="ing in adjustedIngredients" :key="ing.id">
              {{ ing.amount }} {{ ing.unit }} {{ ing.name }}
            </li>
          </ul>

          <h4 class="mt-4">Steps</h4>
          <b-list-group>
            <b-list-group-item
              v-for="step in steps"
              :key="step.number"
            >
              <b-form-checkbox
                v-model="step.isDone"
                @change="updateStep(step)"
              >
                {{ step.number }}. {{ step.step }}
              </b-form-checkbox>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "PreparationPage",
  props: ["recipeId"],
  data() {
    return {
      recipe: null,      // will receive data.details
      steps: [],         // will receive data.steps
      ingredients: [],   // recipe.ingredients
      servings: null     // recipe.servings (or multiplier)
    };
  },
  async created() {
    try {
      // call your BE GET /recipes/:id/progress
      const { data } = await window.axios.get(
        `${this.$root.store.server_domain}/recipes/${this.recipeId}/progress`
      );
      // BE returns { steps, details, servings? } or { steps, details }
      this.steps       = data.steps || [];
      this.recipe      = data.details;
      // fallback if BE didn’t send servings separately
      this.servings    = data.servings ?? this.recipe.servings;
      this.ingredients = this.recipe.ingredients || this.recipe.extendedIngredients || [];
    } catch (err) {
      console.error("Failed to load preparation data:", err);
      // optionally redirect or show an error
      this.$router.replace({ name: "notFound" });
    }
  },
  computed: {
    adjustedIngredients() {
      if (!this.recipe || !this.recipe.servings) return [];
      const factor = this.servings / this.recipe.servings;
      return this.ingredients.map(ing => ({
        ...ing,
        amount: (ing.amount * factor).toFixed(2)
      }));
    }
  },
  methods: {
    async updateStep(step) {
      try {
        await window.axios.post(
          `${this.$root.store.server_domain}/recipes/${this.recipeId}/progress`,
          { stepIndex: step.number, isDone: step.isDone }
        );
      } catch (err) {
        console.error("Could not save step:", err);
      }
    },
    async multiplyServings() {
      try {
        const newServings = this.servings * 2;
        await window.axios.post(
          `${this.$root.store.server_domain}/recipes/${this.recipeId}/progress`,
          { multiplier: newServings / this.recipe.servings }
        );
        this.servings = newServings;
      } catch (err) {
        console.error("Could not update servings:", err);
      }
    }
  }
};
</script>

<style scoped>
ul {
  margin-left: 1.5rem;
}
</style>
