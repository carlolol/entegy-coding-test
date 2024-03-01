<template>
  <header class="mx-auto flex w-full items-center p-6 lg:px-8 gap-8">
    <img alt="logo" class="h-[80px]" :src="conferenceLogo" />
    <h5>{{ conference.conferenceName }}</h5>
  </header>
  
  <main>
    <RouterView></RouterView>
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';
import { useConferenceStore } from './stores/conference';

const { initCurrentDate } = useConferenceStore();
const { conference, conferenceLogo } = storeToRefs(useConferenceStore());

onMounted(() => {
  initCurrentDate();
})
</script>

<style>
#app {
  @apply bg-[rgba(107,114,128,0.51)] min-h-[100vh];
}
</style>
