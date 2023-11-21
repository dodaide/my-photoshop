<template>
  <div class="d-flex">
    <app-tool />
    <image-container />
  </div>
</template>

<script>
import ImageContainer from '../components/ImageContainer.vue';
import AppTool from '../components/AppTool.vue';

export default {
  components: {
    ImageContainer,
    AppTool,
  }
}
</script>

<style src="../styles/style.css"></style>
