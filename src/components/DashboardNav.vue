<script setup>
import { inject, } from "vue";
import { useRoute } from "vue-router";
import SidebarCloseButton from "./SidebarCloseButton.vue";

const route = useRoute();

const toggleSidebar = inject("handleToggleSidebar");
</script>
<template>
  <!--Top-->
  <div
    class="flex flex-row-reverse lg:flex-row justify-between items-center gap-10 py-4 mb-2 rounded-md flex-wrap lg:flex-nowrap">
    <div class="flex flex-row-reverse justify-between lg:justify-normal  lg:flex-row  items-center gap-2 w-full">
      <!--Sidebar-->
      <SidebarCloseButton @click="toggleSidebar" />
      <div class="text-gray-500 divider divider-vertical hidden lg:inline-flex">|</div>
      <h1 class="font-medium text-2xl ">{{ route.meta.title }}</h1>
    </div>
    <!--Right Side-->
    <slot></slot>
  </div>
</template>
