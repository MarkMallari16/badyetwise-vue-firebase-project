<script setup>
import { ref, onMounted } from "vue";
import { motion, animate } from "motion-v"
const activeUsersNumber = ref(0);
const appRatingNumber = ref(0);
const uptimeNumber = ref(0);

// Initial state for the motion component
const initial = {
  opacity: 0
}
// This is used to animate the text when it comes into view
const whileInView = {
  opacity: 1,
  transition: {
    delay: 0.2,
    duration: 0.3
  }
}
// This is used to animate the numbers in the Bar component
onMounted(() => {
  animate(0, 50000, {
    duration: 2,
    onUpdate: (value) => {
      activeUsersNumber.value = Math.round(value);
    }
  })

  animate(0, 99.9, {
    duration: 2,
    onUpdate: (value) => {
      uptimeNumber.value = value.toFixed(1)
    }
  })

  animate(0, 4.9, {
    duration: 4,
    onUpdate: (value) => {
      appRatingNumber.value = value.toFixed(1)
    }
  })
})
</script>
<template>
  <section class="bg-black text-white mt-6 p-20">
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-0">
      <div class="text-center">
        <h1 class="text-7xl lg:text-6xl font-bold">{{ activeUsersNumber }}K+</h1>
        <motion.p :initial="initial" :whileInView="whileInView" class="text-gray-300">Active Users</motion.p>
      </div>
      <div class="text-center">
        <h1 class="text-7xl lg:text-6xl font-bold">$2M+</h1>
        <motion.p :initial="initial" :whileInView="whileInView" class="text-gray-300">Money Tracked</motion.p>
      </div>
      <div class="text-center">
        <h1 class="text-7xl lg:text-6xl font-bold">{{ uptimeNumber }}%</h1>
        <motion.p :initial="initial" :whileInView="whileInView" class="text-gray-300">Uptime</motion.p>
      </div>
      <div class="text-center">
        <h1 class="text-7xl lg:text-6xl font-bold">{{ appRatingNumber }}</h1>
        <div class="flex justify-center items-center gap-1 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
            <path fill-rule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
              clip-rule="evenodd" />
          </svg>
          <p>App Rating</p>
        </div>
      </div>
    </div>
  </section>
</template>
