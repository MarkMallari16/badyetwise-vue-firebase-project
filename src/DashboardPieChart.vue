<script setup>
import { Pie } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'
import { inject } from 'vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const pieChartData = inject("pieChartData");
const pieChartOptions = inject("pieChartOptions");
</script>

<template>
    <Pie :data="pieChartData" :options="pieChartOptions" />

</template>