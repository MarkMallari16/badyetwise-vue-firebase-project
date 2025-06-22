<script setup>
import DashboardOverview from "@/components/DashboardOverview.vue";
import DashboardCharts from "@/components/DashboardCharts.vue";
import DashboardNav from "@/components/DashboardNav.vue";
import DashboardNavBarRightSlot from "@/components/DashboardNavBarRightSlot.vue";
import AddTransactionModal from "@/components/modals/AddTransactionModal.vue";
import AddButtonModal from "@/components/OpenAddModalButton.vue";
import { useNavigation } from "@/composables/useNavigation";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { computed, onMounted, onUnmounted, provide, ref, watchEffect } from "vue";
import { db } from "@/firebase/firebase";
import { currentUser } from "@/composables/useAuth";
import dayjs from "dayjs";
import { useModal } from "@/composables/useModal";
import { getIconCategory } from "@/utils/getIconCategory";

const userId = currentUser.value?.uid;
const isFetching = ref(true);
const transactions = ref([]);
const budgets = ref([]);

let unsubscribeTransactions = null;
let unsubscribeBudgets = null;

onMounted(() => {
  const transactionsQuery = query(
    collection(db, "users", userId, "transactions"),
    orderBy("createdAt", "desc")
  )
  const budgetQuery = query(
    collection(db, "users", userId, "budgets"),
  )

  unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
    transactions.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  })

  unsubscribeBudgets = onSnapshot(budgetQuery, (snapshot) => {
    budgets.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    isFetching.value = false;
    console.log("Budgets:", budgets.value);
  })
})

const isLoading = computed(() => {
  return isFetching.value;
})

onUnmounted(() => {
  if (unsubscribeTransactions) {
    unsubscribeTransactions();
  }
  if (unsubscribeBudgets) {
    unsubscribeBudgets();
  }
})

const { showModal: showAddTransactionModal } = useModal("add_transaction");


// Computed property to get the five most recent transactions
const fiveRecentTransactions = computed(() => {
  return transactions.value.slice(0, 5);
})

// Computed property to get the length of the five recent transactions
const transactionLength = computed(() => {
  return fiveRecentTransactions.value.length;
})

// Overview Computed Property
const overview = computed(() => {
  const totalIncomes = transactions.value
    .filter(transaction => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount || 0, 0)
  const totalExpenses = transactions.value
    .filter(transaction => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount || 0, 0)

  const currentBalance = totalIncomes - totalExpenses;

  const savingRate = totalIncomes > 0 ? ((currentBalance / totalIncomes) * 100).toFixed(2) : 0;
  const percentageSavingsRate = totalIncomes > 0 ? ((totalIncomes / 100) * 100).toFixed(2) : 0;
  //sub overview
  const totalIncomePercentage = totalIncomes > 0 ? ((totalIncomes / 100) * 100).toFixed(2) : 0;
  const totalExpensePercentage = totalExpenses > 0 ? ((totalExpenses / 100) * 100).toFixed(2) : 0;

  const groupedPerMonth = {};

  // Group transactions by month
  transactions.value.forEach(transaction => {
    const month = dayjs(transaction.date).format("MMMM");
    if (!groupedPerMonth[month]) {
      groupedPerMonth[month] = {
        income: 0,
        expense: 0
      }
    }

    if (transaction.type === "income") {
      groupedPerMonth[month].income += transaction.amount || 0;
    } else if (transaction.type === "expense") {
      groupedPerMonth[month].expense += transaction.amount || 0;
    }
  })

  //slice the groupedPerMonth to get only the last 5 months
  const expenseTransactions = transactions.value.filter(t => t.type === "expense").slice(0, 5);
  // Group expenses by category
  const groupedPerCategory = {};

  expenseTransactions.forEach(transaction => {
    const category = transaction.category;

    if (!groupedPerCategory[category]) {
      groupedPerCategory[category] = {
        expense: transaction.amount || 0
      }
    } else {
      groupedPerCategory[category].expense += transaction.amount || 0
    }
  })

  return {
    totalIncomes: totalIncomes,
    totalExpenses: totalExpenses,
    currentBalance: currentBalance,
    savingsRate: savingRate,
    percentageSavingsRate: percentageSavingsRate,
    totalIncomePercentage: totalIncomePercentage,
    totalExpensePercentage: totalExpensePercentage,
    groupedPerMonth: groupedPerMonth,
    groupedPerCategory: groupedPerCategory,
  }
})

// navigation composable
const { goTo } = useNavigation();


