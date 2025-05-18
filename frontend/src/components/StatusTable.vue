<!-- src/components/DataTable.vue -->
<template>
  <v-data-table
    :headers="resolvedHeaders"
    :items="items"
    :search="search"
    class="elevation-1 text-center"
  >
    <!-- 自己畫 header -->
    <template v-slot:headers>
      <tr>
        <th
          v-for="header in resolvedHeaders"
          :key="header.value"
          :class="[
            'custom-header text-center',
            header.value === 'employeeId' ? 'sticky-col left-col' : '',
            header.value === 'name' ? 'sticky-col left-col-2' : '',
          ]"
        >
          {{ header.text }}
        </th>
      </tr>
    </template>

    <!-- 自己畫每一行 -->
    <template v-slot:item="{ item }">
      <tr>
        <td class="sticky-col left-col">{{ item.employeeId }}</td>
        <td class="sticky-col left-col-2">{{ item.name }}</td>
        <template v-for="header in dynamicHeaders" :key="header.value">
          <td>
            <StatusCard :content="item[header.value]?.status || '-'" @click="() => openDetail(item, header.value)"/>
          </td>
        </template>
      </tr>
    </template>
  </v-data-table>
  <v-dialog
      v-model="showDetail"
      persistent
      width="600"
      >
      <v-card>
        <v-card-title class="text-h6 font-weight-bold text-center">
          Attendance Detail
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text>
          <v-row dense>
            <v-col cols="6" class="mb-2">
              <strong>Date:</strong><br />{{ detailData.date }}
            </v-col>
            <v-col cols="6" class="mb-2">
              <strong>Employee ID:</strong><br />{{ detailData.employeeId }}
            </v-col>

            <v-col cols="6" class="mb-2">
              <strong>Name:</strong><br />{{ detailData.name }}
            </v-col>
            <v-col cols="6" class="mb-2">
              <strong>Status:</strong><br />{{ detailData.status }}
            </v-col>

            <v-col cols="6" class="mb-2">
              <strong>Clock-in Time:</strong><br />{{ detailData.clockInTime }}
            </v-col>
            <v-col cols="6" class="mb-2">
              <strong>Clock-in Gate:</strong><br />{{ detailData.clockInGate }}
            </v-col>

            <v-col cols="6" class="mb-2">
              <strong>Clock-out Time:</strong><br />{{ detailData.clockOutTime }}
            </v-col>
            <v-col cols="6" class="mb-2">
              <strong>Clock-out Gate:</strong><br />{{ detailData.clockOutGate }}
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pt-0">
          <v-btn color="black" variant="tonal" class="ma-auto px-4" @click="showDetail = false">Close</v-btn>
        </v-card-actions>
      </v-card>

  </v-dialog>
</template>

<script>
import { ref, toRaw } from "vue";
import StatusCard from "./StatusCard.vue";

export default {
  name: "StatusTable",
  components: {
    StatusCard,
  },
  props: {
    headers: { type: Array, required: true },
    items: {
      type: Array,
      required: true,
    },
    search: {
      type: String,
      default: "",
    },
  },
  setup() {
    const showDetail = ref(false);  // 控制 dialog 開關
    const detailData = ref({
      date: '',
      employeeId: '',
      name: '',
      status: '',
      clockInTime: '',
      clockInGate: '',
      clockOutTime: '',
      clockOutGate: '',
    });

    // 這個是點擊 StatusCard 時要呼叫的
    function openDetail(item, dateKey) {
      const detail = item[dateKey];
      detailData.value = {
        date: dateKey,
        employeeId: item.employeeId,
        name: item.name,
        status: detail?.status || "-",
        clockInTime: detail?.clockInTime || "-",
        clockInGate: detail?.clockInGate || "-",
        clockOutTime: detail?.clockOutTime || "-",
        clockOutGate: detail?.clockOutGate || "-",
      };
      showDetail.value = true;
    }

    return {
      showDetail,
      detailData,
      openDetail,
    };
  },
  computed: {
    resolvedHeaders() {
      const finalHeaders = Array.isArray(this.headers) ? this.headers : this.headers.value;
      return toRaw(finalHeaders);
    },
    dynamicHeaders() {
      return this.resolvedHeaders.filter(
        (header) =>
          header.value !== "employeeId" &&
          header.value !== "name"
      );
    },
  },
};
</script>

<style scoped>
.custom-header {
  background-color: #f5f5f5;
  color: black;
  font-weight: bold;
  text-align: center;
}
.sticky-col {
  position: sticky;
  background-color: rgb(255, 255, 255);
  z-index: 2;
}

.left-col {
  left: 0;
  min-width: 120px;
}

.left-col-2 {
  left: 120px;
  min-width: 160px;
  border-right: 1px solid #ccc;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}
</style>
