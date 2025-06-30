<template>
  <div class="notfound-container">
    <h1 class="notfound-title">404</h1>
    <p class="notfound-text">Oops—this page doesn’t exist.</p>
    <router-link to="/" class="btn btn-primary notfound-button">Go Home</router-link>
  </div>
</template>

<script setup>
// no script needed here
</script>

<style scoped>
.notfound-container {
  /* fill the viewport (minus any header/nav) */
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: var(--space-lg);
  background-color: var(--color-bg);
}

.notfound-title {
  font-size: 6rem;
  margin: 0;
  color: var(--color-secondary);
}

.notfound-text {
  font-size: 1.25rem;
  margin: var(--space-md) 0;
  color: #555;
}

.notfound-button {
  margin-top: var(--space-lg);
  padding: var(--space-sm) var(--space-lg);
  font-size: 1rem;
}
</style>
