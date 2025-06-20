<script setup>
import { currentUser } from '@/composables/useAuth';
import { db } from '@/firebase/firebase';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';

const userId = currentUser.value?.uid;
const categories = ref([]);
const loading = ref(false)

const props = defineProps({
    budgetId: {
        type: String,
        required: true
    }
})

console.log("User ID:", props.budgetId);

const form = ref({
    category: '',
    amount: null,
    timePeriod: 'monthly',
});
const queryCategories = collection(db, "users", userId, "categories");

let unsubscribeCategories = null;

watch(() => props.budgetId, async (budgetId) => {
    if (!budgetId) return;
    try {
        //create reference to the budget document
        const docRef = doc(db, "users", userId, "budgets", props.budgetId);
        //fetch the document data
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            form.value = {
                ...docSnap.data()
            }
        }
    } catch (error) {
        console.error("Error fetching budget data: ", error);
    }
})

onMounted(() => {
    unsubscribeCategories = onSnapshot(queryCategories, (snapshot) => {
        categories.value = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
    })
})
onUnmounted(() => {
    if (unsubscribeCategories) {
        unsubscribeCategories();
    }
})
const closeModal = () => {
    const modal = document.getElementById("update_budget");
    if (modal) {
        modal.close();
    }
}
const updateBudget = async () => {
    try {
        loading.value = true;

        const budgetRef = doc(db, "users", userId, "budgets", props.budgetId);
        const formData = {
            ...form.value,
            userId: userId,
            updatedAt: new Date().toISOString(),
        }

        await updateDoc(budgetRef, formData);
        loading.value = false;
    } catch (error) {
        console.error("Error updating budget:", error);
    } finally {
        closeModal();
    }
}
</script>

<template>
    <dialog id="update_budget" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <div>
                <div class="flex items-center gap-1">
                    <svg class="size-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14Z">
                        </path>
                    </svg>
                    <h3 class="text-lg font-bold">Update Current Budget</h3>
                </div>
                <p class="text-gray-500">
                    Update your budget to track your spending in a specific category.
                </p>
            </div>
            <!-- Form for adding a new budget -->
            <form @submit.prevent="updateBudget" method="post">
                <div class="mt-4 mb-4">
                    <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        @click="closeModal">
                        ✕
                    </button>
                </div>
                <div class="mb-4 w-full">
                    <div class="w-full">
                        <label for="category" class="font-medium">Category</label>
                        <select name="category" id="category" v-model="form.category"
                            class="select select-bordered w-full mt-2" required>
                            <option value="">Select Category</option>
                            <option v-for="category in categories.filter((c) => c.type === 'expense')"
                                :key="category.id" :value="category.name">
                                {{ category.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="flex items-center gap-3 w-full">
                    <div class="w-full">
                        <label for="amount" class="font-medium">Amount</label>
                        <input type="number" name="amount" v-model="form.amount" id="amount"
                            class="input input-bordered w-full mt-2" placeholder="0.00" required min="0" />
                    </div>
                    <div class="w-full">
                        <label for="period" class="font-medium">Time Period</label>
                        <select name="period" id="period" v-model="form.timePeriod"
                            class="select select-bordered w-full mt-2" required>
                            <option value="" selected disabled>Select Period</option>
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                </div>
                <div class="flex gap-2 modal-action">
                    <button type="button" @click="closeModal" class="btn">Close</button>
                    <button :disabled="loading" class="btn btn-primary" type="submit">
                        {{ loading ? "Updating..." : "Update Budget" }}
                    </button>
                </div>
            </form>
        </div>
    </dialog>
</template>