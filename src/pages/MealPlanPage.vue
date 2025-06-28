<!-- src/pages/MealPlanPage.vue -->
<template>
  <b-container fluid class="mt-4">
    <b-row>
      <b-col>
        <h1>My Meal Plan</h1>
        <b-button variant="danger" size="sm" @click="clearPlan" class="mb-3">
          Clear Meal Plan
        </b-button>

        <b-list-group>
          <b-list-group-item
            v-for="(item, idx) in plan"
            :key="item.recipe.id"
            class="d-flex justify-content-between align-items-center flex-wrap"
          >
            <div class="d-flex align-items-center">
              <b-button
                size="sm"
                variant="outline-secondary"
                @click="moveUp(idx)"
                :disabled="idx === 0"
              >↑</b-button>
              <b-button
                size="sm"
                variant="outline-secondary"
                class="ms-1"
                @click="moveDown(idx)"
                :disabled="idx === plan.length - 1"
              >↓</b-button>
              <router-link
                :to="{ name: 'recipe', params: { recipeId: item.recipe.id } }"
                class="ms-3"
              >
                {{ idx + 1 }}. {{ item.recipe.title }}
              </router-link>
            </div>
            <div class="d-flex align-items-center mt-2 mt-md-0">
              <b-progress
                :value="item.progressPercent"
                max="100"
                height="1rem"
                class="me-3 flex-grow-1"
              />
              <b-button
                size="sm"
                variant="outline-danger"
                @click="remove(item.recipe.id)"
              >
                Remove
              </b-button>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "MealPlanPage",
  data() {
    return {
      plan: []  // Array of { recipe: previewObj, progressPercent: number }
    };
  },
  async created() {
    try {
      // 1) fetch the meal plan previews
      const { data: previews } = await window.axios.get(
        `${this.$root.store.server_domain}/recipes/meal-plan`
      );
      // 2) for each preview, fetch progress to compute percent done
      this.plan = await Promise.all(
        previews.map(async preview => {
          const { data: prog } = await window.axios.get(
            `${this.$root.store.server_domain}/recipes/${preview.id}/progress`
          );
          const doneCount = prog.steps.filter(s => s.completed).length;
          const totalCount = prog.steps.length || 1;
          return {
            recipe: preview,
            progressPercent: Math.round((doneCount / totalCount) * 100)
          };
        })
      );
    } catch (err) {
      console.error("Failed to load meal plan:", err);
    }
  },
  methods: {
    swap(i, j) {
      [this.plan[i], this.plan[j]] = [this.plan[j], this.plan[i]];
    },
    async moveUp(idx) {
      if (idx > 0) {
        this.swap(idx, idx - 1);
        await this.postReorder();
      }
    },
    async moveDown(idx) {
      if (idx < this.plan.length - 1) {
        this.swap(idx, idx + 1);
        await this.postReorder();
      }
    },
    async postReorder() {
      await window.axios.post(
        `${this.$root.store.server_domain}/recipes/meal-plan/reorder`,
        {
          newOrder: this.plan.map((item, i) => ({
            recipeId: item.recipe.id,
            order: i + 1
          }))
        }
      );
    },
    async remove(recipeId) {
      await window.axios.post(
        `${this.$root.store.server_domain}/recipes/meal-plan/remove`,
        { recipeId }
      );
      this.plan = this.plan.filter(x => x.recipe.id !== recipeId);
    },
    async clearPlan() {
      await window.axios.post(
        `${this.$root.store.server_domain}/recipes/meal-plan/clear`
      );
      this.plan = [];
    }
  }
};
</script>

<style scoped>
b-list-group-item {
  padding: 1rem;
}
</style>
