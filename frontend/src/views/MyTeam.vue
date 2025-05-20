<template>
  <v-app>
    <SideBar>
      <v-container>
        <v-row
          ><v-col><h2>Department</h2></v-col></v-row
        >
        <v-row>
          <v-col>
            <v-card flat width="30%">
              <SelectBox
                v-model="selectedDepartment"
                :items="departments"
              ></SelectBox>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col><h2>Over Time Summary</h2></v-col>
        </v-row>
        <v-row class="mb-6">
          <v-col>
            <v-card>
              <v-table class="d-flex justify-center">
                <thead>
                  <tr>
                    <th
                      v-for="header in headers"
                      :key="header.value"
                      class="text-center"
                      style="background-color: #f5f5f5"
                    >
                      {{ header.text }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="text-center">
                    <td>
                      <WorkSummaryCard
                        :totalWorkHours="summaryData1.TotalWorkHours"
                        :unit="'hr'"
                        :timeUnit="currentPeriod"
                        :lastRecord="summaryData2.TotalWorkHours"
                      />
                    </td>
                    <td>
                      <WorkSummaryCard
                        :totalWorkHours="summaryData1.TotalOTHours"
                        :unit="'hr'"
                        :timeUnit="currentPeriod"
                        :lastRecord="summaryData2.TotalOTHours"
                      />
                    </td>
                    <td>
                      <WorkSummaryCard
                        :totalWorkHours="summaryData1.OTHoursPerson"
                        :unit="'hr'"
                        :timeUnit="currentPeriod"
                        :lastRecord="summaryData2.OTHoursPerson"
                      />
                    </td>
                    <td>
                      <WorkSummaryCard
                        :totalWorkHours="summaryData1.OTHeadcounts"
                        :unit="'p'"
                        :timeUnit="currentPeriod"
                        :lastRecord="summaryData2.OTHeadcounts"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col><h2>Analysis Chart</h2></v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="auto">
            <v-card elevation="0" class="datepicker-container">
              <VueDatePicker
                v-model="Startdate"
                class="custom-datepicker"
                teleport="body"
                ref="startDatePicker"
                type="date"
                :enable-time-picker="false"
              />
            </v-card>
          </v-col>
          <v-col cols="auto">to</v-col>
          <v-col cols="auto">
            <v-card elevation="0" class="datepicker-container">
              <VueDatePicker
                v-model="Enddate"
                class="custom-datepicker"
                teleport="body"
                ref="endDatePicker"
                :enable-time-picker="false"
              />
            </v-card>
          </v-col>
          <v-col cols="auto" class="d-flex align-center">
            <v-radio-group
              inline
              class="d-flex align-center"
              v-model="granularity"
            >
              <v-radio label="Week" value="week"></v-radio>
              <v-radio label="Month " value="month"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="auto" class="d-flex align-center">
            <v-select
              v-model="selectedMetric"
              :items="metrics"
              item-title="text"
              item-value="value"
              label="Choose Metric"
              class="mb-4"
              dense
              outlined
              style="max-width: 200px"
            />
          </v-col>
        </v-row>
        <v-row class="mb-6">
          <bar-chart
            :data="chartData"
            :labels="chartLabels"
            :title="selectedMetricText"
          /></v-row>
        <v-row>
          <v-col><h2>Alert List</h2></v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card flat>
              <template v-slot:text>
                <v-text-field
                  v-model="search"
                  label="Search"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  single-line
                ></v-text-field>
              </template>
              <DataTable
                :show-headers="headers2"
                :items="alertList"
                :search="search"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </SideBar>
  </v-app>
</template>

<script setup>
import api from "@/api";
import { computed, onMounted, ref, watch } from "vue";
import BarChart from "../components/BarChart.vue";
import DataTable from "../components/DataTable.vue";
import SelectBox from "../components/SelectBox.vue";
import SideBar from "../components/SideBar.vue";
import WorkSummaryCard from "../components/SummaryCard.vue";

const userID = localStorage.getItem("userID") || "";
const departments = ref([]);
const selectedDepartment = ref(null);
const organization_id = computed(() => {
  const found = organizations.find(d => d.name === selectedDepartment.value);
  return found?.organization_id ?? null;
});

const organizations = [
  { name: "CEO", organization_id: "L1" },
  { name: "COO", organization_id: "L10" },
  { name: "HR Manager", organization_id: "L100" },
  { name: "Operations Manager", organization_id: "L101" },
  { name: "CFO", organization_id: "L11" },
  { name: "Accounting Team", organization_id: "L110" },
  { name: "Finance Team", organization_id: "L111" },
  { name: "CTO", organization_id: "L12" },
  { name: "Engineering Team", organization_id: "L120" },
  { name: "IT Support", organization_id: "L121" },
];

const granularity = ref("week");
const summaryData1 = ref({});
const summaryData2 = ref({});
const summaryData3 = ref({});
const summaryData4 = ref({});
const summaryData5 = ref({});
const selectedMetric = ref("TotalWorkHours");
const chartData = ref([]);
const chartLabels = ref([]);

const metrics = [
  { text: "Total Work Hours", value: "TotalWorkHours" },
  { text: "Total OT Hours", value: "TotalOTHours" },
  { text: "OT Hours / Person", value: "OTHoursPerson" },
  { text: "OT Headcounts", value: "OTHeadcounts" },
];
const selectedMetricText = computed(() => {
  const found = metrics.find(m => m.value === selectedMetric.value);
  return found?.text || "";
});

const Startdate = ref(new Date());
const Enddate = ref(new Date());
const formattedStartDate = computed(() => formatDateToYMD(Startdate.value));
const formattedEndDate = computed(() => formatDateToYMD(Enddate.value));
const alertList = ref([]);
const search = ref("");

const headers = [
  { text: "Total Work Hours", value: "TotalWorkHours" },
  { text: "Total OT Hours", value: "TotalOTHours" },
  { text: "OT Hours/ person", value: "OTHoursPerson" },
  { text: "OT-HeadCounts", value: "OTHeadcounts" },
];

const headers2 = [
  { text: "Employee ID", value: "EmployeeID" },
  { text: "Name", value: "Name" },
  { text: "OT Counts", value: "OTCounts" },
  { text: "OT Hours", value: "OTHours" },
  { text: "Status", value: "status" },
];

function formatDateToYMD(date) {
  if (!(date instanceof Date)) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function round2(num) {
  return Math.round(num * 100) / 100;
}

function updateChart() {
  const metric = selectedMetric.value;
  chartData.value = [
    round2(summaryData5.value?.[metric] || 0),
    round2(summaryData4.value?.[metric] || 0),
    round2(summaryData3.value?.[metric] || 0),
    round2(summaryData2.value?.[metric] || 0),
    round2(summaryData1.value?.[metric] || 0),
  ];
  chartLabels.value = granularity.value === "week" ? generateWeekLabels(5):generateMonthLabels(5);
}

function generateWeekLabels(weeks = 5) {
  const labels = [];
  const today = new Date();
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - today.getDay() + 1); 

  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(currentMonday);
    start.setDate(currentMonday.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    labels.push(`${formatDateToYMD(start)} ~ ${formatDateToYMD(end)}`);
  }

  return labels;
}

function generateMonthLabels(months = 5) {
  const labels = [];
  const today = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    labels.push(`${y}-${m}`);
  }

  return labels;
}

