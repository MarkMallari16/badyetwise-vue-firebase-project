<script setup>
import OpenAddModalButton from "@/components/OpenAddModalButton.vue";
import DashboardNav from "@/components/DashboardNav.vue";
import DashboardNavBarRightSlot from "@/components/DashboardNavBarRightSlot.vue";
import AddBudgetModal from "@/components/modals/AddBudgetModal.vue";
import { collection, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { db } from "@/firebase/firebase";
import { getStatusIcon, getStatusClass } from "@/helpers/statusHelper";
import UpdateBudgetModal from "@/components/modals/UpdateBudgetModal.vue";
import { currentUser } from "@/composables/useAuth";

const isFetching = ref(true);
const userId = currentUser.value?.uid;

const transactions = ref([]);
const budgets = ref([]);
const selectedBudgetId = ref(null);


let unsubscribeTransactions;
let unsubscribeBudgets;

onMounted(() => {
  if (!userId) return;

  const transactionsqQuery = collection(db, "users", userId, "transactions");
  const budgetsQuery = collection(db, "users", userId, "budgets");

  unsubscribeTransactions = onSnapshot(transactionsqQuery, (snapshot) => {
    transactions.value = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
  }, (error) => {
    console.log("transactions listener error.", error);
  });

  unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
    budgets.value = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
  }, (error) => {
    console.error("budgets listener error.", error);
  });

  isFetching.value = false;
})

onUnmounted(() => {
  if (unsubscribeTransactions) {
    unsubscribeTransactions();
  }
  if (unsubscribeBudgets) {
    unsubscribeBudgets();
  }
})

const budgetSummaries = computed(() => {
  return budgets.value.map((budget) => {
    const relatedTransactions = transactions.value.filter((transaction) =>
      transaction.categoryId === budget.categoryId && transaction.type === "expense");

    const totalSpent = relatedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const percentageUsed = ((totalSpent / budget.amount) * 100).toFixed(2);
    const amountLeft = budget.amount - totalSpent;
    const progressStatusClass = totalSpent > budget.amount ? 'text-red-600' : '';

    let statusMessasge = "No budget set";

    if (totalSpent > budget.amount) {
      statusMessasge = "Over Budget";
    } else if (totalSpent === budget.amount) {
      statusMessasge = "At Limit"
    } else {
      statusMessasge = "On Track";
    }

    return {
      ...budget,
      totalSpent,
      percentageUsed,
      amountLeft,
      status: statusMessasge,
      progressStatusClass: progressStatusClass
    };
  });
});
const isLoading = computed(() => isFetching.value);

// Calculate total budget across all budgets
const totalOverviewBudget = computed(() => {
  return budgets.value.reduce((sum, budget) => sum + budget.amount, 0);
})
// Calculate total spent across all transactions
const totalOverviewSpent = computed(() => {
  return transactions.value.filter(t => t.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
})
// Calculate remaining budget
const remainingOverviewBudget = computed(() => {
  return totalOverviewBudget.value - totalOverviewSpent.value;
})

const percentageOverviewUsed = computed(() => {
  if (totalOverviewBudget.value === 0) return 0;

  return ((totalOverviewSpent.value / totalOverviewBudget.value) * 100).toFixed(2);
})
const deleteBudget = async (budgetId) => {
  try {
    const budgetRef = doc(db, "users", userId, "budgets", budgetId);
    await deleteDoc(budgetRef);
  } catch (error) {
    console.error("Error deleting budget:", error);
  }
};
const showModal = () => {
  const modal = document.getElementById("add_budget");
  if (modal) {
    modal.showModal();
  }
};

const showUpdateModal = (id) => {
  selectedBudgetId.value = id;
  const modal = document.getElementById("update_budget");
  if (modal && selectedBudgetId.value) {
    modal.showModal();
  }
}


</script>
<template>

  <section
    class="min-h-screen mx-4 my-2 px-4 lg:px-12 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-inner rounded-2xl">
    <DashboardNav>
      <DashboardNavBarRightSlot>
        <OpenAddModalButton @click="showModal">Create Budget</OpenAddModalButton>
        <!-- Add Budget Modal -->
        <AddBudgetModal />
        <!-- Update Budget Modal -->
        <UpdateBudgetModal :budgetId="selectedBudgetId" />
      </DashboardNavBarRightSlot>
    </DashboardNav>


    <div>
      <!-- Budget Overview -->
      <h1 class="text-3xl font-bold">Your Budget</h1>
      <div v-if="isLoading" class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
        <div class="skeleton h-36 w-full" v-for="item in 3" :key="item"></div>

      </div>
      <div v-else class="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
        <div class="rounded-md p-6 ring-1 ring-inset ring-base-300 bg-white">
          <h2 class="mt-2 text-md font-medium">Total Budget</h2>
          <h1 class="mt-1 text-3xl font-bold">₱{{ totalOverviewBudget }}</h1>
          <p class="text-gray-500">This Month</p>
        </div>
        <div class="rounded-md p-6 ring-1 ring-inset ring-base-300 bg-white">
          <h2 class="mt-2 text-md font-medium">Total Spent</h2>
          <h1 class="mt-1 text-3xl font-bold text-red-600">₱{{ totalOverviewSpent }}</h1>
          <p class="text-gray-500">{{ percentageOverviewUsed }}% of budget</p>
        </div>
        <div class="rounded-md p-6 ring-1 ring-inset ring-base-300 bg-white">
          <h2 class="mt-2 text-md font-medium">Remaining</h2>
          <h1 class="mt-1 text-3xl font-bold"
            :class="[remainingOverviewBudget < 0 ? 'text-red-600' : 'text-green-600']">
            ₱{{ remainingOverviewBudget }}</h1>
          <p class="text-gray-500">Available to spend</p>
        </div>
      </div>
      <!-- Budget Categories -->
      <div class="mt-6 ring-1 ring-inset ring-base-300 bg-white pt-6 px-6 pb-10 rounded-lg">
        <h1 class="text-2xl font-bold">Budget Categories</h1>
        <p class="text-gray-500">Track your spending by category</p>
        <!--Skeleton Loading-->
        <div v-if="isLoading" v-for="item in 4" :key="item" class="skeleton mt-6 h-24 w-full">
        </div>
        <div v-else v-for="summary in budgetSummaries" :key="summary.id" class="pt-6">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <component :is="getStatusIcon(summary.status)" />
              <div>
                <h3 class="font-medium text-xl">{{ summary.category }}</h3>
                <p class="text-sm text-gray-600">₱{{ summary.totalSpent }} used of ₱{{ summary.amount }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2 ">
              <p class="badge rounded-full text-sm font-medium" :class="getStatusClass(summary.status)">
                {{ summary.status }}
              </p>

              <!-- Dropdown for actions -->
              <div class="dropdown dropdown-left dropdwn-center z-10">
                <button class="btn-ghost p-0 hover:bg-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </button>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button @click="showUpdateModal(summary.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Edit
                    </button>
                  </li>
                  <li class="text-red-600">
                    <button @click="deleteBudget(summary.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <progress class="progress w-full h-4 rounded-full " :class="summary.progressStatusClass"
            :value="summary.totalSpent" :max="summary.amount"></progress>

          <div class="text-gray-600 flex justify-between">
            <p>{{ summary.percentageUsed }}% used</p>
            <p>₱{{ summary.amountLeft }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
