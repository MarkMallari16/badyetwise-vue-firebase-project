<script setup>
import { delay, motion } from "motion-v";
import IconGraphUp from "./icons/IconGraphUp.vue";
import IconCirclePlus from "./icons/IconCirclePlus.vue";
import IconEye from "./icons/IconEye.vue";
import IconMoneySign from "./icons/IconMoneySign.vue";
import IconTag from "./icons/IconTag.vue";
import IconCalendar from "./icons/IconCalendar.vue";

const features = [
  {
    title: "Smart Analytics",
    description:
      "See how your daily or monthly spending changes over time through simple charts.",
    icon:
      IconGraphUp,
  },
  {
    title: "Add Transactions",
    description:
      "Quickly add income or expense entries to keep your records updated.",
    icon:
      IconCirclePlus,
  },
  {
    title: "View Transaction History",
    description:
      "Keep track of every transaction you've made with details like date, amount, and category.",
    icon:
      IconEye,
  },
  {
    title: "Daily Balance Overview",
    description:
      "See how much you’ve spent and how much is left today.",
    icon:
      IconMoneySign,
  },
  {
    title: "Simple Category Tags",
    description:
      "Label each transaction with a category like Food or Bills.",
    icon:
      IconTag,
  },
  {
    title: "Monthly Summary",
    description:
      "Basic overview of income vs. expenses per month.",
    icon:
      IconCalendar,
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
        <component :is="feature.icon" class="bg-primary size-12 p-2 text-white rounded-md mb-2" />
        <h1 class="text-2xl font-medium pb-1">{{ feature.title }}</h1>
        <p class="text-gray-500">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>
</template>
