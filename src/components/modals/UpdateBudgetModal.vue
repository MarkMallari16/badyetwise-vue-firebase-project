<script setup>
import { currentUser } from '@/composables/useAuth';
import { db } from '@/firebase/firebase';
import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import IconGoal from '../icons/IconGoal.vue';

const userId = currentUser.value?.uid;
const categories = ref([]);
const loading = ref(false)

const props = defineProps({
    budgetId: {
        type: String,
        required: true
    }
})

const form = ref({
    amount: null,
    timePeriod: 'monthly',
});
const errors = ref({
    amount: null,
    timePeriod: null
})

const validateForm = () => {
    let isValid = true;

    if (!form.value.amount || form.value.amount <= 0) {
        errors.value.amount = "Please enter valid amount.";
        isValid = false;
    }

    if (!form.value.timePeriod) {
        errors.timePeriod = "Please select a time period."
    }

    return isValid;
}
watch(() => props.budgetId, async (budgetId) => {
    if (!budgetId) return;

    try {
        //create reference to the budget document
        const budgetRef = doc(db, "users", userId, "budgets", props.budgetId);
        //fetch the document data
        const docSnap = await getDoc(budgetRef);

        if (docSnap.exists()) {
            form.value = {
                ...docSnap.data()
            }
        }
    } catch (error) {
        console.error("Error fetching budget data: ", error);
    }
})
watch(() => form.value.amount, (newValue) => {
    if (newValue) {
        errors.value.amount = null;
    }
})
let unsubscribeCategories = null;
onMounted(() => {
    if (!userId) return;

    const queryCategories = collection(db, "users", userId, "categories");

    unsubscribeCategories = onSnapshot(queryCategories, (snapshot) => {
        categories.value = snapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })
    }, (error) => {
        console.error("Error fetching categories: ", error);
    });
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
    if (!validateForm()) {
        return;
    }

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
                    <component :is="IconGoal" class="size-8" />
                    <h3 class="text-lg font-bold">Update {{ form.category }} Budget</h3>
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
                <div class="flex items-center gap-3 w-full">
                    <div class="w-full">
                        <label for="amount" class="font-medium">Amount</label>
                        <input type="number" name="amount" v-model="form.amount" id="amount"
                            class="input input-bordered w-full mt-2" :class="[errors.amount ? 'input-error' : '']"
                            placeholder="0.00" />

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
                <p class="text-sm mt-1 text-red-600" v-if="errors.amount">{{ errors.amount }}</p>

                <div class="flex gap-2 modal-action">
                    <button type="button" @click="closeModal" class="btn btn-ghost rounded-md">Close</button>
                    <button :disabled="loading" class="btn btn-primary rounded-md" type="submit">
                        {{ loading ? "Updating..." : "Update Budget" }}
                    </button>
                </div>
            </form>
        </div>
    </dialog>
</template>