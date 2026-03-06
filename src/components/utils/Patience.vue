<script setup lang="js">
</script>

<template>
  <div class="patience-container">
    <span class="loader" />
  </div>
</template>

<style scoped>
.patience-container{
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #000000;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  /* remonte un peu par rapport au vrai centre */
  margin-top: -50px;
  animation: rotation 1s linear infinite;
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