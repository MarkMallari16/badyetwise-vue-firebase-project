<script setup>
import { useNavigation } from "@/composables/useNavigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { inject, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { currentUser } from "@/composables/useAuth";
import IconActiveDashboard from "./icons/IconActiveDashboard.vue";
import IconInactiveDashboard from "./icons/IconInactiveDashboard.vue";
import IconActiveTransaction from "./icons/IconActiveTransaction.vue";
import IconInactiveTransaction from "./icons/IconInactiveTransaction.vue";
import IconActiveCategories from "./icons/IconActiveCategories.vue";
import IconInactiveCategories from "./icons/IconInactiveCategories.vue";
import IconActiveBudget from "./icons/IconActiveBudget.vue";
import IconInactiveBudget from "./icons/IconInactiveBudget.vue";
import IconActiveReports from "./icons/IconActiveReports.vue";
import IconInactiveReports from "./icons/IconInactiveReports.vue";
import IconActiveSettings from "./icons/IconActiveSettings.vue";
import IconInactiveSettings from "./icons/IconInactiveSettings.vue";
import IconActiveSupport from "./icons/IconActiveSupport.vue";
import IconInactiveSupport from "./icons/IconInactiveSupport.vue";
// Import Firebase Authentication

const auth = getAuth();
const route = useRoute();
const { goTo } = useNavigation();



// Injected properties for sidebar state
const isSidebarOpen = inject("isSidebarOpen");

const goToDashboardLink = () => {
  goTo("/home");
};
const goToTransactionsLink = () => {
  goTo("/transactions");

};
const goToCategoriesLink = () => {
  goTo("/categories/expense")
};
const goToBudgetLink = () => {
  goTo("/budget");

};
const goToReportsLink = () => {
  goTo("/reports");
};
const goToSettingsLink = () => {
  goTo("/settings");

};
const goToSupportLink = () => {
  goTo("/support");
};

// Reactive object to store user information
const storedUser = ref({
  name: "",
  email: "",
  photoURL: "",
});


//onMounted lifecycle hook to check authentication state
if (currentUser.value) {
  storedUser.value.name = currentUser.value?.displayName;
  storedUser.value.email = currentUser.value?.email;
  storedUser.value.photoURL = currentUser.value?.photoURL;
} else {
  goTo("/login");
}

//signout
const handleSignOut = () => {
  signOut(auth)
    .then(() => {
      console.log("successfully logout");
      goTo("/login");
    })
    .catch((error) => {
      console.error(error.message);
    });
};

//check if the current route is active
const isActive = (path) => route.path.startsWith(path);
// Links for the overview section of the sidebar
const overviewLinks = [
  {
    name: "Dashboard",
    path: "/home",
    linkTo: goToDashboardLink,
    iconActive: IconActiveDashboard,
    iconInActive: IconInactiveDashboard,
  },
  {
    name: "Transactions",
    path: "/transactions",
    linkTo: goToTransactionsLink,
    iconActive: IconActiveTransaction,
    iconInActive: IconInactiveTransaction,
  },
  {
    name: "Categories",
    path: "/categories",
    linkTo: goToCategoriesLink,
    iconActive: IconActiveCategories,
    iconInActive: IconInactiveCategories,
  },
  {
    name: "Budget",
    path: "/budget",
    linkTo: goToBudgetLink,
    iconActive: IconActiveBudget,
    iconInActive: IconInactiveBudget,
  },
  {
    name: "Reports",
    path: "/reports",
    linkTo: goToReportsLink,
    iconActive: IconActiveReports,
    iconInActive: IconInactiveReports
  }
];

// Links for the settings and support section of the sidebar
const settingsSupportLinks = [
  {
    name: "Settings",
    path: "/settings",
    linkTo: goToSettingsLink,
    iconActive: IconActiveSettings,
    iconInActive: IconInactiveSettings,
  },
  {
    name: "Help & Support",
    path: "/support",
    linkTo: goToSupportLink,
    iconActive: IconActiveSupport,
    iconInActive: IconInactiveSupport,
  },
];
</script>

