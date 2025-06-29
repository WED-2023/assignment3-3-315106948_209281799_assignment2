<template>
  <div class="container mt-4">
    <!-- Loading Spinner -->
    <b-row v-if="!recipe" class="justify-content-center align-items-center" style="height: 50vh">
      <b-spinner label="Loading recipe…" />
    </b-row>

    <!-- Loaded Content -->
    <b-row v-else class="justify-content-center">
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card class="transparent-card p-4">
          <h1 class="title text-center mb-4">{{ recipe.title }}</h1>

          <!-- Servings Display -->
          <div class="mb-4 d-flex align-items-center justify-content-center">
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

          <!-- Ingredients -->
          <h4 class="subtitle">Ingredients</h4>
          <ul class="custom-list">
            <li v-for="ing in adjustedIngredients" :key="ing.id">
              {{ ing.amount }} {{ ing.unit }} {{ ing.name }}
            </li>
          </ul>

          <!-- Steps -->
          <h4 class="subtitle mt-4">Steps</h4>
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
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "PreparationPage",
  props: ["recipeId"],
  data() {
    return {
      recipe: null,
      steps: [],
      ingredients: [],
      servings: null
    };
  },
  async created() {
    try {
      const { data } = await window.axios.get(
        `${this.$root.store.server_domain}/recipes/${this.recipeId}/progress`
      );
      this.steps       = data.steps || [];
      this.recipe      = data.details;
      this.servings    = data.servings ?? this.recipe.servings;
      this.ingredients = this.recipe.ingredients || this.recipe.extendedIngredients || [];
    } catch (err) {
      console.error("Failed to load preparation data:", err);
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
.title {
  font-size: 2.5rem;
  font-weight: 600;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.custom-list {
  margin-left: 1.5rem;
}
</style>
