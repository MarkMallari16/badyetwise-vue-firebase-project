<script setup>
import DashboardNav from '@/components/DashboardNav.vue';

</script>
<template>
    <div
        class="min-h-screen mx-4 my-2 px-4 lg:px-12 pb-10 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-lg rounded-2xl">
        <DashboardNav>
        </DashboardNav>
        <h1 class="text-3xl font-bold">Monthly Summary</h1>
        <div class="mt-4 p-6 ring-1 ring-inset ring-gray-300 rounded-md">
            <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                </svg>

                <h2 class="text-2xl font-bold">
                    Income vs Expense
                </h2>

            </div>

            <div class="pt-10 pb-8 flex justify-between items-center">
                <div>
                    <p class="font-medium">Income</p>
                    <h2 class="text-3xl text-green-600 font-bold">3900</h2>
                </div>
                <div>
                    <p class="font-medium">Expense</p>
                    <h2 class="text-3xl text-red-600 font-bold">2500</h2>
                </div>
                <div>
                    <p class="font-medium">Savings</p>
                    <h2 class="text-3xl text-blue-600 font-bold">250</h2>
                </div>
            </div>

            <div>
                <p>Income used: 20%</p>
                <progress class="progress h-4 w-full text-blue-600 " value="50" max="100" />
            </div>
        </div>
        <!--Expense Breakdown-->
    </div>
</template>