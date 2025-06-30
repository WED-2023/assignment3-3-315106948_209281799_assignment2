<template>
  <div id="app">
    <NavBar :store="store" @logout="logout" @openCreateRecipe="openModal" />
    <CreateRecipeModal v-model="showModal" />
    <router-view />
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import { useToast } from 'vue-toastification';
import NavBar from './components/NavBar.vue';
import CreateRecipeModal from "@/components/CreateRecipeModal.vue";


export default {
  name: "App",
  components: {
    NavBar,
    CreateRecipeModal
  },

  data() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const router = internalInstance.appContext.config.globalProperties.$router;
    const toast = useToast();

    const logout = () => {
      store.logout();
      toast.success("User logged out successfully");
      router.push("/").catch(() => {});
    };

    return {
      logout,
      // store: this.$root.store
      showModal: false
    };  
  },
  methods: {
    openModal() {
      this.showModal = true;
    }

  },

};
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
</style>