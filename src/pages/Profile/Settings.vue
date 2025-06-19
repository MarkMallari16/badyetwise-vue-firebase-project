<script setup>
import DashboardNav from "@/components/DashboardNav.vue";
import { currentUser } from "@/composables/useAuth";
import { ref } from "vue";


const profileData = ref(
  {
    displayName: currentUser.value.displayName,
    email: currentUser.value.email,
    photoUrl: currentUser.value.photoUrl
  }
)

console.log(profileData.value)
</script>
<template>
  <div
    class="min-h-screen mx-4 my-2 px-12 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-inner rounded-2xl">
    <DashboardNav />
    <div class="p-6 ring-1 ring-inset ring-gray-300 rounded-md">
      <div>
        <div class="flex items-center gap-1 ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <h1 class="text-2xl font-medium">Profile</h1>
        </div>
        <p class="text-gray-600">Manage your account information</p>
      </div>
      <!--Avatar-->
      <div>
        <div class="avatar">
          <div class="w-32 rounded-full">
            <img :src="profileData.avatar" alt="profile">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
