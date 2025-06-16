<script setup>
import { icons } from '@/data/getCategoryIcons';
import { db } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ref, watch } from 'vue';
const props = defineProps({
    categoryId: {
        type: String,
        required: true
    }
})
const isLoading = ref(false);
console.log("Category ID:", props.categoryId);
const selectedIcon = ref({ name: "", svg: "" });
const form = ref({
    type: "income",
    name: "",
    icon: selectedIcon.value.svg || "",
    color: "Select Color",
});

watch(() => props.categoryId, async (id) => {
    if (id) {
        const docRef = doc(db, "categories", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists) {
            form.value = {
                ...docSnap.data()
            }
        }
    }

}, { immediate: true })
console.log("Category Icons:", icons);

const closeModal = () => {
    const modal = document.getElementById("update_category");
    if (modal) {
        modal.close();
        loading.value = false;
        resetForm();
    }
};
</script>
<template>
    <dialog id="update_category" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <h3 class="text-lg font-bold">Update Category</h3>
            <p class="text-gray-500">Update category for your transactions.</p>
            <!---Preview-->
            <div class="flex justify-center items-center gap-3 mt-4 bg-gray-100 ring-1 ring-gray-300 rounded-lg p-4"
                v-if="form.name && form.color !== 'Select Color'">
                <div class="rounded-lg w-12 h-12 p-2" :class="form.color">
                    <div v-if="selectedIcon.name && selectedIcon.svg" v-html="selectedIcon.svg" class="text-white">
                    </div>
                </div>
                <div>
                    <h3 class="font-medium">{{ form.name }}</h3>
                    <p class="text-gray-500 text-sm">{{ form.type }}</p>
                </div>
            </div>
            <div>
                <form @submit.prevent="submitForm" method="post">
                    <div class="mt-4 mb-10">
                        <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            @click="closeModal">
                            ✕
                        </button>
                        <p class="font-medium">Category Type</p>
                        <div class="flex items-center gap-2 mt-2">
                            <!-- Income Radio Button -->
                            <div class="flex items-center gap-2">
                                <input id="income" type="radio" name="type" value="income" v-model="form.type"
                                    class="radio radio-primary radio-sm" checked />
                                <label for="income" class="font-sans">Income</label>
                            </div>
                            <!-- Expense Radio Button -->
                            <div class="flex items-center gap-2">
                                <input id="expense" type="radio" name="type" value="expense" v-model="form.type"
                                    class="radio radio-primary radio-sm" />
                                <label for="expense" class="font-sans">Expense</label>
                            </div>
                        </div>

                        <div class="mt-4">
                            <label for="category_name" class="font-medium">Category Name</label>
                            <input id="category_name" type="text" v-model="form.name" placeholder="Enter Category Name"
                                required class="input mt-2 input-bordered w-full" />
                        </div>
                        <div class="mt-4">
                            <div class="w-full flex items-center gap-5">
                                <div class="w-full">
                                    <p class="font-medium mb-2">Icon</p>
                                    <div class="dropdown dropdown-bottom dropdown-center w-full">
                                        <div tabindex="0" role="button" class="btn m-1 w-full">
                                            <div class="flex items-center gap-1"
                                                v-if="selectedIcon.name && selectedIcon.svg">
                                                <span v-html="selectedIcon.svg" class="size-6"></span>
                                                <p>{{ selectedIcon.name }}</p>
                                            </div>
                                            <div v-else>Select Icon</div>
                                        </div>
                                        <ul tabindex="0"
                                            class="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-lg max-h-40 overflow-x-auto">
                                            <li v-for="icon in icons" :key="icon.name" @click="selectIcon(icon)">
                                                <a>
                                                    <span v-html="icon.icon" class="size-6"></span>
                                                    {{ icon.name }}
                                                </a>
                                            </li>
                                        </ul>

                                    </div>
                                </div>
                                <!-- Color Selection -->
                                <div class="w-full">
                                    <p class="font-medium mb-2">Color</p>
                                    <select class="select select-bordered w-full" name="payment_method"
                                        v-model="form.color">
                                        <option disabled>Select Color</option>
                                        <option selected value="bg-blue-500">Blue</option>
                                        <option value="bg-green-500">Green</option>
                                        <option value="bg-yellow-500">Yellow</option>
                                        <option value="bg-teal-500">Teal</option>
                                        <option value="bg-red-500">Red</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 modal-action">
                        <button type="button" @click="closeModal" class="btn">Close</button>
                        <button :disabled="loading" class="btn btn-primary" type="submit">
                            {{ loading ? "Updating..." : "Update Category" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </dialog>
</template>