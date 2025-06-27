<script setup>
import { db } from "@/firebase/firebase";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { computed, onMounted, onUnmounted, reactive, ref, watch, watchEffect } from "vue";
import IconGoal from "../icons/IconGoal.vue";
import { currentUser } from "@/composables/useAuth";

const userId = currentUser.value?.uid;

const categories = ref([]);
const budgets = ref([]);
const loading = ref(false);

const categoriesQuery = collection(db, "users", userId, "categories");
const budgetsQuery = collection(db, "users", userId, "budgets");

// Reactive form data
const form = reactive({
  amount: null,
  category: "",
  timePeriod: "monthly",
});

// Form error messages
const errors = reactive({
  amount: null,
  category: null,
  timePeriod: null,
})

// Watch for changes in form inputs to reset error messages
watch(() => [form.amount, form.category, form.timePeriod], ([amount, category, timePeriod]) => {
  if (amount) errors.amount = null;
  if (category) errors.category = null;
  if (timePeriod) errors.timePeriod = null;
})


const validateForm = () => {
  let isValid = true;

  if (!form.amount || form.amount <= 0) {
    errors.amount = "Please enter a valid amount.";
    isValid = false;

  }

  if (!form.category) {
    errors.category = "Please select a category.";
    isValid = false;
  }

  if (categoryNotExistsInBudgets.value.length === 0) {
    errors.value.category = "You must create a category before adding a budget."
    isValid = false;
  }
  return isValid;
}


let unsubscribeCategories = null;
let unsubscribeBudgets = null;

onMounted(() => {
  if (!userId) return;
  // Fetch categories and budgets from Firestore
  unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
    categories.value = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    })
    console.log("Categories fetched:", categories.value);
  }, (error) => {
    console.error("Error fetching categories:", error);
  });

  unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
    budgets.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  }, (error) => {
    console.error("Error fetching budgets:", error);
  });

})
const categoryNotExistsInBudgets = computed(() => {
  const categoryExpenses = categories.value
    .filter(c => c.type === "expense")
    .map(c => c.name);

  const budgetCategories = budgets.value.map(b => b.category);

  const notExistsCategories = categoryExpenses.filter(category => !budgetCategories.includes(category));
  return notExistsCategories;
})

//unmount the listeners when the component is destroyed
onUnmounted(() => {
  if (unsubscribeCategories) {
    unsubscribeCategories();
  }

  if (unsubscribeBudgets) {
    unsubscribeBudgets();
  }
})

const submitForm = async () => {

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const budgetRef = collection(db, "users", userId, "budgets")

    const formData = {
      ...form,
      categoryId: categories.value.find(c => c.name === form.category)?.id || null,
      createdAt: new Date().toISOString(),
    };

    await addDoc(budgetRef, formData);

    loading.value = false;
    console.log("Budget added successfully:", formData);
  } catch (error) {
    console.error("Error adding budget:", error);
  } finally {
    loading.value = false;
    resetForm();
    closeModal();
  }
};

const resetForm = () => {
  // Reset form data
  form.amount = null;
  form.category = "";
  form.timePeriod = "monthly";

  // Reset error messages
  errors.amount = null;
  errors.category = null;;
  errors.timePeriod = null;
};

const closeModal = () => {
  const modal = document.getElementById("add_budget");
  if (modal) {
    modal.close();
  }
};

</script>
<template>
  <dialog ref="add_budget" id="add_budget" class="modal">
    <div class="modal-box w-11/12 max-w-2xl">
      <div>
        <div class="flex items-center gap-1">
          <component :is="IconGoal" class="size-8" />
          <h3 class="text-lg font-bold">Create New Budget</h3>
        </div>
        <p class="text-gray-500">
          Set up a new budget to track your spending in a specific category.
        </p>
      </div>
      <!-- Form for adding a new budget -->
      <form @submit.prevent="submitForm" method="post">
        <div class="mt-4 mb-4">
          <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
            ✕
          </button>
        </div>
        <div class="mb-4 w-full">
          <div class="w-full">
            <label for="category" class="font-medium">Category</label>
            <select name="category" id="category" v-model="form.category" class="select select-bordered w-full mt-2"
              :class="[errors.category ? 'select-error' : '']">
              <option value="">Select Category</option>
              <option v-for="(category, index) in categoryNotExistsInBudgets" :key="index" :value="category">
                {{ category }}
              </option>
            </select>
            <p class="text-sm mt-1 text-red-600" v-if="errors.category">{{ errors.category }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full">
          <div class="w-full">
            <label for="amount" class="font-medium">Budget Limit</label>
            <input type="number" name="amount" v-model="form.amount" id="amount"
              class="input input-bordered w-full mt-2" :class="[errors.amount ? 'input-error' : '']"
              placeholder="0.00" />
          </div>
          <div class="w-full">
            <label for="period" class="font-medium">Time Period</label>
            <select name="period" id="period" v-model="form.timePeriod" class="select select-bordered w-full mt-2 pb-1">
              <option value="" selected disabled>Select Period</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
        <p class="text-sm mt-1 text-red-600" v-if="errors.amount">{{ errors.amount }}</p>

        <div class="flex gap-2 modal-action">
          <button type="button" @click="closeModal" class="btn btn-ghost rounded-md">Close</button>
          <button :disabled="loading" class="btn btn-primary rounded-md" type="submit">
            {{ loading ? "Creating..." : "Create Budget" }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>
