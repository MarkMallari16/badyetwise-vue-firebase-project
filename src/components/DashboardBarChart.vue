<script setup>
import { inject, } from "vue";
import { Bar } from "vue-chartjs";
import { Chart, BarElement, BarController, CategoryScale, LinearScale } from "chart.js";

Chart.register(BarElement, BarController, CategoryScale, LinearScale);

const chartData = inject('barChartData');
const chartOptions = inject('barChartOptions');
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
