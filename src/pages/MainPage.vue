<template>
  <div class="container mt-4">
    <b-card class="transparent-card p-4">

    <h1 class="title text-center">Main Page</h1>
    <b-row>
      <!-- Column 1: Random Recipes -->
      <b-col>
        <RecipePreviewList 
        title="Random Recipes" 
        :recipes="randomRecipes"
        class="RandomRecipes center" />

        <div class="text-center mt-2">
          <b-button
            variant="outline-primary"
            @click="loadRandomRecipes">🔄 Reload
          </b-button>
        </div>
      </b-col>

      <!-- Column 2: Login or Last Viewed -->
      <b-col>
          <!-- show login form to guests -->
          <LoginPage v-if="!store.username" />

          <!-- show last‐viewed list to authenticated users -->
          <RecipePreviewList
            v-else
            title="Last Viewed Recipes"
            :recipes="lastViewedRecipes"
            class="RandomRecipes center"
          />
      </b-col>
    </b-row>
    </b-card> 
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";
import LoginPage from './LoginPage.vue';

export default {
  components: {
    RecipePreviewList,
    LoginPage
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    
    const randomRecipes = ref([]);
    
    const loadRandomRecipes = async () => {
      try {
        const res = await window.axios.get('/recipes/random');
        randomRecipes.value = res.data || [];
        console.log('Loaded new random recipes:', randomRecipes.value);
      } catch (err) {
        console.error('Failed to load random recipes:', err);
      }
    };

    onMounted(() => {
      loadRandomRecipes();
    });
    return { store, randomRecipes, loadRandomRecipes };
  }
};
</script>

