<template>
  <v-app>
    <SideBar>
      <v-container>
        <v-card title="Today Record" flat>
          <v-table>
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

              <tr></tr>
            </thead>

            <tbody>
              <tr v-for="item in records" :key="item.name" class="text-center">
                <td>{{ item.date }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.ClockInTime }}</td>
                <td>{{ item.ClockOutTime }}</td>
                <td>{{ item.ClockInGate }}</td>
                <td>{{ item.ClockOutGate }}</td>
                <td>
                  <StatusCard :content="item.status" />
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
        <v-spacer></v-spacer>
        <v-card title="History Records" flat>
          <v-row align="center" class="mb-6">
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
          </v-row>
          <!-- 使用 DataTable 組件，並傳遞資料 -->
          <DataTable
            :show-headers="headers.text"
            :items="historyRecords"
            :search="search"
          />
        </v-card>
        <div class="export">
          <ExportButton> Export as CSV </ExportButton>
          <ExportButton> Export as PDF </ExportButton>
        </div>
      </v-container>
    </SideBar>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DataTable from "../components/DataTable.vue";
import SideBar from "../components/SideBar.vue";
import StatusCard from "../components/StatusCard.vue";
import ExportButton from "../components/ExportButton.vue";
import api from "@/api";

const records = ref([]);
let userID = 13;
const search = ref("");

const headers = [
  { text: "Date", value: "date" },
  { text: "Name", value: "name" },
  { text: "ClockInTime", value: "ClockInTime" },
  { text: "ClockOutTime", value: "ClockOutTime" },
  { text: "ClockInGate", value: "ClockInGate" },
  { text: "ClockOutGate", value: "ClockOutGate" },
  { text: "Status", value: "status" },
  // { text: "Duration", value: "Duration" }, //後端沒寫所以先不放
];

async function fetchTodayRecords() {
  try {
    const response = await api.get(`/report/myRecords/${userID}`);
    if (response && response.data) {
      // 包成陣列並轉成 template 用的 key
      records.value = [
        {
          date: response.data.date,
          name: response.data.name,
          ClockInTime: response.data.clock_in_time,
          ClockOutTime: response.data.clock_out_time,
          ClockInGate: response.data.clock_in_gate,
          ClockOutGate: response.data.clock_out_gate,
          status: response.data.status,
        },
      ];
    }
  } catch (error) {
    console.error("取得今日紀錄錯誤", error);
  }
}

const historyRecords = [
  {
    date: "2025-04-25",
    name: "John Doe",
    ClockInTime: "09:00",
    ClockOutTime: "17:00",
    ClockInGate: "Gate A",
    ClockOutGate: "Gate B",
    Duration: "8 hr(s) 38 min(s)",
    status: "Late",
  },
  {
    date: "2025-04-25",
    name: "John Doe",
    checkInTime: "08:45",
    checkOutTime: "17:05",
    checkInGate: "Gate B",
    checkOutGate: "Gate C",
    Duration: "8 hr(s) 38 min(s)",
    status: "On Time",
  },
  {
    date: "2025-04-25",
    name: "John Doe",
    ClockInTime: "09:20",
    ClockOutTime: "16:55",
    ClockInGate: "Gate A",
    ClockOutGate: "Gate A",
    Duration: "8 hr(s) 38 min(s)",
    status: "Late",
  },
  {
    date: "2025-04-25",
    name: "John Doe",
    checkInTime: "08:30",
    checkOutTime: "17:15",
    checkInGate: "Gate C",
    checkOutGate: "Gate B",
    Duration: "8 hr(s) 38 min(s)",
    status: "On Time",
  },
  {
    date: "2025-04-25",
    name: "John Doe",
    ClockInTime: "09:10",
    ClockOutTime: "16:40",
    ClockInGate: "Gate B",
    ClockOutGate: "Gate C",
    Duration: "8 hr(s) 38 min(s)",
    status: "Abnormal",
  },
];
onMounted(() => {
  fetchTodayRecords();
});
</script>

<style scoped>
.export {
  display: flex;
  gap: 10px;
  justify-content: end;
  margin-top: 20px;
}
text {
  color: black;
}
h2 {
  margin: 10px auto;
  font-size: 30px;
}

.login-page {
  display: flex;
  flex-direction: column;
  align-items: center; /* 這樣內容（input, button）就會置中 */
  margin-top: 0px;
}
.centered-input {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}
</style>
