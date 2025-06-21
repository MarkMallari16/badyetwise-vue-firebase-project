<script setup>
import DashboardNav from '@/components/DashboardNav.vue';
import { db } from '@/firebase/firebase';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { currentUser } from '@/composables/useAuth';

const transactions = ref([]);
const budgets = ref([]);
const categories = ref([])



const userId = currentUser.value?.uid;
const transactionsQuery = query(
    collection(db, "users", userId, "transactions"),
    orderBy("createdAt", "desc")
);
const budgetsQuery = collection(db, "users", userId, "budgets");
const categoriesQuery = collection(db, "users", userId, "categories");


let unsubscribeTransactions = null;
let unsubscribeBudgets = null;
let unsubscribeCategories = null;
onMounted(() => {
    if (userId) {
        unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
            transactions.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        })

        unsubscribeBudgets = onSnapshot(budgetsQuery, (snapshot) => {
            budgets.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        })

        unsubscribeCategories = onSnapshot(categoriesQuery, (snapshot) => {
            categories.value = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        })
    }
})

onUnmounted(() => {
    // Clean up the listeners when the component is unmounted
    if (unsubscribeTransactions) {
        unsubscribeTransactions();
    }
    if (unsubscribeBudgets) {
        unsubscribeBudgets();
    }
    if (unsubscribeCategories) {
        unsubscribeCategories();
    }
})

const reportsSummary = computed(() => {
    const income = transactions.value.filter(transaction => transaction.type === "income");
    const expense = transactions.value.filter(transaction => transaction.type === "expense");


    const totalIncome = income.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpense = expense.reduce((sum, transaction) => sum + transaction.amount, 0);

    const savings = totalIncome - totalExpense;
    const percentageUsed = (totalExpense / totalIncome * 100).toFixed(2) || 0;
    const savingsPercentage = savings && totalIncome ? (savings / totalIncome * 100).toFixed(2) : 0;

    const budgetAndExpense = budgets.value.map(budget => {
        const budgetExpense = expense.filter(transaction => transaction.category === budget.category);
        const categoryColor = categories.value.find(category => category.name === budget.category)?.color;
        const totalBudgetExpense = budgetExpense.reduce((sum, transaction) => sum + transaction.amount, 0)

        return {
            ...budgetExpense,
            category: budget.category,
            color: categoryColor || 'bg-gray-200',
            budget: budget.amount,
            amount: totalBudgetExpense,
            percentage: ((totalBudgetExpense / budget.amount) * 100).toFixed(2) || 0
        }
    })
    console.log(budgetAndExpense)
    return {
        expense,
        totalIncome,
        totalExpense,
        budgetAndExpense,
        savings,
        percentageUsed,
        savingsPercentage
    }
})


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
                    <h2 class="text-3xl text-green-600 font-bold">{{ reportsSummary.totalIncome }}</h2>
                </div>
                <div>
                    <p class="font-medium">Expense</p>
                    <h2 class="text-3xl text-red-600 font-bold">{{ reportsSummary.totalExpense }}</h2>
                </div>
                <div>
                    <p class="font-medium">Savings</p>
                    <h2 class="text-3xl text-blue-600 font-bold">{{ reportsSummary.savings }}</h2>
                </div>
            </div>

            <div>
                <div class="flex justify-between pb-1">
                    <p>Income used: {{ reportsSummary.percentageUsed }}%</p>
                    <p>Savings: {{ reportsSummary.savingsPercentage }}%</p>

                </div>
                <progress class="progress h-4 w-full text-blue-600 " :value="reportsSummary.totalExpense"
                    :max="reportsSummary.totalIncome" />
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
                <div v-if="reportsSummary.budgetAndExpense.length > 0"
                    v-for="(expenseItem, index) in reportsSummary.budgetAndExpense" :key="index">
                    <div class="flex justify-between items-center">
                        <p class="font-medium">{{ expenseItem.category }}</p>
                        <p class="text-gray-600">{{ expenseItem.budget }} {{ expenseItem.percentage }}%</p>
                    </div>
                    <div class="flex items-center  gap-2 pt-4">
                        <span class="w-3 h-3 inline-block rounded-full" :class="expenseItem.color">
                        </span>
                        <progress class="progress w-full" :value="expenseItem.amount" :max="expenseItem.budget" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>