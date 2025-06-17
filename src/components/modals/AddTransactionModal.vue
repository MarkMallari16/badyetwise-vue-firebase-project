<script setup>
import { db } from "@/firebase/firebase";
import { doc, addDoc, collection, onSnapshot, query, where } from "firebase/firestore";
import { onMounted, onUnmounted, ref } from "vue";
import { getAuth } from "firebase/auth";
const loading = ref(false);

const form = ref({
  type: "income",
  amount: null,
  date: "",
  description: "",
  categoryIcon: "",
  category: "",
  paymentMethod: "Cash",
  notes: "",
});

const resetForm = () => {
  form.value = {
    type: "income",
    amount: null,
    date: "",
    description: "",
    categoryIcon: "",
    category: "",
    paymentMethod: "Cash",
    notes: "",
  };
};
const categories = ref([]);

const auth = getAuth();
const userId = auth.currentUser ? auth.currentUser.uid : null;

const categoriesQuery = query(
  collection(db, "categories"),
  where("userId", "==", userId)
);

let unsubscribeCategories = null;

// Fetch categories from the "categories" collection
onMounted(() => {
  unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
    categories.value = snapshot.docs.map((doc) => {
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
})

const submitForm = async () => {
  const auth = getAuth();

  try {
    loading.value = true;
    //const userRef = doc(db, "users", auth.currentUser.uid);
    const formData = {
      ...form.value,
      userId: auth.currentUser.uid,
      categoryIcon: categories.value.find((c) => c.name === form.value.category)?.icon || null,
      categoryId:
        categories.value.find((c) => c.name === form.value.category)?.id || null,
      createdAt: new Date(),
    };
    await addDoc(collection(db, "transactions"), formData);
    loading.value = false;
    resetForm();
  } catch (error) {
    console.error("Error adding document: ", error);
  } finally {
    closeModal();
  }
};

const closeModal = () => {
  const modal = document.getElementById("add_transaction");
  if (modal) {
    modal.close();
    loading.value = false;
    resetForm();
  }
};
</script>
<template>
  <dialog id="add_transaction" class="modal">
    <div class="modal-box w-11/12 max-w-2xl">
      <h3 class="text-lg font-bold">Add New Transaction</h3>
      <p class="text-gray-500">Enter the details of your transaction below.</p>
      <div>
        <form @submit.prevent="submitForm" method="post">
          <div class="mt-4 mb-10">
            <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
              ✕
            </button>
            <p class="font-medium">Transaction Type</p>
            <div class="flex items-center gap-2 mt-2">
              <div class="flex items-center gap-2">
                <input id="income" type="radio" name="type" value="income" v-model="form.type"
                  class="radio radio-primary radio-sm" checked />
                <label for="income" class="font-sans">Income</label>
              </div>
              <div class="flex items-center gap-2">
                <input id="expense" type="radio" name="type" value="expense" v-model="form.type"
                  class="radio radio-primary radio-sm" />
                <label for="expense" class="font-sans">Expense</label>
              </div>
            </div>
            <div class="flex items-center gap-5 mt-4 w-full">
              <div class="w-full">
                <label for="amount" class="font-medium mt-2">Amount</label>
                <input id="amount" type="number" name="amount" placeholder="Enter Amount" v-model="form.amount" required
                  class="mt-2 input input-bordered w-full" min="0" />
              </div>

              <div class="w-full">
                <label for="date" class="font-medium">Date</label>
                <input type="date" name="date" v-model="form.date" required class="mt-2 input input-bordered w-full" />
              </div>
            </div>
            <div class="mt-4">
              <label for="description" class="font-medium">Description</label>
              <input type="text" name="description" v-model="form.description" placeholder="Enter Description" required
                class="input mt-2 input-bordered w-full" />
            </div>
            <div class="mt-4">
              <div class="w-full flex items-center gap-5">
                <div class="w-full">
                  <p class="font-medium mb-2">Category</p>
                  <select class="select select-bordered w-full" name="category" v-model="form.category">
                    <option value="" selected disabled>Select Category</option>
                    <option v-for="category in categories.filter((c) => c.type === form.type)" :key="category.id"
                      :value="category.name">
                      {{ category.name }}
                    </option>
                  </select>
                </div>
                <div class="w-full">
                  <p class="font-medium mb-2">Payment Method</p>
                  <select class="select select-bordered w-full" name="payment_method" v-model="form.paymentMethod">
                    <option disabled>Select Payment Method</option>
                    <option selected>Cash</option>
                    <option>GCash</option>
                    <option>PayPal</option>
                    <option>Paymaya</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div class="mt-4">
                <label for="notes" class="font-medium">Notes <span
                    class="text-gray-500 font-normal">(optional)</span></label>
                <textarea id="notes" name="notes" v-model="form.notes" placeholder="Enter any additional notes"
                  class="textarea textarea-bordered w-full mt-2"></textarea>
              </div>
            </div>
          </div>
          <div class="flex gap-2 modal-action">
            <button type="button" @click="closeModal" class="btn">Close</button>
            <button :disabled="loading" class="btn btn-primary" type="submit">
              {{ loading ? "Adding..." : "Add Transaction" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>