async function fetchSummary() {
  if (!organization_id.value) return;

  const endpoint = granularity.value === "week" ? "thisWeek" : "thisMonth";

  try {
    const queryParam = granularity.value === "week" ? "weeks" : "months";
    const res = await api.get(`/report/${endpoint}/${organization_id.value}/${userID}?${queryParam}=5`);
    
    summaryData1.value = {
      TotalWorkHours: round2(res.data[0].TotalWorkHours),
      TotalOTHours: round2(res.data[0].TotalOTHours),
      OTHoursPerson: round2(res.data[0].OTHoursPerson),
      OTHeadcounts: round2(res.data[0].OTHeadcounts),
    };
    summaryData2.value = {
      TotalWorkHours: round2(res.data[1].TotalWorkHours),
      TotalOTHours: round2(res.data[1].TotalOTHours),
      OTHoursPerson: round2(res.data[1].OTHoursPerson),
      OTHeadcounts: round2(res.data[1].OTHeadcounts),
    };
    summaryData3.value = {
      TotalWorkHours: round2(res.data[2].TotalWorkHours),
      TotalOTHours: round2(res.data[2].TotalOTHours),
      OTHoursPerson: round2(res.data[2].OTHoursPerson),
      OTHeadcounts: round2(res.data[2].OTHeadcounts),
    };
    summaryData4.value = {
      TotalWorkHours: round2(res.data[3].TotalWorkHours),
      TotalOTHours: round2(res.data[3].TotalOTHours),
      OTHoursPerson: round2(res.data[3].OTHoursPerson),
      OTHeadcounts: round2(res.data[3].OTHeadcounts),
    };
    summaryData5.value = {
      TotalWorkHours: round2(res.data[4].TotalWorkHours),
      TotalOTHours: round2(res.data[4].TotalOTHours),
      OTHoursPerson: round2(res.data[4].OTHoursPerson),
      OTHeadcounts: round2(res.data[4].OTHeadcounts),
    };
    updateChart();
  } catch (err) {
    console.error("📛 summary API failed", err);
  }
}

async function fetchAlertList() {
  try {
    const res = await api.get(`/report/AlertList/${formattedStartDate.value}/${formattedEndDate.value}/${userID}`);
    if (res && Array.isArray(res.data)) {
      alertList.value = res.data.map((item) => ({
        EmployeeID: item.EmployeeID,
        Name: item.Name,
        OTCounts: round2(item.OTCounts),
        OTHours: round2(item.OTHours),
        status: item.status,
      }));
    }
  } catch (err) {
    console.error("📛 AlertList API failed", err);
  }
}

async function fetchDepartments() {
  try {
    const res = await api.get(`/report/inChargeDepartment/${userID}`);
    departments.value = res.data;
    if (!selectedDepartment.value && res.data.length > 0) {
      selectedDepartment.value = res.data[0]; 
    }
  } catch (err) {
    console.error("📛 Department API failed", err);
  }
}

watch([selectedDepartment, granularity], () => {
  if (organization_id.value) fetchSummary();
});

watch([formattedStartDate, formattedEndDate], () => {
  fetchAlertList();
});

watch(selectedMetric, () => {
  updateChart(); 
});

onMounted(() => {
  fetchDepartments();
});
</script>

<style>
.v-table .text-center td {
  justify-content: center;
}

.filter {
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.filter2 {
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.datepicker-container {
  width: 100%;
  max-width: 200px;
  min-width: 180px;
}

.custom-datepicker .dp__input {
  width: 100%;
  box-sizing: border-box;
  height: 40px;
  font-size: 14px;
}

.custom-datepicker .dp__menu {
  min-width: unset;
}
</style>
