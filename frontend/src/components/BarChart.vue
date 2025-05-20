<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="computedChartData" />
</template>

<script>
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { computed } from "vue";
import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: {
    Bar,
  },
  props: {
    labels: {
      type: Array,
      required: true,
      default: () => [],
    },
    granularity: {
      type: String,
      default: "month",
    },
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    title: {
      type: String,
      default: "Monthly Data Overview",
    },
  },
  setup(props) {
    const computedChartData = computed(() => ({
      labels: props.labels,
      datasets: [
        {
          label: `${props.granularity} Data`,
          data: props.data,
          backgroundColor: "skyblue",
        },
      ],
    }));

    const chartOptions = computed(() => ({
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: props.title,
          font: {
            size: 18,
          },
          color: "#333",
          padding: {
            top: 10,
            bottom: 10,
          },
          align: "center",
        },
        legend: {
          position: "top",
        },
      },
    }));

    return {
      computedChartData,
      chartOptions,
    };
  },
};
</script>
