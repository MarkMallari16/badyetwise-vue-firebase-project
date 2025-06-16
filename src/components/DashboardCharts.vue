<script setup>
import { useNavigation } from "@/composables/useNavigation";
import DashboardBarChart from "./DashboardBarChart.vue";
import DashboardLineChart from "./DashboardLineChart.vue";

const { goTo } = useNavigation();

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
    <div class="mt-4 bg-white p-5 lg:p-10 rounded-md ring-1 ring-inset ring-base-300">
      <div class="flex justify-between items-center pb-10">
        <h2 class="text-2xl font-bold">Expense vs Income</h2>
        <button class="btn rounded-xl" @click="goTo('/reports')">View All</button>
      </div>
      <DashboardBarChart />
    </div>
    <div class="mt-4 bg-white p-5 lg:p-10 rounded-md ring-1 ring-inset ring-base-300">
      <h2 class="text-xl font-bold">Budget Spending History</h2>
      <DashboardLineChart />
    </div>
  </div>
</template>
