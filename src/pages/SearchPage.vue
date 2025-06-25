<template>
  <div class="container mt-4">
    <h1 class="title mb-4">Search Page</h1>

    <!-- Search form -->
    <b-form @submit.prevent="doSearch">
      <b-form-group label="Search term" label-for="searchQuery">
        <b-form-input
          id="searchQuery"
          v-model="searchQuery"
          placeholder="Enter recipe keyword..."
        ></b-form-input>
      </b-form-group>

      <b-form-group label="Number of results">
        <b-form-select v-model="numberOfResults" :options="resultOptions"></b-form-select>
      </b-form-group>

      <b-form-group label="Cuisine">
        <b-form-select v-model="selectedCuisine" :options="cuisineOptions"></b-form-select>
      </b-form-group>

      <b-form-group label="Diet">
        <b-form-select v-model="selectedDiet" :options="dietOptions"></b-form-select>
      </b-form-group>

      <b-form-group label="Intolerances">
        <b-form-select v-model="selectedIntolerances" :options="intoleranceOptions"></b-form-select>
      </b-form-group>

      <b-button type="submit" variant="primary">Search</b-button>
    </b-form>

    <!-- Sorting -->
    <div v-if="recipes.length > 0" class="mt-4">
      <b-form-group label="Sort by">
        <b-form-select v-model="sortOption" :options="sortOptions" @change="sortRecipes"></b-form-select>
      </b-form-group>
    </div>

    <!-- Results -->
    <div class="mt-4" v-if="recipes.length > 0">
      <RecipePreviewList :title="`Results for '${searchQuery}'`" :recipes="recipes" />
    </div>

    <!-- No results message -->
    <div class="mt-4 text-muted" v-else-if="searchPerformed">
      No results found.
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import RecipePreviewList from '../components/RecipePreviewList.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'SearchPage',
  components: { RecipePreviewList },
  setup() {
    const toast = useToast();

    const searchQuery = ref('');
    const numberOfResults = ref(5);
    const selectedCuisine = ref('');
    const selectedDiet = ref('');
    const selectedIntolerances = ref('');
    const recipes = ref([]);
    const searchPerformed = ref(false);
    const sortOption = ref('');

    const resultOptions = [5, 10, 15];
    const cuisineOptions = ['No Filter', 'Italian', 'Chinese', 'Indian', 'French', 'Mexican', 'Thai'];
    const dietOptions = ['No Filter', 'Vegetarian', 'Vegan', 'Gluten Free', 'Ketogenic', 'Pescetarian'];
    const intoleranceOptions = ['No Filter', 'Gluten', 'Dairy', 'Egg', 'Peanut', 'Seafood', 'Sesame', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'];
    const sortOptions = [
      { value: '', text: 'No Sort' },
      { value: 'time', text: 'Preparation Time' },
      { value: 'popularity', text: 'Recipe Popularity' },
    ];

    const doSearch = async () => {
      try {
        const params = new URLSearchParams();
        params.append('query', searchQuery.value);
        params.append('number', numberOfResults.value);

        if (selectedCuisine.value && selectedCuisine.value !== 'No Filter') {
          params.append('cuisine', selectedCuisine.value);
        }

        if (selectedDiet.value && selectedDiet.value !== 'No Filter') {
          params.append('diet', selectedDiet.value);
        }

        if (selectedIntolerances.value && selectedIntolerances.value !== 'No Filter') {
          params.append('intolerances', selectedIntolerances.value);
        }

        const response = await window.axios.get(`/recipes/search?${params.toString()}`);

        recipes.value = response.data || [];
        searchPerformed.value = true;

        // Save last search in localStorage
        localStorage.setItem('lastSearchQuery', searchQuery.value);
        localStorage.setItem('lastSearchResults', JSON.stringify(recipes.value));

        toast.success(`Found ${recipes.value.length} recipes.`);
      } catch (err) {
        console.error('Search failed:', err);
        toast.error('Search failed. Please try again.');
      }
    };

    const sortRecipes = () => {
      if (sortOption.value === 'time') {
        recipes.value.sort((a, b) => (a.readyInMinutes || 0) - (b.readyInMinutes || 0));
      } else if (sortOption.value === 'popularity') {
        recipes.value.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }
    };

    onMounted(async () => {
      try {
        const response = await window.axios.get('/recipes/last-search');
        recipes.value = response.data || [];
        searchPerformed.value = true;
        if (localStorage.getItem('lastSearchQuery')) {
          searchQuery.value = localStorage.getItem('lastSearchQuery');
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log('No previous search found — this is OK.');
          // do nothing — searchPerformed remains false
        } else {
          console.error('Error loading last search:', err);
          toast.error('Error loading previous search.');
        }
      }
    });

    return {
      searchQuery,
      numberOfResults,
      selectedCuisine,
      selectedDiet,
      selectedIntolerances,
      recipes,
      searchPerformed,
      resultOptions,
      cuisineOptions,
      dietOptions,
      intoleranceOptions,
      sortOption,
      sortOptions,
      doSearch,
      sortRecipes,
    };
  },
};
</script>
