<script setup>
import { auth, db } from "@/firebase/firebase";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

import { icons } from "@/utils/categoryIcons";
import { currentUser } from "@/composables/useAuth";
import { categoryExists } from "@/helpers/errorsValidation";
import { reactive, ref, watch } from "vue";

const loading = ref(false);
const selectedIcon = ref({ name: "", icon: "" });

//form data
const form = reactive({
  type: "income",
  name: "",
  icon: selectedIcon.value.name || "Select Icon",
  color: "Select Color",
});

//form error messages
const errors = reactive({
  name: "",
  icon: "",
  color: "",
})

// Watch for changes in form inputs to reset error messages
watch(() => [form.name, form.icon, form.color], ([name, icon, color]) => {
  // Reset error messages when form inputs change
  if (name) errors.name = "";
  if (icon) errors.icon = "";
  if (color !== "Select Color") errors.color = "";
})


// CSS class for error messages
const errorClass = "text-red-500";

// Reset form to initial state
const resetForm = () => {
  form.type = "income";
  form.name = "";
  form.icon = "Select Icon";
  form.color = "Select Color";

  errors.name = "";
  errors.icon = "";
  errors.color = "";

  selectedIcon.value = { name: "", icon: "" };
};


// validate form inputs
const validateForm = () => {
  let isvalid = true;

  if (!form.name) {
    errors.name = "Category name is required."
    isvalid = false;
  }

  if (!form.name.trim().length || form.name.length < 3) {
    errors.name = "Category name must be at least 3 characters long."
    isvalid = false;
  }

  if (form.color === "Select Color") {
    errors.color = "Please select a color."
    isvalid = false;
  }
  if (selectedIcon.value.name == "" || selectedIcon.value.icon == "Select Icon") {
    errors.icon = "Please select an icon."
    isvalid = false;
  }

  return isvalid
}

// Reset form when the modal is closed
const submitForm = async () => {
  const userId = currentUser.value?.uid;

  if (!userId) {
    console.error("Not authenticated");
    return;
  }
  if (!validateForm()) {
    loading.value = false;
    return;
  }
  try {

    loading.value = true;
    const normalizedName = form.name.trim().toLowerCase();
    const exists = await categoryExists(normalizedName, form.type);

    if (exists) {
      errors.name = "Category already exists.";
      loading.value = false;
      return;
    }

    const formData = {
      ...form,
      icon: selectedIcon.value.name || "",
      createdAt: new Date().toISOString(),
    };

    // Set the icon and name for the selected icon
    await addDoc(collection(db, "users", userId, "categories"), formData);

    loading.value = false;
    resetForm();
    closeModal();

  } catch (error) {

    console.error("Error adding document: ", error);
    loading.value = false;
  } finally {
    loading.value = false;
  }
};
// Function to select an icon
const selectIcon = (icon) => {
  selectedIcon.value.name = icon.name || "";
  selectedIcon.value.icon = icon.icon || "";

  form.icon = icon.id || "";
};

// Function to close the modal and reset the form
const closeModal = () => {
  const modal = document.getElementById("add_category");
  if (modal) {
    modal.close();
    loading.value = false;
    resetForm();

    errors.value = {
      name: "",
      icon: "",
      color: "",
    };
  }
};

</script>
<template>
  <dialog id="add_category" class="modal">
    <div class="modal-box w-11/12 max-w-2xl">
      <h3 class="text-lg font-bold">Add New Category</h3>
      <p class="text-gray-500">Create a new category for your transactions.</p>
      <!---Preview-->
      <div class="flex justify-center items-center gap-3 mt-4 bg-base-300 ring-1 ring-base-300 rounded-lg p-4"
        v-if="form.name && form.color !== 'Select Color'">
        <div class="rounded-lg w-12 h-12 p-2" :class="form.color">
          <div v-if="selectedIcon.name && selectedIcon.icon" class="text-white">
            <component :is="selectedIcon.icon" class="size-8" />
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
            <button type="button" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="closeModal">
              ✕
            </button>
            <p class="font-medium">Category Type</p>
            <div class="flex items-center gap-2 mt-2">
              <!-- Income Radio Button -->
              <div class="flex items-center gap-2">
                <input id="income" type="radio" name="type" value="income" v-model="form.type"
                  class="radio radio-primary radio-sm" checked />
                <label for="income" class="font-sans cursor-pointer">Income</label>
              </div>
              <!-- Expense Radio Button -->
              <div class="flex items-center gap-2">
                <input id="expense" type="radio" name="type" value="expense" v-model="form.type"
                  class="radio radio-primary radio-sm" />
                <label for="expense" class="font-sans cursor-pointer">Expense</label>
              </div>
            </div>

            <div class="mt-4">
              <label for="category_name" class="font-medium">Category Name</label>
              <input id="category_name" type="text" v-model="form.name" placeholder="Enter Category Name"
                class="input mt-2  w-full" :class="errors.name ? 'input-error' : 'input-bordered'" />
              <p v-if="errors.name" :class="errorClass">{{ errors.name }}</p>

            </div>
            <div class="mt-4">
              <div class="w-full flex items-center gap-5">
                <div class="w-full">
                  <p class="font-medium mb-2">Icon</p>
                  <div class="dropdown dropdown-bottom dropdown-center w-full">
                    <div tabindex="0" role="button" class="btn m-1 w-full"
                      :class="errors.icon ? 'border-error' : 'border-none'">
                      <div class="flex items-center gap-1" v-if="selectedIcon.name && selectedIcon.icon">
                        <component :is="selectedIcon.icon" class="size-5" />
                        <p>{{ selectedIcon.name }}</p>
                      </div>
                      <div v-else>Select Icon</div>
                    </div>
                    <p v-if="errors.icon || form.icon" :class="errorClass">{{ errors.icon }}</p>
                    <ul tabindex="0"
                      class="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-lg max-h-40 overflow-x-auto">
                      <li v-for="icon in icons" :key="icon.name" @click="selectIcon(icon)" class="rounded-md"
                        :class="[selectedIcon.name == icon.name ? 'bg-primary text-white' : 'bg - none']">
                        <a>
                          <component :is="icon.icon" class="size-5" />
                          {{ icon.name }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <!-- Color Selection -->
                <div class="w-full">
                  <p class="font-medium mb-2">Color</p>
                  <select class="select w-full" :class="errors.color ? 'select-error' : 'input-bordered'"
                    name="payment_method" v-model="form.color">
                    <option disabled>Select Color</option>
                    <option value="bg-blue-500">Blue</option>
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
                  <p v-if="errors.color" :class="errorClass">{{ errors.color }}</p>

                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-2 modal-action">
            <button type="button" @click="closeModal" class="btn btn-ghost rounded-md">Close</button>
            <button :disabled="loading" class="btn btn-primary rounded-md" type="submit">
              {{ loading ? "Adding..." : "Add Category" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </dialog>
</template>
