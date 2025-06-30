<script setup>
import { inject } from "vue";

const isSidebarOpen = inject("isSidebarOpen");

</script>
<template>
  <button class="rounded-lg transition-all duration-300 ease-in-out ">
    <svg class="size-9 text-gray-600" :class="[isSidebarOpen ? 'rotate-180' : '']" aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
        d="M7.99994 10 6 11.9999l1.99994 2M11 5v14m-7 0h16c.5523 0 1-.4477 1-1V6c0-.55228-.4477-1-1-1H4c-.55228 0-1 .44772-1 1v12c0 .5523.44772 1 1 1Z" />
    </svg>
  </button>
</template>
