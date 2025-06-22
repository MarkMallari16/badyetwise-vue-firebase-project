<script setup>
import { provide, ref } from "vue";
import Sidebar from "./components/Sidebar.vue";
import { useRoute } from "vue-router";
import { useTheme } from "./composables/useTheme";


const isSidebarOpen = ref(true);
// Function to toggle the sidebar state
const handleToggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

provide("isSidebarOpen", isSidebarOpen);
provide("handleToggleSidebar", handleToggleSidebar);

const isSidebar = useRoute();

useTheme();
</script>

<template>
  <div>
    <div v-if="isSidebar.meta.showSidebar" class="relative grid transition-all duration-200 delay-75 ease-in-out"
      :class="[isSidebarOpen ? 'grid-cols-[1fr_5fr] ' : 'grid-cols-[0fr_5fr]']">
      <!--sidebar-->
      <Sidebar v-if="isSidebar.meta.showSidebar" />
      <router-view />
    </div>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>
