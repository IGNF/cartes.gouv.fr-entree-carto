<script setup lang="ts">
// FIXME ceci n'est pas une view mais un composant !
// il est reutilisable pour d'autre actions
</script>

<template>
  <span class="loader"></span>
</template>

<style scoped>
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  } 
</style>