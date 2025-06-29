<template>
  <div class="container mt-4">
    <b-card class="transparent-card p-4">

    <h1 class="title text-center">Main Page</h1>
    <b-row>
      <b-col>
        <RecipePreviewList 
        title="Random Recipes" 
        :recipes="randomRecipes"
        class="RandomRecipes center" />

        <div class="text-center mt-2">
          <b-button
            variant="outline-primary"
            @click="loadRandomRecipes">More random recipes</b-button>
        </div>
      </b-col>

      <b-col>
        <div v-if="!store.username" class="text-center mt-4">
          <router-link :to="{ name: 'login' }">
            <button class="btn btn-primary">You need to Login to view this</button>
          </router-link>
        </div>

        <RecipePreviewList
          title="Last Viewed Recipes"
          :blur="!store.username" 
          class="RandomRecipes center"
          disabled
        />

      </b-col>
    </b-row>
    </b-card> 
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  components: {
    RecipePreviewList
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

