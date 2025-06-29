<!-- src/pages/CreateRecipePage.vue -->
<template>
  <b-container fluid class="mt-5">
    <b-row class="justify-content-center">
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card class="transparent-card p-4">
          <h1 class="title text-center">Create New Recipe</h1>

          <b-form @submit.prevent="onSubmit">
            <!-- 1) Recipe Type -->
            <b-form-group label="Recipe Type">
              <b-form-radio-group
                v-model="form.type"
                :options="typeOptions"
                buttons
                button-variant="outline-primary"
                stacked
              />
            </b-form-group>

            <!-- 2) Title + Image URL -->
            <b-row>
              <b-col md="6">
                <b-form-group label="Title" label-for="title">
                  <b-form-input id="title" v-model="form.title" required />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Image URL" label-for="image">
                  <b-form-input
                    id="image"
                    type="url"
                    v-model="form.image"
                    required
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <!-- 3) Ready In Minutes + Servings -->
            <b-row>
              <b-col md="6">
                <b-form-group label="Ready In Minutes" label-for="readyInMinutes">
                  <b-form-input
                    id="readyInMinutes"
                    type="number"
                    v-model.number="form.readyInMinutes"
                    required
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Servings" label-for="servings">
                  <b-form-input
                    id="servings"
                    type="number"
                    v-model.number="form.servings"
                    required
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <!-- 4) Dietary Tags -->
            <b-form-group label="Dietary / Tags">
              <b-row>
                <b-col md="6">
                  <b-form-checkbox v-model="form.vegan">Vegan</b-form-checkbox>
                  <b-form-checkbox v-model="form.vegetarian">Vegetarian</b-form-checkbox>
                  <b-form-checkbox v-model="form.glutenFree">Gluten-Free</b-form-checkbox>
                  <b-form-checkbox v-model="form.dairyFree">Dairy-Free</b-form-checkbox>
                  <b-form-checkbox v-model="form.veryHealthy">Very Healthy</b-form-checkbox>
                </b-col>
                <b-col md="6">
                  <b-form-checkbox v-model="form.cheap">Cheap</b-form-checkbox>
                  <b-form-checkbox v-model="form.veryPopular">Very Popular</b-form-checkbox>
                  <b-form-checkbox v-model="form.sustainable">Sustainable</b-form-checkbox>
                  <b-form-checkbox v-model="form.lowFodmap">Low FODMAP</b-form-checkbox>
                </b-col>
              </b-row>
            </b-form-group>

            <!-- 5) Weight Watcher + GAPS -->
            <b-row>
              <b-col md="6">
                <b-form-group
                  label="Weight Watcher Smart Points"
                  label-for="weightWatcherSmartPoints"
                >
                  <b-form-input
                    id="weightWatcherSmartPoints"
                    type="number"
                    v-model.number="form.weightWatcherSmartPoints"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="GAPS" label-for="gaps">
                  <b-form-input id="gaps" v-model="form.gaps" />
                </b-form-group>
              </b-col>
            </b-row>

            <!-- 6) Health Score + Price -->
            <b-row>
              <b-col md="6">
                <b-form-group label="Health Score" label-for="healthScore">
                  <b-form-input
                    id="healthScore"
                    type="number"
                    step="0.1"
                    v-model.number="form.healthScore"
                  />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Price Per Serving"
                  label-for="pricePerServing"
                >
                  <b-form-input
                    id="pricePerServing"
                    type="number"
                    step="0.01"
                    v-model.number="form.pricePerServing"
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <!-- 7) Source URLs -->
            <b-row>
              <b-col md="6">
                <b-form-group label="Source URL" label-for="sourceUrl">
                  <b-form-input id="sourceUrl" type="url" v-model="form.sourceUrl" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group
                  label="Spoonacular Source URL"
                  label-for="spoonacularSourceUrl"
                >
                  <b-form-input
                    id="spoonacularSourceUrl"
                    type="url"
                    v-model="form.spoonacularSourceUrl"
                  />
                </b-form-group>
              </b-col>
            </b-row>

            <!-- 8) Source Name + License -->
            <b-row>
              <b-col md="6">
                <b-form-group label="Source Name" label-for="sourceName">
                  <b-form-input id="sourceName" v-model="form.sourceName" />
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="License" label-for="license">
                  <b-form-input id="license" v-model="form.license" />
                </b-form-group>
              </b-col>
            </b-row>

            <!-- 9) Summary + Instructions -->
            <b-form-group label="Summary" label-for="summary">
              <b-form-textarea id="summary" v-model="form.summary" rows="3" />
            </b-form-group>
            <b-form-group label="Instructions" label-for="instructions">
              <b-form-textarea
                id="instructions"
                v-model="form.instructions"
                rows="5"
                required
              />
            </b-form-group>

            <!-- 10) Family-only fields -->
            <div
              v-if="form.type === 'family'"
              class="mt-3 border rounded p-3 bg-light"
            >
              <h5>Family Details</h5>
              <b-row>
                <b-col md="6">
                  <b-form-group label="Origin Person" label-for="originPerson">
                    <b-form-input
                      id="originPerson"
                      v-model="form.origin_person"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Occasion" label-for="occasion">
                    <b-form-input id="occasion" v-model="form.occasion" />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-form-group label="Story" label-for="story">
                <b-form-textarea id="story" v-model="form.story" rows="3" />
              </b-form-group>
            </div>

            <!-- Submit -->
            <b-button type="submit" variant="primary" class="mt-3">
              Create Recipe
            </b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "CreateRecipePage",
  data() {
    return {
      form: {
        type: "personal",
        title: "",
        image: "",
        readyInMinutes: null,
        servings: null,
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        dairyFree: false,
        veryHealthy: false,
        cheap: false,
        veryPopular: false,
        sustainable: false,
        lowFodmap: false,
        weightWatcherSmartPoints: null,
        gaps: "",
        healthScore: null,
        pricePerServing: null,
        sourceUrl: "",
        spoonacularSourceUrl: "",
        sourceName: "",
        license: "",
        summary: "",
        instructions: "",
        // family-only
        origin_person: "",
        occasion: "",
        story: ""
      },
      typeOptions: [
        { value: "personal", text: "Personal Recipe" },
        { value: "family", text: "Family Recipe" }
      ]
    };
  },
  methods: {
    async onSubmit() {
      try {
        // Build payload **without** any id field
        const payload = { ...this.form };
        // Send to the correct endpoint
        if (payload.type === "personal") {
          await window.axios.post("/user/myRecipes", payload);
          this.$router.push({ name: "myRecipes" });
        } else {
          await window.axios.post("/user/familyRecipes", payload);
          this.$router.push({ name: "familyRecipes" });
        }
      } catch (err) {
        console.error("Failed to create recipe:", err);
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
</style>
