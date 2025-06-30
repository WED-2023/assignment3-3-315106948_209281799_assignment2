<template>
  <div class="container mt-4">
    <b-card class="transparent-card p-4">

    <h1 class="title text-center">Main Page</h1>

    <div>
  <b-button v-b-modal.modal-1>Launch demo modal</b-button>

  <b-modal id="modal-1" title="BootstrapVue">
    <p class="my-4">Hello from modal!</p>
  </b-modal>
</div>

    <b-row>
      <!-- Column 1: Random Recipes -->
      <b-col md="6">
        <div class="mt-4">
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
        </div>
      </b-col>

      <!-- Column 2: Login or Last Viewed -->
      <b-col md="6">
        <!-- <div class="full-width"> -->
        <div class="mt-4">

          <LoginPage v-if="!store.username" embedded/>

          <RecipePreviewList
            v-else
            title="Last Viewed Recipes"
            :recipes="lastViewedRecipes"
            class="RandomRecipes center"
          />
        </div>
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

<!-- <style scoped>
.full-width {
  width: 100%;
}

</style> -->

