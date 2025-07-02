<template>
  <div class="about-page container mt-4">
    <b-card class="transparent-card p-4">
      <h1 class="title text-center mb-4">About Y&D Recipes</h1>

      <p class="about-text">
        Y&D Recipes is a personal recipe management system developed by a passionate two-person team as part of a full-stack web development course.
        The platform allows users to explore new recipes, save personal and family favorites, and even track preparation progress – all in one place!
      </p>

      <p class="about-text">
        This project integrates <strong>Vue.js 3</strong>, <strong>BootstrapVue</strong>, and <strong>Node.js with MySQL</strong> for a modern and responsive experience.
        Our backend leverages external APIs like <a href="https://spoonacular.com/food-api" target="_blank">Spoonacular</a> to bring a rich collection of recipe data.
      </p>

      <h4 class="mt-4">Team Members</h4>
      <ul>
        <li><strong>Daniel Nisanov</strong> - Frontend lead & UX</li>
        <li><strong>Yuval Aviv</strong> - Backend lead & database integration</li>
      </ul>

      <h4 class="mt-4">Past Exercises</h4>
      <ul>
        <li><a href="https://wed-2023.github.io/209281799/" target="_blank">Daniel's grandma website</a></li>
        <li><a href="https://wed-2023.github.io/315106948/" target="_blank">Yuval's elderly website</a></li>
        <li><a href="https://wed-2023.github.io/assignment2-315106948_209281799_assignment2/" target="_blank">"Spaceships Game" website</a></li>
      </ul>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
};
</script>

<style scoped>
.about-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #2c3e50;
}
</style>
