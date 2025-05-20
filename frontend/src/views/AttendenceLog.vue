<template>
  <v-app>
    <SideBar>
      <v-container>
        <v-row align="center" class="text-center">
          <v-col cols="auto">
            <h3 class="ma-0">Department</h3>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="selectedDepartment"
              :items="departments"
              item-title="text"
              item-value="value"
              label="Department"
              placeholder="Choose Your Team"
              dense
              outlined
              @update:modelValue="updateData"
            ></v-select>
          </v-col>
        </v-row>
        <v-row align="center" class="text-center mb-2">
          <v-col cols="auto">
            <h3 class="ma-0">Date</h3>
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="selectedDate"
              label="Select Start Date"
              type="date"
              @update:modelValue="updateData"
            />
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-radio-group
              v-model="selectedRangeType"
              row
              hide-details
              class="d-flex align-center ga-2"
              @change="updateData"
            >
              <v-radio label="Week" value="week" />
              <v-radio label="Month" value="month" />
            </v-radio-group>
          </v-col>
        </v-row>
        <StatusTable :headers="headers" :items="items" />
        <v-row justify="center" class="mt-4">
          <v-col cols="auto">
            <v-btn color="black" variant="tonal" @click="exportCSV">
              Export CSV
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn color="black" variant="tonal" @click="exportPDF">
              Export PDF
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </SideBar>
  </v-app>
</template>

<script setup>
import api from "@/api";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { onMounted, ref } from "vue";

import StatusTable from "@/components/StatusTable.vue";
import SideBar from "../components/SideBar.vue";

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

const headers = ref([
  { text: "Employee ID", value: "employeeId" },
  { text: "Name", value: "name" },
]);

const userID = localStorage.getItem("userID") || "";
console.log(userID);
const departments = ref([]);
const selectedDepartment = ref("");
const items = ref([]);
const selectedDate = ref("");
const selectedRangeType = ref("week");

function generateHeaders(baseDate) {
  headers.value = [
    { text: "Employee ID", value: "employeeId" },
    { text: "Name", value: "name" },
  ];

  let startDate, endDate;

  if (selectedRangeType.value === "week") {
    startDate = startOfWeek(baseDate, { weekStartsOn: 1 });
    endDate = endOfWeek(baseDate, { weekStartsOn: 1 });
  } else {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    startDate = new Date(year, month, 1);
    endDate = new Date(year, month + 1, 0);
  }

  let current = new Date(startDate);
  while (current <= endDate) {
    const display = format(current, "MM/dd (EEE)");
    headers.value.push({ text: display, value: display });
    current.setDate(current.getDate() + 1);
  }
}

async function fetchDepartments() {
  try {
    const response = await api.get(`/report/inChargeDepartment/${userID}`);
    const data = response.data;

    departments.value = [
      { text: "All", value: "" },
      ...data.map((depName) => {
        const found = organizations.find((org) => org.name === depName);
        return found
          ? { text: found.name, value: found.organization_id }
          : { text: depName, value: depName }; 
      }),
    ];
  } catch (error) {
    console.error("無法取得部門資料", error);
  }
}

async function fetchAttendanceData() {
  if (!selectedDepartment.value) {
    console.warn("請先選擇部門");
    return;
  }

  const { fromDate, toDate } = getExportRange();

  try {
    const response = await api.get(`/report/attendanceSummary`, {
      params: {
        department: selectedDepartment.value,
        fromDate,
        toDate,
      },
    });

    const data = response.data;
    const grouped = {};

    data.forEach((item) => {
      const dateKey = format(new Date(item.date), "MM/dd (EEE)");
      if (!grouped[item.employeeID]) {
        grouped[item.employeeID] = {
          employeeId: item.employeeID,
          name: item.name,
        };
      }
      grouped[item.employeeID][dateKey] = {
        status: item.status,
        clockInTime: item.ClockInTime,
        clockInGate: item.ClockInGate,
        clockOutTime: item.ClockOutTime,
        clockOutGate: item.ClockOutGate,
      };
    });

    items.value = Object.values(grouped);
  } catch (error) {
    console.error("❌ 無法取得出勤資料", error.response?.data || error.message);
  }
}

function getExportRange() {
  const baseDate = new Date(selectedDate.value);
  if (selectedRangeType.value === "week") {
    const fromDate = format(
      startOfWeek(baseDate, { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    );
    const toDate = format(
      endOfWeek(baseDate, { weekStartsOn: 1 }),
      "yyyy-MM-dd"
    );
    return { fromDate, toDate };
  } else {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const fromDate = format(new Date(year, month, 1), "yyyy-MM-dd");
    const toDate = format(new Date(year, month + 1, 0), "yyyy-MM-dd"); 
    return { fromDate, toDate };
  }
}

function downloadFile(url, filename) {
  api
    .get(url, {
      responseType: "blob",
    })
    .then((response) => {
      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.error("❌ 匯出失敗", error.response?.data || error.message);
    });
}

function exportCSV() {
  if (!selectedDepartment.value || !selectedDate.value) return;

  const { fromDate, toDate } = getExportRange();
  const url = `/report/attendanceExportCSV?department=${selectedDepartment.value}&fromDate=${fromDate}&toDate=${toDate}`;
  downloadFile(url, `Attendance_${fromDate}_${toDate}.csv`);
}

function exportPDF() {
  if (!selectedDepartment.value || !selectedDate.value) return;

  const { fromDate, toDate } = getExportRange();
  const url = `/report/attendanceExportPDF?department=${selectedDepartment.value}&fromDate=${fromDate}&toDate=${toDate}`;
  downloadFile(url, `Attendance_${fromDate}_${toDate}.pdf`);
}

function updateData() {
  if (!selectedDate.value) return;
  const baseDate = new Date(selectedDate.value);
  generateHeaders(baseDate);
  fetchAttendanceData();
}

onMounted(() => {
  const today = new Date();
  selectedDate.value = format(today, "yyyy-MM-dd");
  selectedDepartment.value = "";
  generateHeaders(today);
  fetchDepartments();
});
</script>