//chart data
const barChartData = ref({
  labels: [],
  datasets: []
})
// chart options
const barChartOptions = ref({
  indexAxis: "x",
  responsive: true,
  horizontal: true,
  plugins: {
    legend: {
      display: false,
      position: "top",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
        ticks: {
          display: true
        }
      }
    },
    y: {
      grid: {
        display: false,
        ticks: {
          display: true
        }
      },

    }
  }
})
//define pie chart data and options
const pieChartData = ref({
  labels: [],
  datasets: []
})
const pieChartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    title: {
      display: true,
    },
  },
})

watchEffect(() => {
  const grouped = overview.value;
  const months = Object.keys(grouped.groupedPerMonth);
  const incomes = months.map(month => grouped.groupedPerMonth[month].income);
  const expenses = months.map(month => grouped.groupedPerMonth[month].expense);

  barChartData.value = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: incomes,
        backgroundColor: "oklch(70.7% 0.165 254.624)",
        borderRadius: 10,
      },
      {
        label: "Expense",
        data: expenses,
        backgroundColor: "oklch(70.4% 0.191 22.216)",
        borderRadius: 10,
      }
    ]
  }

  const categories = Object.keys(grouped.groupedPerCategory);
  const categoryExpenses = categories.map(category => grouped.groupedPerCategory[category].expense);


  pieChartData.value = {
    labels: [...categories],
    datasets: [
      {
        label: 'Expenses',
        data: [...categoryExpenses],
        backgroundColor: ['oklch(76.5% 0.177 163.223)', 'oklch(70.7% 0.165 254.624)', 'oklch(67.3% 0.182 276.935)', 'oklch(71.2% 0.194 13.428)', 'oklch(74% 0.238 322.16)'],
        hoverOffset: 10,
      },
    ],
  }
})

provide("barChartData", barChartData);
provide("barChartOptions", barChartOptions);
provide("pieChartData", pieChartData);
provide("pieChartOptions", pieChartOptions);
</script>

<template>
  <!--Overview-->
  <div
    class="lg:min-h-screen mx-4 my-2 px-4 lg:px-12 pb-10 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-inner rounded-2xl">
    <DashboardNav>
      <!--Right-->
      <DashboardNavBarRightSlot>
        <!--Add Transaction Button-->
        <AddButtonModal @click="showAddTransactionModal">Add Transaction</AddButtonModal>
        <AddTransactionModal />
      </DashboardNavBarRightSlot>
    </DashboardNav>

    <!--Overview---->
    <DashboardOverview :current-balance="overview.currentBalance" :total-incomes="overview.totalIncomes"
      :total-expenses="overview.totalExpenses" :savings-rate="overview.savingsRate"
      :total-income-percentage="overview.totalIncomePercentage"
      :total-expense-percentage="overview.totalExpensePercentage"
      :percentage-savings-rate="overview.percentageSavingsRate" :is-loading="isLoading" />

    <!--Chart-->
    <DashboardCharts :is-loading="isLoading" />
    <div v-if="isLoading" class="mt-4 skeleton h-96 w-full"></div>
    <div v-else class="mt-4 p-6 ring-1 ring-inset ring-base-300 bg-white rounded-md w-[26rem] lg:w-full">
      <div class="flex justify-between items-center pb-6">
        <div>
          <h1 class="text-2xl font-bold">Recent Transactions</h1>
          <p class="text-gray-500">Your latest {{ transactionLength }} recent transactions</p>
        </div>
        <div>
          <button class="btn rounded-xl" @click="goTo('/transactions')">View All</button>
        </div>
      </div>
      <div class="overflow-auto">
        <table class="table">
          <!-- head -->
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in fiveRecentTransactions" v-if="transactions" :key="transaction.id">
              <td class="flex items-center gap-3">
                <component :is="getIconCategory(transaction.categoryIcon)" class="size-10 rounded-full badge " />
                <p>
                  {{ transaction.description }}
                </p>
              </td>
              <td class="font-medium" :class="[transaction.type == 'expense' ? 'text-red-600' : 'text-green-600']">
                {{ transaction.type == 'expense' ? '-' : '+' }}{{ transaction.amount }}
              </td>
              <td>{{ dayjs(transaction.date).format('MMMM D, YYYY') }}</td>
              <td>
                <p class="text-xs lg:text-sm badge badge-ghost rounded-full text-md font-medium">
                  {{ transaction.category }}
                </p>
              </td>
            </tr>
            <tr>
              <td colspan="6" class="text-center" v-if="transactions.length === 0">
                No recent transactions.
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
