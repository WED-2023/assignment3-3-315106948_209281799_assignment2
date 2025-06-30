<template>
  <div class="container mt-4">
    <b-row class="justify-content-center">
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card class="transparent-card p-4">
          <h1 class="title text-center mb-4">My Meal Plan</h1>

          <b-list-group>
            <b-list-group-item
              v-for="(item, idx) in plan"
              :key="item.recipe.id"
              class="d-flex justify-content-between align-items-center flex-wrap"
            >
              <!-- Left: reorder + title -->
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
                <!-- <router-link
                  :to="{ name: 'recipe', params: { recipeId: item.recipe.id } }"
                  class="ms-3"
                >
                  {{ idx + 1 }}. {{ item.recipe.title }}
                </router-link> -->
                <div class="ms-3">
                  <router-link
                    :to="{ name: 'recipe', params: { recipeId: item.recipe.id } }"
                    class="d-block"
                  >
                    {{ idx + 1 }}. {{ item.recipe.title }}
                  </router-link>
                  <b-progress
                    :value="item.progressPercent"
                    max="100"
                    height="0.6rem"
                    variant="success"
                    class="mt-1"
                  ></b-progress>
                </div>
              </div>

              <!-- Right: progress, prepare, remove -->
              <div class="d-flex align-items-center mt-2 mt-md-0">
                <b-progress
                  :value="item.progressPercent"
                  max="100"
                  height="1rem"
                  class="me-3 flex-grow-1"
                />

                <b-button
                  size="sm"
                  variant="outline-primary"
                  class="me-2"
                  @click="goToPreparation(item.recipe.id)"
                >
                  Prepare
                </b-button>

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

          <!-- Bottom area: clear button or empty message -->
          <div class="mt-4 text-center">
            <b-button
              v-if="plan.length > 0"
              variant="danger"
              size="sm"
              @click="clearPlan"
            >
              Clear Meal Plan
            </b-button>
            <p v-else class="no-data">
              No recipes in your upcoming meal plan.
            </p>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
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
          const doneCount = prog.steps.filter(s => s.isDone).length;
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
    },
    goToPreparation(recipeId) {
      this.$router.push({ name: "prepare", params: { recipeId } });
    }
  }
};
</script>

<style scoped>

/* b-list-group-item {
  padding: 1rem;
} */
b-list-group-item {
  padding: 1rem;
  align-items: flex-start;
}
b-progress {
  min-width: 120px;
}

.no-data {
  font-style: italic;
  color: #888;
  margin: 0;
}
</style>
