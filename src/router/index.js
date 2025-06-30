import Main from "../pages/MainPage.vue";
import NotFound from "../pages/NotFoundPage.vue";
import RecipeViewPage from "../pages/RecipeViewPage.vue";
import PreparationPage from "../pages/PreparationPage.vue";
import MealPlanPage    from "../pages/MealPlanPage.vue";

const routes = [
  {
    path: "/",
    name: "main",
    component: Main,
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../pages/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/LoginPage.vue"),
  },
  {
    path: "/search",
    name: "search",
    component: () => import("../pages/SearchPage.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../pages/AboutPage.vue"),
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("../pages/FavoritesPage.vue"),
  },
  {
    path: "/my-recipes",
    name: "myRecipes",
    component: () => import("../pages/MyRecipesPage.vue"),
  },
  {
    path: "/family-recipes",
    name: "familyRecipes",
    component: () => import("../pages/FamilyRecipesPage.vue"),
  },
  // {
  //   path: "/create-recipe",
  //   name: "createRecipe",
  //   component: () => import("../components/CreateRecipeModal.vue"),
  // },
  {
    path: "/prepare/:recipeId",
    name: "prepare",
    component: PreparationPage,
    props: true
  },
  {
    path: "/meal-plan",
    name: "mealPlan",
    component: MealPlanPage
  },
  {
    path: "/recipe/:recipeId",
    name: "recipe",
    component: () => RecipeViewPage,
    props: true,
  },
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    component: NotFound,
  }
];

export default routes;
