<script setup>
import { Pie } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const chartData = {
    labels: ['Food', 'Rent', 'Transport', 'Entertainment'],
    datasets: [
        {
            label: 'Expenses',
            data: [500, 1000, 300, 200],
            backgroundColor: ['#f87171', '#60a5fa', '#34d399', '#facc15'],
            hoverOffset: 10,
        },
    ],
}

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
        },
    },
}
</script>

<template>
    <Pie :data="chartData" :options="chartOptions"  />

</template>