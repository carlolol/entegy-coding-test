import { defineStore } from 'pinia'
import { computed, ref } from 'vue';
import { addSeconds } from 'date-fns';

export const useConferenceStore = defineStore('conference', () => {
  const conference = ref({});
  const currentDate = ref(new Date());

  const initCurrentDate = () => {
    setInterval(() => {
      currentDate.value = addSeconds(currentDate.value, 1);
    }, 1000);
  }

  const getConference = async () => {
    const res = await fetch('data/conference.json');

    return await res.json();
  }

  const setConference = (val) => {
    conference.value = val;
  }

  const design = computed(() => conference.value.design);
  const conferenceLogo = computed(() => design.value?.conferenceLogo);

  return {
    conference,
    currentDate,
    conferenceLogo,
    initCurrentDate,
    getConference,
    setConference,
  };
})
