<script setup>
import DashboardNav from '@/components/DashboardNav.vue';

</script>
<template>
    <div
        class="min-h-screen mx-4 my-2 px-4 lg:px-12 pb-10 transition-all duration-300 ease-in-out ring-1 ring-gray-200 shadow-lg rounded-2xl">
        <DashboardNav>
        </DashboardNav>
        <h1 class="text-3xl font-bold">Monthly Summary</h1>
        <div class="mt-6 p-6 ring-1 ring-inset ring-gray-300 rounded-md">
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
        <div class="mt-4 p-6 ring-1 ring-inset ring-gray-300 rounded-md">
            <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="size-8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                </svg>

                <h2 class="text-2xl font-bold">
                    Expense Breakdown
                </h2>
            </div>
            <div class="mt-4">
                <div>
                    <div class="flex justify-between items-center">
                        <p class="font-medium">Housing</p>
                        <p class="text-gray-600">1200 (43%)</p>
                    </div>
                    <div class="flex items-center  gap-2 pt-2">
                        <span class="w-3 h-3 inline-block  bg-blue-500 rounded-full">

                        </span>
                        <progress class="progress w-full" value="50" max="100" />
                    </div>
                </div>
                <div class="mt-4">
                    <div class="flex justify-between items-center">
                        <p class="font-medium">Tuition</p>
                        <p class="text-gray-600">1200 (43%)</p>
                    </div>

                    <div class="flex items-center  gap-2 pt-2">
                        <span class="w-3 h-3 inline-block  bg-red-500 rounded-full">

                        </span>
                        <progress class="progress w-full" value="50" max="100" />
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>