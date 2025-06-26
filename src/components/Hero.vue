<script setup>
import HeroImage from "../assets/hero-image-3.png";
import { motion } from "motion-v";

</script>
<template>
  <div>
    <div class="pt-10 px-8 lg:min-h-screen flex justify-center items-center gap-10 bg-no-repeat">
      <div class="text-center">
        <div class="flex justify-center mt-4 mb-2  ">
          <motion.div class="rounded-full badge-ghost py-1 px-4 ring-1 ring-inset ring-gray-200"
            :initial="{ opacity: 0 }" :whileInView="{ opacity: 1 }" :viewport="{ once: true }"
            :transition="{ delay: 0.6, ease: 'easeInOut' }">
            <p class="text-sm font-medium"> 🚀 New: Advanced Budget Analytics</p>
          </motion.div>
        </div>
        <motion.div :initial="{
          y: -50,
          opacity: 0,
        }" :whileInView="{ y: 0, opacity: 1 }" :viewport="{ once: true }"
          :transition="{ delay: 0.1, ease: 'easeInOut' }">
          <h1 class="text-6xl lg:text-9xl break-words font-black">
            Track Your Budget Effortlessly!
          </h1>
          <p class="text-xl lg:text-2xl text-gray-500 pt-6">
            Take control of your budget. Manage your money effortlessly.
          </p>
          <div class="pt-6 flex justify-center gap-2">
            <router-link to="/signup" class="font-medium btn btn-primary">Get Started for Free</router-link>
            <router-link to="/login" class="font-medium btn btn-ghost">Learn More</router-link>
          </div>

          <div class="mt-8 w-full hidden lg:flex justify-center">
            <img :src="HeroImage" alt="Budget Tracker Image" class="object-cover rounded-md shadow-black" />
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</template>
