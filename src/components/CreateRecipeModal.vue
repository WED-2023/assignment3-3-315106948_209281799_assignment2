<!-- src/components/CreateRecipeModal.vue -->
<template>
  
  <b-modal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Create New Recipe"
    hide-footer
    size="xl"
  >
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
              v-model="form.image"
              type="url"
              placeholder="https://example.com/image.jpg"
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
          <b-form-group label="Price Per Serving" label-for="pricePerServing">
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
      <!-- <b-row>
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
      </b-row> -->

      <!-- 8) Source Name + License -->
      <!-- <b-row>
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
      </b-row> -->

      <!-- 9) Summary + Instructions + Ingredients  -->
      <b-form-group label="Summary" label-for="summary">
        <b-form-textarea id="summary" v-model="form.summary" rows="3" />
      </b-form-group>

      <b-form-group label="Instructions">
        <div
          v-for="(instruction, index) in form.instructions"
          :key="index"
          class="d-flex align-items-center mb-2"
        >
          <b-form-input
            v-model="form.instructions[index]"
            placeholder="e.g. Preheat oven to 180°C"
            class="me-2"
          />
          <b-button
            variant="danger"
            size="sm"
            @click="removeInstruction(index)"
            v-if="form.instructions.length > 1"
          >🗑️</b-button>
        </div>
        <b-button variant="outline-primary" size="sm" @click="addInstruction">
          ➕ Add Step
        </b-button>
      </b-form-group>

      <b-form-group label="Ingredients">
        <div
          v-for="(ingredient, index) in form.ingredients"
          :key="index"
          class="d-flex align-items-center mb-2"
        >
          <b-form-input
            v-model="ingredient.name"
            placeholder="e.g. flour"
            class="me-2"
          />
          <b-form-input
            type="number"
            v-model.number="ingredient.amount"
            placeholder="Qty"
            class="me-2"
            min="0"
          />
          <b-form-input
            v-model="ingredient.unit"
            placeholder="Unit (e.g. tbsp)"
            class="me-2"
          />
          <b-button
            variant="danger"
            size="sm"
            @click="removeIngredient(index)"
            v-if="form.ingredients.length > 1"
          >🗑️</b-button>
        </div>
        <b-button variant="outline-primary" size="sm" @click="addIngredient">
          ➕ Add Ingredient
        </b-button>
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
                required
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Occasion" label-for="occasion">
              <b-form-input id="occasion" v-model="form.occasion" required/>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Story" label-for="story">
          <b-form-textarea id="story" v-model="form.story" rows="3" required/>
        </b-form-group>
      </div>

      <!-- Submit -->
      <b-button type="submit" variant="primary" class="mt-3">
        Create Recipe
      </b-button>
    </b-form>
    <b-alert
      v-if="errorMessage"
      variant="danger"
      class="mt-3"
      show
    >
      {{ errorMessage }}
    </b-alert>

  </b-modal>
</template>

<script>
export default {
  name: "CreateRecipeModal",
  props: {
    modelValue: { type: Boolean, required: true }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      form: {
        type: "personal",
        title: "",
        image: null,
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
        // sourceUrl: "",
        // spoonacularSourceUrl: "",
        // sourceName: "",
        // license: "",
        summary: "",
        instructions: [""],
        ingredients: [{ name: "", amount: null, unit: "" }],
        origin_person: "",
        occasion: "",
        story: "",
      },
      errorMessage: "",
      typeOptions: [
        { value: "personal", text: "Personal Recipe" },
        { value: "family", text: "Family Recipe" }
      ]
    };
  },
  methods: {
  async onSubmit() {
  this.errorMessage = ""; // Reset error message

  const instructions = this.form.instructions.filter(i => i.trim());
  const ingredients = this.form.ingredients.filter(i => i.name.trim());

  const payload = {
    ...this.form,
    image: this.form.image || null,
    instructions,
    ingredients
  };

  try {
    const endpoint = this.form.type === "personal"
      ? "/user/myRecipes"
      : "/user/familyRecipes";

    const response = await window.axios.post(endpoint, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Response from server:", response.data);

    //close the modal only after successful creation
    this.$emit('update:modelValue', false);

    //send the created recipe back to the parent component
    this.$emit("recipeCreated", response.data);

  } catch (err) {
    console.error("❌ Failed to create recipe:", err);

    //show error message in the modal
    if (err.response && err.response.data) {
      this.errorMessage = err.response.data;
    } else {
      this.errorMessage = "An unknown error occurred.";
    }

  }
},

  addInstruction() {
    this.form.instructions.push("");
  },
  removeInstruction(index) {
    this.form.instructions.splice(index, 1);
  },
  addIngredient() {
    this.form.ingredients.push({ name: "", amount: null, unit: "" });
  },
  removeIngredient(index) {
    this.form.ingredients.splice(index, 1);
  },

}
  
};
</script>
