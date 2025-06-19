<script setup>
import { delay, motion } from "motion-v";

const features = [
  {
    title: "Smart Analytics",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, magnam!",
    icon:
      "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
  },
  {
    title: "Smart Analytics",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, magnam!",
    icon:
      "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
  },
  {
    title: "Smart Analytics",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, magnam!",
    icon:
      "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
  },
  {
    title: "Smart Analytics",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, magnam!",
    icon:
      "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
  },
  {
    title: "Smart Analytics",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, magnam!",
    icon:
      "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
  },
  {
    title: "Smart Analytics",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, magnam!",
    icon:
      "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
  },
];
</script>
<template>
  <section class="min-h-screen pt-20 lg:p-20 flex flex-col justify-center w-full">
    <div class="text-center">
      <h1 class="text-4xl lg:text-6xl text-center font-extrabold">
        Everything you need to manage your budgets.
      </h1>
      <p class="text-lg lg:text-2xl text-gray-500 mt-6">
        Powerful features designed to simplify your financial life and help you make
        smarter spending decisions.
      </p>
    </div>
    <div class="pt-16 grid grid-cols-1 lg:grid-cols-3 m-4 lg:m-0 gap-8 place-items-center">
      <div v-for="(feature, index) in features" :key="index"
        class="bg-white p-10 ring-1 ring-inset ring-base-300 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-12 badge badge-neutral mb-2 rounded-lg">
          <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
        </svg>

        <h1 class="text-2xl font-medium pb-1">{{ feature.title }}</h1>
        <p class="text-gray-500">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>
</template>
