<template>
  <b-container fluid class="mt-5">
    <b-row class="justify-content-center">
      <!-- Now spans 8/12 on XL, 10/12 on LG, 10/12 on MD -->
      <b-col cols="12" md="10" lg="10" xl="8">
        <b-card class="search-card p-4">
          <h1 class="title mb-4 text-center">Search Recipes</h1>

          <!-- Inline search + toggle -->
          <b-input-group class="mb-2">
            <b-form-input
              v-model="searchQuery"
              placeholder="🔍 Search recipes..."
              @keyup.enter="doSearch"
            />
            <b-input-group-append>
              <b-button variant="primary" @click="doSearch">Search</b-button>
              <b-button
                variant="outline-secondary"
                @click="showFilters = !showFilters"
                :pressed="showFilters"
                title="Show/Hide Filters"
              >
                ⚙️
              </b-button>
            </b-input-group-append>
          </b-input-group>

          <!-- Filters panel, now with labels -->
          <b-collapse :visible="showFilters" class="mb-3">
            <b-row class="g-3">
              <b-col cols="6" md="3">
                <b-form-group label="Results" label-for="numberOfResults">
                  <b-form-select
                    id="numberOfResults"
                    v-model="numberOfResults"
                    :options="resultOptions"
                    class="w-100"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="6" md="3">
                <b-form-group label="Cuisine" label-for="selectedCuisine">
                  <b-form-select
                    id="selectedCuisine"
                    v-model="selectedCuisine"
                    :options="cuisineOptions"
                    class="w-100"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="6" md="3">
                <b-form-group label="Diet" label-for="selectedDiet">
                  <b-form-select
                    id="selectedDiet"
                    v-model="selectedDiet"
                    :options="dietOptions"
                    class="w-100"
                  />
                </b-form-group>
              </b-col>
              <b-col cols="6" md="3">
                <b-form-group label="Intolerances" label-for="selectedIntolerances">
                  <b-form-select
                    id="selectedIntolerances"
                    v-model="selectedIntolerances"
                    :options="intoleranceOptions"
                    class="w-100"
                  />
                </b-form-group>
              </b-col>
            </b-row>
          </b-collapse>

          <!-- Sort selector -->
          <div v-if="recipes.length" class="mb-3">
            <b-input-group>
              <b-input-group-prepend is-text>Sort by:</b-input-group-prepend>
              <b-form-select
                v-model="sortOption"
                :options="sortOptions"
                @change="sortRecipes"
              />
            </b-input-group>
          </div>

          <!-- Results -->
          <div v-if="recipes.length > 0">
            <RecipePreviewList
              :title="`Results for '${searchQuery}'`"
              :recipes="recipes"
            />
          </div>
          <div v-else-if="searchPerformed" class="text-center text-muted py-4">
            No results found for “{{ searchQuery }}.”
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { ref, onMounted } from 'vue';
import RecipePreviewList from '@/components/RecipePreviewList.vue';
import { useToast } from 'vue-toastification';

export default {
  name: 'SearchPage',
  components: { RecipePreviewList },
  setup() {
    const toast = useToast();

    const searchQuery = ref('');
    const numberOfResults = ref(5);
    const selectedCuisine = ref('No Filter');
    const selectedDiet = ref('No Filter');
    const selectedIntolerances = ref('No Filter');
    const recipes = ref([]);
    const searchPerformed = ref(false);
    const sortOption = ref('');
    const showFilters = ref(false);

    const resultOptions = [
      { value: 5, text: '5 results' },
      { value: 10, text: '10 results' },
      { value: 15, text: '15 results' },
    ];
    const cuisineOptions = [
      'No Filter', 'Italian', 'Chinese', 'Indian', 'French', 'Mexican', 'Thai'
    ];
    const dietOptions = [
      'No Filter', 'Vegetarian', 'Vegan', 'Gluten Free',
      'Ketogenic', 'Pescetarian'
    ];
    const intoleranceOptions = [
      'No Filter', 'Gluten', 'Dairy', 'Egg', 'Peanut',
      'Seafood', 'Sesame', 'Soy', 'Sulfite', 'Tree Nut', 'Wheat'
    ];
    const sortOptions = [
      { value: '',        text: 'No Sort' },
      { value: 'time',    text: 'Prep Time' },
      { value: 'popularity', text: 'Popularity' },
    ];

    const doSearch = async () => {
      if (!searchQuery.value.trim()) {
        return toast.info('Please enter a keyword to search.');
      }
      try {
        const params = new URLSearchParams({
          query: searchQuery.value,
          number: numberOfResults.value
        });
        if (selectedCuisine.value !== 'No Filter')
          params.append('cuisine', selectedCuisine.value);
        if (selectedDiet.value !== 'No Filter')
          params.append('diet', selectedDiet.value);
        if (selectedIntolerances.value !== 'No Filter')
          params.append('intolerances', selectedIntolerances.value);

        const { data } = await window.axios.get(`/recipes/search?${params}`);
        recipes.value = data || [];
        searchPerformed.value = true;
        showFilters.value = false;
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
        recipes.value.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
      } else if (sortOption.value === 'popularity') {
        recipes.value.sort((a, b) => b.popularity - a.popularity);
      }
    };

    onMounted(async () => {
      try {
        const { data } = await window.axios.get('/recipes/last-search');
        recipes.value = data || [];
        searchPerformed.value = true;
        const lastQ = localStorage.getItem('lastSearchQuery');
        if (lastQ) searchQuery.value = lastQ;
      } catch (err) {
        if (!(err.response && err.response.status === 404)) {
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
      sortOption,
      showFilters,
      resultOptions,
      cuisineOptions,
      dietOptions,
      intoleranceOptions,
      sortOptions,
      doSearch,
      sortRecipes
    };
  }
};
</script>

<style scoped>
.search-card {
  width: 100%;              /* allow card to fill its column */
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(4px);
}
.title {
  font-size: 1.75rem;
  font-weight: 600;
}
</style>