<template>
  <div class="overflow-hidden text-nowrap">
    <div
      class="rounded-r-3xl lg:rounded-2xl transition-all duration-500 delay-0    ease-in-out z-40 ring-1 ring-gray-300  lg:ring-0"
      :class="[isSidebarOpen ? 'lg:w-[20rem] fixed w-64' : 'w-0 opacity-0']">
      <div class="flex flex-col justify-between ps-4 pe-4 lg:pe-0 py-8 min-h-screen">
        <div>
          <!--Logo and Website Name-->
          <div class="flex items-center flex-nowrap gap-2 mb-10 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              class="text-primary transition-transform ease-in-out duration-200 delay-200"
              :class="[isSidebarOpen ? 'size-12 ' : 'size-0']">
              <path
                d="M2.273 5.625A4.483 4.483 0 0 1 5.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 3H5.25a3 3 0 0 0-2.977 2.625ZM2.273 8.625A4.483 4.483 0 0 1 5.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0 0 18.75 6H5.25a3 3 0 0 0-2.977 2.625ZM5.25 9a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h13.5a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3H15a.75.75 0 0 0-.75.75 2.25 2.25 0 0 1-4.5 0A.75.75 0 0 0 9 9H5.25Z" />
            </svg>
            <div>
              <h2 class="text-lg lg:text-xl font-black uppercase w-full">
                BadyetWise
              </h2>
              <p class="text-gray-600 font-normal w-full">Your Personal Tracker</p>
            </div>
          </div>
          <!--Navigation Links-->
          <div class="transition-all duration-100 ease-in-out">
            <div class="mb-2">
              <p class="text-gray-500 font-normal text-sm">Overview</p>
            </div>
            <!--Links-->
            <button v-for="(overview, index) in overviewLinks" :key="index"
              class="flex gap-4 items-center pl-2 py-3 rounded-md cursor-pointer mb-3 w-full" :class="{
                'bg-base-300': isActive(overview.path),
                'hover:bg-base-300': !isActive(overview.path),
              }" @click="overview.linkTo">
              <component :is="isActive(overview.path) ? overview.iconActive : overview.iconInActive" />

              <h2 :class="[isActive(overview.path) ? 'font-medium' : 'font-normal']">
                {{ overview.name }}
              </h2>
            </button>
          </div>
        </div>
        <!--Dropdown-->
        <div>
          <div class="mb-10">
            <!-- settings and support links -->
            <button v-for="(link, index) in settingsSupportLinks"
              class="flex gap-4 items-center pl-2 py-3 hover:bg-base-300 rounded-md mb-3 cursor-pointer w-full"
              @click="link.linkTo" :class="{
                'bg-base-300': isActive(link.path),
                'hover:bg-base-300': !isActive(link.path),
              }">
              <component :is="isActive(link.path) ? link.iconActive : link.iconInActive" />

              <h2 :class="[isActive(link.path) ? 'font-medium' : 'font-normal']">
                {{ link.name }}
              </h2>
            </button>
          </div>
          <!-- User Profile Dropdown -->
          <div class="dropdown dropdown-top w-full hover:bg-base-200 p-1 rounded-lg">
            <div role="button" class="w-full flex items-center justify-between" tabindex="0">
              <div class="flex items-center gap-4">
                <div class="avatar avatar-placeholder">
                  <div class="w-10 bg-primary text-white rounded-xl bg-cover">
                    <img v-if="storedUser.photoURL" :src="storedUser.photoURL" />
                    <div v-else>
                      <p class="text-3xl font-bold text-center text-gray-100">
                        {{ storedUser.name.charAt(0).toUpperCase() }}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 class="text-md font-medium">{{ storedUser.name }}</h2>
                  <p class="text-sm font-normal">{{ storedUser.email }}</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
              </svg>
            </div>
            <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-sm">
              <li>
                <button @click="handleSignOut">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  <p>Sign out</p>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
