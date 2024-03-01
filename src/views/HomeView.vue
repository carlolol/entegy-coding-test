<template>
  <div class="home-view__container">
    <section class="flex basis-2/3 flex-col p-20" :key="currentSession.name">
      <h1 class="mb-12">{{ conference.roomName }}</h1>

      <template v-if="!!currentSession.name">
        <h5>{{ currentSession.name }}</h5>
        <p>{{ currentSession.description }}</p>
        <h6 class="mb-4">{{ `${currentSession.startTime} - ${currentSession.endTime}` }}</h6>
  
        <h5 class="mb-2">Speakers:</h5>
        <div class="carousel">
          <div class="carousel-inner">
            <div
              v-for="(speaker, i) in speakers"
              :id="`slide-${i}`"
              :key="i"
              :class="`${activeSlide === i ? 'active' : '!left-[-100%]'}`"
              class="carousel-item"
            >
              <div class="flex gap-6 items-center">
                <div class="flex">
                  <img class="h-16" :src="speaker.image" :alt="speaker.name" />
                </div>
                <div class="flex flex-col">
                  <h6>{{ speaker.name }}</h6>
                  <p class="text-sm">{{ speaker.company }}</p>
                  <p class="text-sm">{{ speaker.position }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentSession.allowCheckin" class="mt-12">
          <h5>Check-in by scanning this QR Code:</h5>
          <img src="@/assets/qr-code.png" alt="qr-code" class="h-24 w-24" >
        </div>
      </template>
      <template v-else-if="!nextSessionTimeRemaining">
        <h4>Sessions today have concluded</h4>
      </template>
      <template v-else>
        <h5 class="mb-2">Upcoming</h5>
        <h4>{{ nextSession.name }}</h4>
        <h6 class="mb-6">{{ nextSession.description }}</h6>
        <h4>Starts in: {{ nextSessionTimeRemaining }}</h4>
      </template>
    </section>
    <section class="timeslot__container">
      <h4 class="text-center text-gray-300">{{ formattedDate }}</h4>
      <h1 class="text-center text-gray-300 mb-6">{{ formattedTime }}</h1>

      <div
        v-for="(session, i) in conference.sessions"
        :key="i"
        :class="{ active: session.name === currentSession?.name }"
        class="session-timeslot__container"
      >
        <p class="text-gray-400">{{ session.name }}</p>
        <p class="text-gray-400">{{ `${session.startTime} - ${session.endTime}` }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import {
  format,
  isBefore,
  isWithinInterval,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns';
import { ref, onMounted, computed } from 'vue';
import { useConferenceStore } from '../stores/conference';

const { getConference, setConference } = useConferenceStore();
const { conference, currentDate } = storeToRefs(useConferenceStore())

const activeSlide = ref(0);
const tempDate1 = ref(new Date(2000, 1, 1));
const tempDate2 = ref(new Date(2000, 1, 1));
const tempCurrentDate = ref(new Date(2000, 1, 1));

const currentSession = computed(() => conference.value.sessions?.find(s => {
    const startTime = s.startTime.split(':');
    const endTime = s.endTime.split(':');
    return isWithinInterval(tempCurrentDate.value.setHours(currentDate.value.getHours(), currentDate.value.getMinutes()), {
      start: tempDate1.value.setHours(startTime[0], startTime[1]),
      end: tempDate2.value.setHours(endTime[0], endTime[1])
    })
  }) || {});
const speakers = computed(() => currentSession.value.speakers || []);
const formattedDate = computed(() => format(currentDate?.value, 'EEEE, d MMMM yyyy'));
const formattedTime = computed(() => format(currentDate?.value, 'HH:mm'));
const nextSession = computed(() => conference.value.sessions?.find(s => {
  const startTime = s.startTime.split(':');
  return isBefore(currentDate.value, new Date().setHours(startTime[0], startTime[1]))
}));
const nextSessionTimeRemaining = computed(() => {
  if (!nextSession.value) return undefined;

  const startTimeTemp = nextSession.value.startTime.split(':');
  const startTime = new Date().setHours(startTimeTemp[0], (Number(startTimeTemp[1]) - 1) || 60, 59);

  const hourDiff = differenceInHours(startTime, currentDate.value);
  const minuteDiff = differenceInMinutes(startTime, currentDate.value) % 60;
  const secDiff = differenceInSeconds(startTime, currentDate.value) % 60;

  const timeArray = [
    hourDiff,
    hourDiff === 0 ? undefined : `${hourDiff === 1 ? 'hour' : 'hours'}`,
    minuteDiff,
    minuteDiff === 0 ? undefined : `${minuteDiff === 1 ? 'minute' : 'minutes'}`,
    `${secDiff}`,
    `${secDiff === 1 ? 'second' : 'seconds'}`,
  ].filter(Boolean);
  return timeArray.join(' ');
});

onMounted(async () => {
  try {
    const res = await getConference();
    setConference(res);

    let i = 0;
    setInterval(() => {
      if (!currentSession.value.name) return;

      if (i > currentSession.value.speakers.length - 1) {
        i = 0;
      }

      activeSlide.value = i;
      i++;
    }, 2000);
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
.home-view__container {
  @apply flex bg-gray-300 h-[calc(100vh-8rem)];
}

.carousel {
  @apply relative;
}
.carousel-inner {
  @apply relative overflow-hidden w-full;
}
.carousel-item {
  @apply inset-0 relative w-full transform transition-all duration-500 ease-in-out float-left block;
  margin-right: -100%;
  backface-visibility: hidden;
}

.carousel-item.active {
  @apply left-0;
}

.carousel-indicators__container {
  @apply absolute bottom-0 flex bg-yellow-100 h-24 w-full justify-center items-center;
}
.carousel-indicator {
  @apply md:w-4 md:h-4 bg-gray-300 rounded-full cursor-pointer mx-2
}

.timeslot__container {
  @apply flex flex-col basis-1/3 bg-[rgba(0,0,0,0.8)] rounded mr-4 p-6 my-4;
}

.session-timeslot__container {
  @apply border-b-2 border-b-secondary-color py-4;
}
.session-timeslot__container:last-child {
  @apply border-b-0
}
.session-timeslot__container.active > p {
  @apply text-green-500;
}
</style>