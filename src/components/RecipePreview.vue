<template>
  <div class="card h-100">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      class="card-img-top recipe-image"
      alt="Recipe image"
    />
    <div class="card-body text-center">
      <h5 class="card-title">{{ recipe.title }}</h5>
      <p class="card-text">{{ recipe.readyInMinutes }} minutes</p>
      <p class="card-text">{{ recipe.aggregateLikes }} likes</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(6px);
}
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
}

.card-title {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.card-text {
  font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 0.4rem;
}

.recipePreview {
  margin-bottom: 20px;
}
</style>
