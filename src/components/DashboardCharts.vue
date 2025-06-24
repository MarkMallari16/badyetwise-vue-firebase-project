<script setup>
import { useNavigation } from "@/composables/useNavigation";
import DashboardBarChart from "./DashboardBarChart.vue";
import DashboardPieChart from "@/components/DashboardPieChart.vue";

const { goTo } = useNavigation();
const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  }
})

</script>

<template>
  <div>
    <div v-if="isLoading" class="skeleton mt-4 w-full h-96"></div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div class="mt-4  p-5 lg:p-10 rounded-md ring-1 ring-inset ring-base-300 lg:col-span-2">
        <div class="flex justify-between items-center pb-10">
          <h2 class="text-2xl font-bold">Expense vs Income</h2>
          <button class="btn rounded-xl" @click="goTo('/reports')">View All</button>
        </div>
        <DashboardBarChart />
      </div>
      <div class="mt-0 lg:mt-4  p-5  rounded-md ring-1 ring-inset ring-base-300 w-full">
        <div class="flex justify-between items-center pb-10">
          <h2 class="text-xl font-bold">Expense Breakdown by Category</h2>
          <button class="btn rounded-xl" @click="goTo('/reports')">View All</button>
        </div>
        <DashboardPieChart />
      </div>
    </div>
  </div>
</template>
