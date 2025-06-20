<script setup>
import { icons } from '@/utils/categoryIcons';
import { db } from '@/firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, watchEffect } from 'vue';
import { currentUser } from '@/composables/useAuth';
import { getIconCategory } from '@/utils/getIconCategory';

//user id 
const userId = currentUser.value?.uid;

// Define the props for the component
const props = defineProps({
    categoryId: {
        type: String,
        required: true
    }
})

const isLoading = ref(false);

const selectedIcon = ref({ name: "", icon: "" })

const form = ref({
    type: "income",
    name: "",
    icon: "",
    color: "Select Color",
});

console.log("Category Data:", form.value);

//setting up initial form values
watchEffect(async () => {
    if (props.categoryId) {
        const docRef = doc(db, "users", userId, "categories", props.categoryId);
        const docSnap = await getDoc(docRef);

        // Check if the document exists
        if (docSnap.exists()) {
            form.value = {
                ...docSnap.data()
            }
            selectedIcon.value.name = form.value.icon || "";
            selectedIcon.value.icon = form.value.icon || "";

            console.log("Form Data:", form.value);
            console.log("Selected Icon:", selectedIcon.value);
            form.value.name = form.value.name || "";
            form.value.icon = form.value.icon || "";
        }
    }
})

// Function to select an icon 
const selectIcon = (icon) => {
    //icon
    selectedIcon.value.icon = icon.icon;
    //name of the icon
    selectedIcon.value.name = icon.name;

    console.log("Selected Icon:", selectedIcon.value);

    form.value.icon = icon.icon;
};

//Update category
const updateCategory = async () => {
    isLoading.value = true;
    const docRef = doc(db, "users", userId, "categories", props.categoryId);
    try {
        const formData = {
            ...form.value,
            icon: selectedIcon.value.name || "",
            updatedAt: new Date().toISOString()
        }

        console.log("Form Data to Update:", formData);
        await updateDoc(docRef, formData);

    } catch (error) {
        console.error("Error updating category:", error);
        isLoading.value = false;
    } finally {
        isLoading.value = false;
        closeModal();
    }
}

const closeModal = () => {
    const modal = document.getElementById("update_category");
    if (modal) {
        modal.close();
        isLoading.value = false;
    }
};
</script>
<template>
    <dialog id="update_category" class="modal">
        <div class="modal-box w-11/12 max-w-2xl">
            <h3 class="text-lg font-bold">Update Category</h3>
            <p class="text-gray-500">Update category for your transactions.</p>
            <!---Preview-->
            <div class="flex justify-center items-center gap-3 mt-4 bg-gray-100 ring-1 ring-gray-300 rounded-lg p-4">
                <div class="rounded-lg w-12 h-12 p-2" :class="form.color">
                    <div v-if="selectedIcon.name && selectedIcon.icon" class="text-white">
                        <component :is="getIconCategory(selectedIcon.name)" class="size-8" />
                    </div>
                </div>
                <div>
                    <h3 class="font-medium">{{ form.name }}</h3>
                    <p class="text-gray-500 text-sm">{{ form.type }}</p>
                </div>
            </div>
            <div>
                <form @submit.prevent="updateCategory" method="post">
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
                        <!-- Icon and Color Selection -->
                        <div class="mt-4">
                            <div class="w-full flex items-center gap-5">
                                <div class="w-full">
                                    <p class="font-medium mb-2">Icon</p>
                                    <div class="dropdown dropdown-bottom dropdown-center w-full">
                                        <div tabindex="0" role="button" class="btn m-1 w-full">
                                            <div class="flex items-center gap-1" v-if="selectedIcon">
                                                <component :is="getIconCategory(selectedIcon.name)" class="size-5" />
                                                <p>{{ selectedIcon.name }}</p>
                                            </div>
                                        </div>
                                        <ul tabindex="0"
                                            class="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-lg max-h-40 overflow-x-auto">
                                            <li v-for="icon in icons" :key="icon.name" @click="selectIcon(icon)"
                                                class="rounded-md"
                                                :class="[selectedIcon.name == icon.name ? 'bg-primary text-white' : 'bg - none']">
                                                <a>
                                                    <component :is="getIconCategory(icon.name)" class="size-6" />
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
                                        <option value="bg-orange-500">Orange</option>
                                        <option value="bg-lime-500">Lime</option>
                                        <option value="bg-pink-500">Pink</option>
                                        <option value="bg-indigo-500">Indigo</option>
                                        <option value="bg-rose-500">Rose</option>
                                        <option value="bg-purple-500">Purple</option>

                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 modal-action">
                        <button type="button" @click="closeModal" class="btn">Close</button>
                        <button :disabled="isLoading" class="btn btn-primary" type="submit">
                            {{ isLoading ? "Updating..." : "Update Category" }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </dialog>
</template>