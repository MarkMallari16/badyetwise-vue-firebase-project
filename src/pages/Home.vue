<script setup>
import DashboardOverview from "@/components/DashboardOverview.vue";
import DashboardCharts from "@/components/DashboardCharts.vue";
import DashboardNav from "@/components/DashboardNav.vue";
import DashboardNavBarRightSlot from "@/components/DashboardNavBarRightSlot.vue";
import AddTransactionModal from "@/components/modals/AddTransactionModal.vue";
import AddButtonModal from "@/components/OpenAddModalButton.vue";
import { useNavigation } from "@/composables/useNavigation";
import { collection, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { db } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";

const auth = getAuth();
const userId = auth.currentUser ? auth.currentUser.uid : null;

console.log("User ID:", userId);

const transactions = ref([]);
const budgets = ref([]);

let unsubscribeTransactions = null;
let unsubscribeBudgets = null;

const transactionsQuery = query(
  collection(db, "transactions"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
)
const budgetQuery = query(
  collection(db, "budgets"),
  where("userId", "==", userId)
)

onMounted(() => {
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

    console.log("Budgets:", budgets.value);
  })

})

onUnmounted(() => {
  if (unsubscribeTransactions) {
    unsubscribeTransactions();
  }
  if (unsubscribeBudgets) {
    unsubscribeBudgets();
  }
})


const showModal = () => {
  const modal = document.getElementById("add_transaction");
  if (modal) {
    modal.showModal();
  }
};

const fiveRecentTransactions = computed(() => {
  return transactions.value.slice(0, 5);
})

const overview = computed(() => {

  const totalIncomes = transactions.value
    .filter(transaction => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount || 0, 0)
  console.log("Total Incomes:", totalIncomes);
  const totalExpenses = transactions.value
    .filter(transaction => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount || 0, 0)

  const currentBalance = totalIncomes - totalExpenses;

  const savingRate = totalIncomes > 0 ? ((currentBalance / totalIncomes) * 100).toFixed(2) : 0;

  return {
    totalIncomes: totalIncomes,
    totalExpenses: totalExpenses,
    currentBalance: currentBalance,
    savingsRate: savingRate,
  }
})
// navigation composable
const { goTo } = useNavigation();

</script>

<template>
  <!--Overview-->
  <div
    class="lg:min-h-screen mx-4 my-2 px-4 lg:px-12 pb-10 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-inner rounded-2xl">
    <DashboardNav>
      <!--Right-->
      <DashboardNavBarRightSlot>
        <!--Add Transaction Button-->
        <AddButtonModal @click="showModal">Add Transaction</AddButtonModal>
        <AddTransactionModal />
      </DashboardNavBarRightSlot>
    </DashboardNav>

    <!--Overview---->
    <DashboardOverview :current-balance="overview.currentBalance" :total-incomes="overview.totalIncomes"
      :total-expenses="overview.totalExpenses" :savings-rate="overview.savingsRate" />
    <!--Chart-->
    <DashboardCharts />
    <div class="mt-4 p-6 ring-1 ring-inset ring-base-300 bg-white rounded-md">
      <div class="flex justify-between items-center pb-6">
        <div>
          <h1 class="text-2xl font-bold">Recent Transactions</h1>
          <p class="text-gray-500">Your latest 5 recent transactions</p>
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

                <span v-html="transaction.categoryIcon" class="size-10 rounded-full badge rind-1"></span>

                <p>
                  {{ transaction.description }}
                </p>
              </td>
              <td class="font-medium" :class="[transaction.type == 'expense' ? 'text-red-600' : 'text-green-600']">
                {{ transaction.type == 'expense' ? '-' : '+' }}{{ transaction.amount }}
              </td>
              <td>{{ transaction.date }}</td>
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
