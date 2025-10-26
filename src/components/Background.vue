<template>
  <div class="background fixed-center window-height window-width">
    <q-img class="fit" fit="cover" :src="backgroundStore.config!.image" :img-style="imageStyle"
      img-class="my-custom-image" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBackgroundStore } from 'src/stores/background';

const backgroundStore = useBackgroundStore();

const imageStyle = computed(() => ({
  filter: `blur(${backgroundStore.config!.blurLevel})`,
}))
</script>

<style scoped lang="scss">
.background {
  z-index: -1;
}
</style>
