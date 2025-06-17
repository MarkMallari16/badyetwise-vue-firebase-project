<script setup>
import DashboardNav from "../components/DashboardNav.vue";
import DashboardNavBarRightSlot from "@/components/DashboardNavBarRightSlot.vue";
import OpenAddModalButton from "@/components/OpenAddModalButton.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import AddCategoryModal from "@/components/modals/AddCategoryModal.vue";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import UpdateCategoryModal from "@/components/modals/UpdateCategoryModal.vue";
import { currentUser } from "@/composables/useAuth";

const tab = ref("expense");
const categories = ref([]);
const transactions = ref([]);
const budgets = ref([]);

//selectedCategoryId is used to store the id of the category that is being updated
const selectedCategoryId = ref(null);
const categoriesQuery = query(
  collection(db, "categories"),
  where("userId", "==", currentUser.value?.uid),
  orderBy("createdAt", "desc")
)

const transactionsQuery = query(
  collection(db, "transactions"),
  where("userId", "==", currentUser.value?.uid)
)

const budgetsQuery = query(
  collection(db, "budgets"),
  where("userId", "==", currentUser.value?.uid)
)

// Computed properties to filter categories by type
const categoriesExpenses = computed(() => {
  return categories.value.filter(category => category.type === "expense")
})
const categoriesIncomes = computed(() => {
  return categories.value.filter(category => category.type === "income")
})
// Computed property to summarize expenses by category
const categoryExpenseSummaries = computed(() => {
  return categoriesExpenses.value.map(category => {
    const relatedTransactions = transactions.value.filter(transaction => transaction.categoryId === category.id);

    const numberOfTransactions = relatedTransactions.length;
    const totalSpent = relatedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalBudget = budgets.value.find(budget => budget.categoryId === category.id)?.amount || 0;
    const percentageBudgetUsed = totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(2) : 0;
    const amountLeft = totalBudget - totalSpent;

    return {
      ...category,
      numberOfTransactions,
      totalSpent: totalSpent,
      totalBudget: totalBudget,
      percentageBudgetUsed: percentageBudgetUsed,
      amountLeft: amountLeft,
    }
  })
})
const categoryIncomeSummaries = computed(() => {
  return categoriesIncomes.value.map(category => {
    const relatedTransactions = transactions.value.filter(transaction => transaction.categoryId === category.id);
    const numberOfTransactions = relatedTransactions.length;
    const totalAmount = relatedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const incomeStatus = totalAmount > 0 ? '+' : '';

    return {
      ...category,
      numberOfTransactions,
      totalAmount: totalAmount,
      incomeStatus
    }

  })
})


let unsubscribeCategories = null;
let unsubscribeTransactions = null;
let unsubscribeBudgets = null;

onMounted(() => {
  unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
    categories.value = snapshot.docs
      .filter((doc) => doc.data().userId === currentUser.value?.uid)
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
  });
  unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
    transactions.value = snapshot.docs
      .filter((doc) => doc.data().userId === currentUser.value?.uid)
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
  });
  unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
    budgets.value = snapshot.docs
      .filter((doc) => doc.data().userId === currentUser.value?.uid)
      .map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
  });
})

onUnmounted(() => {
  if (unsubscribeCategories) {
    unsubscribeCategories();
  }
  if (unsubscribeTransactions) {
    unsubscribeTransactions();
  }
  if (unsubscribeBudgets) {
    unsubscribeBudgets();
  }
})

//handle delete category
const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, "categories", categoryId));
  } catch (error) {
    console.error("Error deleting category:", error);
  }
};

console.log(categories.value);

const showModal = () => {
  const modal = document.getElementById("add_category");
  if (modal) {
    modal.showModal();
  } else {
    console.log("Modal not shown");
  }
};

const showUpdateModal = (id) => {
  const modal = document.getElementById("update_category");
  selectedCategoryId.value = id;
  if (modal && selectedCategoryId.value) {
    modal.showModal();
  }
}

</script>

