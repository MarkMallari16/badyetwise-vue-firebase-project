<script setup>
import DashboardNav from "@/components/DashboardNav.vue";
</script>
<template>
  <div
    class="min-h-screen mx-4 my-2 px-6 lg:px-12 transition-all duration-300 ease-in-out ring-1 ring-base-300 shadow-inner rounded-2xl">
    <DashboardNav />
    <div class="flex justify-center items-center text-center ring-1 ring-inset ring-base-300 px-6 py-16 rounded-lg">
      <div>
        <div class="flex flex-col justify-center items-center">
        <p class="badge badge-warning bg-warning ">Coming soon</p>

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-20 text-primary">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
        </div>
        <h1 class="text-4xl font-bold">Enhanced Help & Support</h1>
        <p class="text-lg">We're building an amazing support experience with live chat, video tutorials, and more soon!
        </p>
      </div>
    </div>
  </div>
</template>
