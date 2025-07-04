<template>
  <div class="container mt-4">
    <b-card class="transparent-card p-4">
    <b-row class="justify-content-center">
      <b-col cols="12" md="10" >

          <!-- Loading recipe -->
          <div v-if="!recipe" class="text-center py-5">
            <b-spinner label="Loading recipe…" />
            <p class="text-muted mt-3">Loading recipe details...</p>
          </div>

          <div v-else>
            <!-- title -->
            <h1 class="title text-center mb-4">{{ recipe.title }}</h1>

            <!-- Servings -->
            <div class="mb-4 d-flex align-items-center justify-content-center">
              <strong>Servings:</strong>
              <span class="ms-2">{{ servings }}</span>
              <b-button
                size="sm"
                variant="outline-secondary"
                class="ms-3"
                @click="multiplyServings"
              >
                x2
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
            <h4 class="subtitle mt-4">Preparation Steps</h4>
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

            <!-- Progress Bar -->
            <div class="mt-4">
              <h4 class="subtitle">Progress</h4>
              <b-progress
                :value="progressPercent"
                max="100"
                show-progress
                animated
                height="2rem"
                variant="success"
              ></b-progress>
            </div>

            <!-- Save Progress Button -->
            <div class="mt-3 text-center">
              <b-button variant="primary" @click="saveProgress">
                Save Progress
              </b-button>
            </div>
          </div>

      </b-col>
    </b-row>
    </b-card>
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
    },
    progressPercent() {
      if (!this.steps.length) return 0;
      const doneCount = this.steps.filter(s => s.isDone).length;
      return Math.round((doneCount / this.steps.length) * 100);
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
    },
    async saveProgress() {
      try {
        await window.axios.post(
          `${this.$root.store.server_domain}/recipes/${this.recipeId}/progress`,
          {
            steps: this.steps.map(s => ({ number: s.number, isDone: s.isDone })),
            multiplier: this.servings / this.recipe.servings
          }
        );
        console.log("Progress saved successfully!");
        this.$router.push({ name: "mealPlan" });
      } catch (err) {
        console.error("Could not save progress:", err);      }
    }
  }
};
</script>

<style scoped>
.subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.custom-list,
.list-group-item {
  margin-left: 1.5rem;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 1rem;
}

/* tighten up the progress section */
.mt-4 h4.subtitle {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>
