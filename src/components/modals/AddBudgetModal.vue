<script setup>
import { db } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { onMounted, onUnmounted, ref, watch } from "vue";
import IconGoal from "../icons/IconGoal.vue";

const auth = getAuth();
const userId = auth.currentUser?.uid;

const categories = ref([]);
const loading = ref(false);

const categoriesQuery = collection(db, "users", userId, "categories");

const form = ref({
  amount: null,
  category: "",
  timePeriod: "monthly",
});

const errorMessages = ref({
  amount: null,
  category: null,
  timePeriod: null,
})

// Watch for changes in form inputs to reset error messages
watch(() => [form.value.amount, form.value.category, form.value.timePeriod], ([amount, category, timePeriod]) => {
  if (amount) errorMessages.value.amount = null;
  if (category) errorMessages.value.category = null;
  if (timePeriod) errorMessages.value.timePeriod = null;
})

let unsubscribeCategories = null;

const validateForm = () => {
  let isValid = true;

  if (!form.value.amount || form.value.amount <= 0) {
    errorMessages.value.amount = "Please enter a valid amount.";
    isValid = false;

  }

  if (!form.value.category) {
    errorMessages.value.category = "Please select a category.";
    isValid = false;
  }


  return isValid;
}

onMounted(() => {
  unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
    categories.value = snapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      }
    })
  })
})

onUnmounted(() => {
  if (unsubscribeCategories) {
    unsubscribeCategories();
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
      ...form.value,
      categoryId: categories.value.find((c) => c.name === form.value.category)?.id || null,
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

    errorMessages.value = {
      amount: null,
      category: null,
      timePeriod: null,
    };
  }
};

const resetForm = () => {
  form.value = {
    totalAmount: null,
    timePeriod: "monthly",
  };
};

const closeModal = () => {
  const modal = document.getElementById("add_budget");
  if (modal) {
    modal.close();
  }
};
</script>
<template>
  <dialog id="add_budget" class="modal">
    <div class="modal-box w-11/12 max-w-2xl">
      <div>
        <div class="flex items-center gap-1">
          <component :is="IconGoal" class="size-8"/>
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
              :class="[errorMessages.category ? 'select-error' : '']">
              <option value="">Select Category</option>
              <option v-for="category in categories.filter((c) => c.type === 'expense')" :key="category.id"
                :value="category.name">
                {{ category.name }}
              </option>
            </select>
            <p class="text-sm mt-1 text-red-600" v-if="errorMessages.category">{{ errorMessages.category }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 w-full">
          <div class="w-full">
            <label for="amount" class="font-medium">Budget Limit</label>
            <input type="number" name="amount" v-model="form.amount" id="amount"
              class="input input-bordered w-full mt-2" :class="[errorMessages.amount ? 'input-error' : '']"
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
        <p class="text-sm mt-1 text-red-600" v-if="errorMessages.amount">{{ errorMessages.amount }}</p>

        <div class="flex gap-2 modal-action">
          <button type="button" @click="closeModal" class="btn">Close</button>
          <button :disabled="loading" class="btn btn-primary" type="submit">
            {{ loading ? "Creating..." : "Create Budget" }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>
