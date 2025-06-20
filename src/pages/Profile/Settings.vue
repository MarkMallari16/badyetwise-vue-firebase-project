<script setup>
import DashboardNav from "@/components/DashboardNav.vue";
import { currentUser } from "@/composables/useAuth";
import { ref } from "vue";


const profileData = ref(
  {
    displayName: currentUser.value.displayName,
    email: currentUser.value.email,
    photoURL: currentUser.value.photoURL
  }
)


</script>
<template>
  <div
    class="min-h-screen mx-4 my-2 px-6 lg:px-12 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-inner rounded-2xl">
    <DashboardNav />
    <div class="px-10 pt-6 pb-20 ring-1 ring-inset ring-gray-300 rounded-md">
      <div>
        <div class="flex flex-wrap items-center gap-1 ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <h1 class="text-xl font-medium">Profile</h1>
        </div>
        <p class="text-gray-600">Manage your account information</p>
      </div>
      <!--Avatar-->
      <div class="mt-6">
        <div class=" flex gap-6 items-center flex-wrap">
          <div class="avatar">
            <div class="w-28 rounded-full mt-4 object-cover">
              <img :src="profileData.photoURL" alt="profile">
            </div>

          </div>
          <div>
            <h2 class="text-2xl font-bold">{{ profileData.displayName }}</h2>
            <p class="mt-2 text-gray-600">{{ profileData.email }}</p>
            <button class="mt-4 btn btn-primary rounded-lg">Change Picture</button>
          </div>
        </div>
      </div>
      <!--Profile Information-->
      <div class="mt-6">
        <label for="name" class="font-medium">Name</label>
        <input type="text" id="name" v-model="profileData.displayName"
          class="block input input-bordered w-full max-w-md mt-1" placeholder="Display Name">
      </div>
      <div class="mt-2">
        <label for="email" class="font-medium">Email</label>
        <input type="email" id="email" class="block input input-bordered w-full max-w-md mt-1"
          v-model="profileData.email" placeholder="Email" disabled>
      </div>
    </div>

  </div>
</template>
