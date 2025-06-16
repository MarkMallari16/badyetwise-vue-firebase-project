<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import DashboardNav from "@/components/DashboardNav.vue";
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase/firebase";
import DashboardNavBarRightSlot from "@/components/DashboardNavBarRightSlot.vue";
import AddTransactionModal from "@/components/modals/AddTransactionModal.vue";
import OpenAddModalButton from "@/components/OpenAddModalButton.vue";
import UpdateTransactionModal from "@/components/modals/UpdateTransactionModal.vue";
import dayjs from "dayjs";

const auth = getAuth();
const userId = auth.currentUser ? auth.currentUser.uid : null;

// Reactive references for categories and transactions
const categories = ref([]);
const transactions = ref([]);

//selectedTransaction
const selectedTransactionId = ref(null);

// Fetch categories from the "categories" collection
const transactionFilterings = ref({
  search: "",
  type: "",
  category: "",
});

//Fetch transactions from the "transactions" collection
const transactionQuery = query(
  collection(db, "transactions"),
  where("userId", "==", userId),
  orderBy("createdAt", "desc")
);
// Fetch transactions from the "categories" collection
const categoriesQuery = query(
  collection(db, "categories"),
  where("userId", "==", userId)
);

let unsubscribeTransactions = null;
let unsubscribeCategories = null;

onMounted(() => {
  //Fetch transactions from the "transactions" collection
  unsubscribeTransactions = onSnapshot(transactionQuery, (snapshot) => {
    transactions.value = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
  });

  //Fetch categories from the "categories" collection
  unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
    categories.value = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
  });
})

// Clean up the listeners when the component is unmounted
onUnmounted(() => {
  if (unsubscribeTransactions) {
    unsubscribeTransactions();
  }
  if (unsubscribeCategories) {
    unsubscribeCategories();
  }
});

// This computed property filters transactions based on the search input
const filteredTransactions = computed(() => {
  const { search, type, category } = transactionFilterings.value;
  return transactions.value
    .filter((transaction) => {
      const matchesType = !type || transaction.type.toLowerCase() === type;
      const matchesCategory = !category || transaction.category.toLowerCase() === category.toLowerCase();

      return matchesType && matchesCategory;
    })
    .filter((transaction) => {
      const query = search.toLowerCase();
      return (
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query) ||
        transaction.paymentMethod.toLowerCase().includes(query) ||
        transaction.date.toLowerCase().includes(query) ||
        transaction.amount.toString().includes(query)
      );
    });
});


// This computed property filters categories based on the selected type
const filteredCategories = computed(() => {
  const { type } = transactionFilterings.value;
  return type === "" ? categories.value : categories.value.filter(c => c.type === type);
})

// Reset category when type changes
watch(() => transactionFilterings.value.type, () => {
  transactionFilterings.value.category = "";
})

// Function to delete a transaction by its ID
const deleteTransaction = async (transactionId) => {
  try {
    await deleteDoc(doc(db, "transactions", transactionId));
    console.log("Transaction deleted successfully");
  } catch (error) {
    console.error("Error deleting transaction: ", error);
  }
};

const showAddModal = () => {
  const modal = document.getElementById("add_transaction");

  if (modal) {
    modal.showModal();
  }
};

const showUpdateModal = (id) => {
  selectedTransactionId.value = id;
  const modal = document.getElementById("update_transaction");
  if (modal && selectedTransactionId.value) {
    modal.showModal();
  }
}

</script>

