<script setup>
import { computed, ref } from 'vue';


const props = defineProps({
  currentBalance: {
    type: Number,
    default: 0,
  },
  totalIncomes: {
    type: Number,
    default: 0,
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
  savingsRate: {
    type: Number,
    default: 0,
  },
  totalIncomePercentage: {
    type: Number,
    default: 0,
  },
  totalExpensePercentage: {
    type: Number,
    default: 0,
  },
})

const overviews = computed(() => [
  {
    subtext: "Current Balance",
    value: props.currentBalance.toLocaleString(),
    icon: "₱",

    iconColor: "text-green-600",
    status: `${props.currentBalance >= 0 ? "+ Positive" : "- Negative"} balance`,
    valueColor: "",
    statusColor: `${props.currentBalance >= 0 ? "text-black" : "text-red-600"}`,
  },
  {
    subtext: "Total Income",
    value: props.totalIncomes.toLocaleString(),
    icon: "M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18",
    iconColor: "text-green-600",
    status: (props.totalIncomePercentage).toLocaleString() + "%",
    valueColor: "text-green-600",
    statusColor: "text-green-600",
  },
  {
    subtext: "Total Expenses",
    value: props.totalExpenses.toLocaleString(),
    icon: "M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3",
    iconColor: "text-red-600",
    status: (props.totalExpensePercentage).toLocaleString() + "%",
    valueColor: "text-red-600",
    statusColor: "text-red-600",
  },
  {
    subtext: "Savings Rate",
    value: (props.savingsRate).toLocaleString() + "%",
    icon: "M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18",
    iconColor: "text-green-600",
    valueColor: "text-primary",
    status: "+2.5%",
    statusColor: "text-green-600",
  },
])

const isLoading = computed(() => {
  return !props.currentBalance && !props.totalIncomes && !props.totalExpenses
})
</script>
<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-3xl font-bold">Overview</h1>
      <!-- <select class="select select-ghost">
        <option selected>Last 30 days</option>
        <option>Last 7 days</option>
        <option>Last 3 months</option>
        <option>Last year</option>
      </select> -->
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div v-if="isLoading" v-for="item in 4" :key="item" class="skeleton w-full h-32">
      </div>
      <div v-else v-for="(overview, index) in overviews" :key="index"
        class="rounded-md p-6 ring-1 ring-inset ring-base-300 bg-white">
        <div class="flex justify-between items-center">
          <h2 class="mt-2 text-md font-medium">{{ overview.subtext }}</h2>
          <h2 v-if="!overview.icon.startsWith('M')" class="text-gray-600 text-2xl">
            {{ overview.icon }}
          </h2>
          <!--This will show if have an svg icon-->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5" :class="overview.iconColor" v-else>
            <path stroke-linecap="round" stroke-linejoin="round" :d="overview.icon" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold" :class="overview.valueColor">
          {{ overview.value }}
        </h1>
        <div class="flex items-center gap-2" :class="overview.statusColor">
          <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
            <path fill-rule="evenodd"
              d="M15.22 6.268a.75.75 0 0 1 .968-.431l5.942 2.28a.75.75 0 0 1 .431.97l-2.28 5.94a.75.75 0 1 1-1.4-.537l1.63-4.251-1.086.484a11.2 11.2 0 0 0-5.45 5.173.75.75 0 0 1-1.199.19L9 12.312l-6.22 6.22a.75.75 0 0 1-1.06-1.061l6.75-6.75a.75.75 0 0 1 1.06 0l3.606 3.606a12.695 12.695 0 0 1 5.68-4.974l1.086-.483-4.251-1.632a.75.75 0 0 1-.432-.97Z"
              clip-rule="evenodd" />
          </svg> -->

          <p>{{ overview.status }}</p>
        </div>
      </div>

    </div>
  </div>
</template>
