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
              <p>Selected Department: {{ organization_id }}</p>
            </v-card>
          </v-col>
        </v-row>
        <!-- 放總體出勤分析表 -->
        <v-row>
          <v-col><h2>Over Time Summary</h2></v-col>
          <v-col cols="auto">
            <v-btn variant="tonal" color="blue" @click="thisMonthSummary">
              This Month
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn variant="tonal" color="blue" @click="thisWeekSummary">
              This Week
            </v-btn>
          </v-col>
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
                        :totalWorkHours="summaryData.TotalWorkHours"
                        :unit="'hr'"
                        :timeUnit="currentPeriod"
                        :lastRecord="LastSummary.TotalWorkHours"
                      />
                    </td>
                    <td>
                      <WorkSummaryCard
                        :totalWorkHours="summaryData.TotalOTHours"
                        :unit="'hr'"
                        :timeUnit="currentPeriod"
                        :lastRecord="LastSummary.TotalOTHours"
                      />
                    </td>
                    <td>
                      <WorkSummaryCard
                        :totalWorkHours="summaryData.OTHoursPerson"
                        :unit="'hr'"
                        :timeUnit="currentPeriod"
                        :lastRecord="LastSummary.OTHoursPerson"
                      />
                    </td>
                    <td>
                      <WorkSummaryCard
                        :totalWorkHours="summaryData.OTHeadcounts"
                        :unit="'p'"
                        :timeUnit="currentPeriod"
                        :lastRecord="LastSummary.OTHeadcounts"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
        <!-- 長條圖 -->
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
              <v-radio label="Day" value="day"></v-radio>
              <v-radio label="Week" value="week"></v-radio>
              <v-radio label="Month " value="month"></v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row class="mb-6">
          <bar-chart
            :data="data"
            :granularity="granularity"
            :labels="LabelData"
            :startDate="Startdate"
            :endDate="Enddate"
            title="OT-HeadCounts"
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
import { onMounted, ref, computed, watch } from "vue";
import SideBar from "../components/SideBar.vue";
import SelectBox from "../components/SelectBox.vue";
import WorkSummaryCard from "../components/SummaryCard.vue";
import DataTable from "../components/DataTable.vue";
import BarChart from "../components/BarChart.vue";
import api from "@/api";

const selectedDepartment = ref();

const startDatePicker = ref(null);
const endDatePicker = ref(null);
const granularity = ref("");

const userID = localStorage.getItem("userID") || "";
const departments = ref([]);

const summaryData = ref([]);
const LastSummary = ref([]);
//const items = ref([]);
const currentPeriod = ref("week"); // 'week' 或 'month'

const Startdate = ref(new Date());
const Enddate = ref(new Date());

const formattedStartDate = computed(() => formatDateToYMD(Startdate.value));
const formattedEndDate = computed(() => formatDateToYMD(Enddate.value));

const alertList = ref([]);

function formatDateToYMD(date) {
  if (!(date instanceof Date)) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份從 0 開始
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

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
const organization_id = computed(() => {
  const found = organizations.find(
    (item) => item.name === selectedDepartment.value
  );
  return found?.organization_id ?? null;
});

watch(departments, (newList) => {
  if (newList.length > 0 && !selectedDepartment.value) {
    selectedDepartment.value = newList[0];
  }
});

watch(selectedDepartment, () => {
  if (currentPeriod.value === "week") {
    thisWeekSummary();
  } else if (currentPeriod.value === "month") {
    thisMonthSummary();
  }
});

watch([formattedStartDate, formattedEndDate], () => {
  fetchAlertList();
});

async function fetchDepartments() {
  try {
    const response = await api.get(`/report/inChargeDepartment/${userID}`);

    departments.value = response.data;
  } catch (error) {
    console.error("無法取得部門資料", error);
  }
}
function round2(num) {
  return Math.round(num * 100) / 100;
}

async function thisWeekSummary() {
  currentPeriod.value = "week";

  try {
    const response = await api.get(
      `/report/thisWeek/${organization_id.value}/${userID}`
    );

    summaryData.value = {
      TotalWorkHours: round2(response.data[0].TotalWorkHours),
      TotalOTHours: round2(response.data[0].TotalOTHours),
      OTHoursPerson: round2(response.data[0].OTHoursPerson),
      OTHeadcounts: round2(response.data[0].OTHeadcounts),
    };

    LastSummary.value = {
      TotalWorkHours: round2(response.data[1].TotalWorkHours),
      TotalOTHours: round2(response.data[1].TotalOTHours),
      OTHoursPerson: round2(response.data[1].OTHoursPerson),
      OTHeadcounts: round2(response.data[1].OTHeadcounts),
    };
  } catch (error) {
    console.error("無法取得周總體資料", error);
  }
}
async function thisMonthSummary() {
  currentPeriod.value = "month";

  try {
    const response = await api.get(
      `/report/thisMonth/${organization_id.value}/${userID}`
    );

    summaryData.value = {
      TotalWorkHours: round2(response.data[0].TotalWorkHours),
      TotalOTHours: round2(response.data[0].TotalOTHours),
      OTHoursPerson: round2(response.data[0].OTHoursPerson),
      OTHeadcounts: round2(response.data[0].OTHeadcounts),
    };

    LastSummary.value = {
      TotalWorkHours: round2(response.data[1].TotalWorkHours),
      TotalOTHours: round2(response.data[1].TotalOTHours),
      OTHoursPerson: round2(response.data[1].OTHoursPerson),
      OTHeadcounts: round2(response.data[1].OTHeadcounts),
    };
  } catch (error) {
    console.error("無法取得周總體資料", error);
  }
}

async function fetchAlertList() {
  try {
    // const deparementID = await api.get(`/report/myDepartments/${userID}`);
    // deparement = deparementID.data;
    const ans = await api.get(
      `/report/AlertList/${formattedStartDate.value}/${formattedEndDate.value}/${userID}`
    );
    if (ans && Array.isArray(ans.data)) {
      alertList.value = ans.data.map((item) => ({
        EmployeeID: item.EmployeeID,
        Name: item.Name,
        OTCounts: round2(item.OTCounts),
        OTHours: round2(item.OTHours),
        status: item.status,
      }));
    }
  } catch (error) {
    console.error("取得今日紀錄錯誤", error);
  }
}

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

// const summary = [
//   {
//     TotalWorkHours: "5649",
//     TotalOTHours: "369",
//     OTHoursPerson: "12.3",
//     OTHeadcounts: "7",
//   },
// ];

// const testData = [
//   {
//     EmployeeID: "E001",
//     Name: "John Doe",
//     OTCounts: 5,
//     OTHours: 20,
//     status: "Warning",
//   },
//   {
//     EmployeeID: "E002",
//     Name: "Jane Smith",
//     OTCounts: 3,
//     OTHours: 15,
//     status: "Warning",
//   },
//   {
//     EmployeeID: "E003",
//     Name: "Mike Johnson",
//     OTCounts: 8,
//     OTHours: 32,
//     status: "Alert",
//   },
//   {
//     EmployeeID: "E004",
//     Name: "Sarah Lee",
//     OTCounts: 2,
//     OTHours: 10,
//     status: "Alert",
//   },
// ];

const LabelData = ["2024-04/W4", "2024-04/W5", "2024-05/W1"];
const data = [10, 5, 7];

onMounted(() => {
  // const today = new Date();
  // selectedDate.value = format(today, "yyyy-MM-dd");
  fetchDepartments();
  thisWeekSummary();
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