<template>

  <div
    class="min-h-screen mx-4 my-2 px-4 lg:px-12 pb-10 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-lg rounded-2xl">
    <DashboardNav>
      <DashboardNavBarRightSlot>
        <OpenAddModalButton @click="showAddModal">Add Transaction</OpenAddModalButton>
        <!--Modal-->
        <AddTransactionModal />
        <!--Update Transaction Modal-->
        <UpdateTransactionModal :transactionId="selectedTransactionId" />

      </DashboardNavBarRightSlot>
    </DashboardNav>
    <h1 class="text-3xl font-bold">All Transactions</h1>
    <div class="w-full mt-6 bg-white rounded-lg ring-1 ring-inset ring-base-300 p-5">
      <h2 class="text-xl font-medium">Filters</h2>
      <p class="text-gray-500">Search and filter your transactions</p>

      <div class="flex items-center flex-wrap md:flex-wrap lg:justify-between lg:flex-nowrap lg:gap-5 mt-2 lg:mt-3">
        <!--Search Field-->
        <div class="w-full relative">
          <input type="text" class="input input-bordered pl-12 w-full" placeholder="Search..."
            v-model="transactionFilterings.search" />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
            class="size-5 absolute left-4 top-4 text-gray-500">
            <path fill-rule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clip-rule="evenodd" />
          </svg>
        </div>

        <div class="flex items-center lg:justify-end gap-3 mt-2 lg:mt-0 ">
          <!--Types-->
          <div>
            <select class="select select-bordered " v-model="transactionFilterings.type">
              <option value="">All Type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div>
            <!--Categories-->
            <select class="select select-bordered " v-model="transactionFilterings.category">
              <option value="">All Categories</option>
              <option v-for="category in filteredCategories" :value="category.name" :key="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!--Transaction History-->
    <div
      class="w-[27rem] sm:w-[41rem] md:w-full lg:w-full mt-3 rounded-lg bg-white ring-1 ring-inset ring-base-300 p-5 ">
      <div class="mb-4">
        <h2 class="text-xl font-medium ">Transaction History</h2>
        <p class="text-gray-500">Complete list of your financial transactions</p>
      </div>
      <div class="rounded-box bg-base-100 overflow-auto">
        <table class="table w-full ">
          <!-- head -->
          <thead>
            <tr>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Payment Method</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions ? filteredTransactions : transactions" :key="transaction.id"
              v-if="transactions" class="hover:bg-gray-100 transition-colors duration-200">
              <td class="flex justify-start items-center gap-3 p-5">
                <div v-html="transaction.categoryIcon"
                  class="size-[44px] lg:size-10 rounded-full badge rind-1 bg-gray-100"></div>
                <span class="text-sm">{{ transaction.description }}</span>
              </td>

              <td>{{ transaction.type }}</td>
              <td>{{ transaction.amount }}</td>
              <td>{{ dayjs(transaction.date).format('MMMM D, YYYY') }}</td>
              <td>
                <p class="badge badge-ghost rounded-full text-md font-medium">
                  {{ transaction.category }}
                </p>
              </td>
              <td>{{ transaction.paymentMethod }}</td>
              <td>
                {{
                  transaction.notes && transaction.notes.length > 0
                    ? transaction.notes
                    : "No notes"
                }}
              </td>
              <!-- Dropdown for actions -->
              <td class="dropdown dropdown-left">
                <div tabindex="0">
                  <div role="button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" class="size-5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </div>
                  <ul tabindex="0"
                    class="dropdown-content dropdown-top menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li>
                      <button @click="showUpdateModal(transaction.id)" class="font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                          stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                        Edit
                      </button>
                      <button @click="deleteTransaction(transaction.id)" class="text-red-500 font-medium">
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
              </td>
            </tr>
            <tr>
              <td colspan="6" class="text-center" v-if="transactions.length === 0 || filteredTransactions.length === 0">
                No transactions found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--Pagination-->
      <div
        class="mt-4 flex flex-col lg:flex-row items-center lg:items-center  flex-wrap lg:justify-between gap-5 lg:gap-0">
        <div class="flex items-center gap-2 flex-wrap">
          <p class="text-gray-500">Showing 1 to 10 of</p>
          <select name="transactionSelection" id="transactionSelection" class="select select-bordered w-20">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <p class="text-gray-500 h-5">20 transactions</p>
        </div>

        <div class="join gap-2">
          <button class="join-item btn">Previous</button>
          <button class="join-item btn">1</button>
          <button class="join-item btn">2</button>
          <button class="join-item btn">3</button>
          <button class="join-item btn">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>
