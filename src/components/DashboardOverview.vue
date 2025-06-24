<script setup>
import { computed, ref } from 'vue';
import IconUp from './icons/IconUp.vue';
import IconDown from './icons/IconDown.vue';
import IconSavings from './icons/IconSavings.vue';
import IconMoney from './icons/IconMoney.vue';


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
  percentageSavingsRate: {
    type: Number,
    default: 0
  },
  isLoading: {
    type: Boolean,
    default: true,
  }
})

const overviews = computed(() => [
  {
    subtext: "Current Balance",
    value: props.currentBalance.toLocaleString(),
    icon: IconMoney,

    iconColor: "text-green-600",
    status: `${props.currentBalance >= 0 ? "+ Positive" : "- Negative"} balance`,
    valueColor: "",
    statusColor: `${props.currentBalance >= 0 ? "text-gray-400" : "text-red-600"}`,
  },
  {
    subtext: "Total Income",
    value: props.totalIncomes.toLocaleString(),
    icon: IconUp,
    iconColor: "text-success",
    status: "Total earned this month",
    valueColor: "text-success",
    statusColor: "text-gray-400",
  },

  {
    subtext: "Total Expenses",
    value: props.totalExpenses.toLocaleString(),
    icon: IconDown,
    iconColor: "text-errror",
    status: "Total spent this month",
    valueColor: "text-error",
    statusColor: "text-gray-400",
  },
  {
    subtext: "Savings Rate",
    value: (props.savingsRate).toLocaleString() + "%",
    icon: IconSavings,
    iconColor: "",
    valueColor: "text-info",
    status: (props.percentageSavingsRate).toLocaleString() + "% of your income",
    statusColor: "text-gray-400",
  },
])


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
      <div v-if="props.isLoading" v-for="item in 4" :key="item" class="skeleton w-full h-32">
      </div>
      <div v-else v-for="(overview, index) in overviews" :key="index"
        class="rounded-md p-6 ring-1 ring-inset ring-base-300">
        <div class="flex justify-between items-center">
          <h2 class="mt-2 text-md font-medium">{{ overview.subtext }}</h2>
          <h2 v-if="!overview.icon && !overview.icon.startsWith('M')" class="text-gray-600 text-2xl">
            {{ overview.icon }}
          </h2>
          <!--This will show if have an svg icon-->

          <component :is="overview.icon" />
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