<template>
  <!--Modal-->
  <AddCategoryModal />
  <UpdateCategoryModal :categoryId="selectedCategoryId" />
  <div
    class="min-h-screen text-nowrap mx-4 my-2 px-4 lg:px-12 pb-10 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-lg rounded-2xl">
    <div>
      <!--Top-->
      <DashboardNav>
        <DashboardNavBarRightSlot>
          <OpenAddModalButton @click="showModal">Add Category</OpenAddModalButton>
        </DashboardNavBarRightSlot>
      </DashboardNav>

      <!--Title-->
      <h1 class="text-3xl font-bold">Manage Categories</h1>

      <div class="w-full mt-4 bg-gray-100 rounded-xl flex justify-center items-center gap-2 px-2 py-2">
        <button class="btn w-1/2 rounded-lg" :class="[tab === 'expense' ? 'btn-primary' : 'btn-ghost']"
          @click="tab = 'expense'">
          Expense
        </button>
        <button class="btn w-1/2 rounded-lg" :class="[tab === 'income' ? 'btn-primary' : 'btn-ghost']"
          @click="tab = 'income'">
          Income
        </button>
      </div>
      <div class="w-full ">
        <div v-if="tab === 'expense'">
          <h2 class="text-2xl font-semibold mt-4">Expense Categories</h2>

          <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!--Card Expense-->
            <div v-for="category in categoryExpenseSummaries.filter(c => c.type == 'expense')" :key="category.id"
              class="relative p-8 ring-1 ring-inset ring-gray-300 rounded-lg shadow-sm">
              <div class="relative flex justify-between  items-center ">
                <div class="flex items-center gap-3 ">
                  <span v-html="category.icon" class="size-11 p-2 text-white rounded-lg" :class="category.color"></span>
                  <div>
                    <h3 class="font-medium text-lg">{{ category.name }}</h3>
                    <p class="text-gray-600">{{ category.numberOfTransactions }} transactions</p>
                  </div>
                </div>

                <div class="dropdown dropdown-bottom">
                  <div tabindex="0" role="button" class="btn-ghost p-0 hover:bg-transparent">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="size-6  ">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </div>
                  <!--Dropdown-->
                  <ul tabindex="0"
                    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 z-10 absolute -left-48 "
                    popover>
                    <li>
                      <button @click="showUpdateModal(category.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit
                      </button>
                    </li>
                    <li>
                      <button @click="deleteCategory(category.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="size-6 text-red-600">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>

              </div>
              <div class="pt-2 flex justify-between">
                <p>Spent: ₱{{ category.totalSpent }}</p>
                <p>Budget: ₱{{ category.totalBudget }}</p>
              </div>
              <div>
                <progress class="progress" :value="category.totalSpent" :max="category.totalBudget"></progress>
                <div class="pt-1 flex justify-between text-sm text-gray-500">
                  <p>{{ category.percentageBudgetUsed }}% of budget used</p>
                  <p>₱{{ category.amountLeft }} remaining</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <h2 class="text-2xl font-semibold mt-4">Income Categories</h2>
          <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!--Income Card-->
            <div v-for="category in categoryIncomeSummaries" :key="category.id"
              class="relative p-8 ring-1 ring-inset ring-gray-300 rounded-lg shadow-sm">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <span v-html="category.icon" class="size-11 p-2 text-white rounded-lg" :class="category.color"></span>
                  <div>
                    <h3 class="font-medium text-lg">{{ category.name }}</h3>
                    <p class="text-gray-600">{{ category.numberOfTransactions }} transactions</p>
                  </div>
                </div>
                <!--Dropdown for actions-->
                <div class="dropdown dropdown-end dropdown-bottom z-10">
                  <div tabindex="0" role="button" class="m-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="size-6">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </div>
                  <!--Dropdown-->
                  <ul tabindex="0"
                    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 max-h-60 z-10 absolute -left-48"
                    popover popout>
                    <li>
                      <button @click="showUpdateModal(category.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit
                      </button>
                    </li>
                    <li>
                      <button @click="deleteCategory(category.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="size-6 text-red-600">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="pt-2">
                <p class="text-3xl font-bold" :class="[category.totalAmount > 0 ? 'text-green-600' : 'text-neutral']">
                  {{ category.incomeStatus }}{{ category.totalAmount }}</p>
              </div>
              <div class="pt-2">
                <p class="badge rounded-full bg-gray-100 font-medium">This month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
