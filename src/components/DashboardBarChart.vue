<script setup>
import { inject, ref, watchEffect } from "vue";
import { Bar } from "vue-chartjs";
import { Chart, BarElement, BarController, CategoryScale, LinearScale } from "chart.js";

Chart.register(BarElement, BarController, CategoryScale, LinearScale);

const chartData = inject('chartData');
const chartOptions = inject('chartOptions')
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
