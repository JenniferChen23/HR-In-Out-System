<template>
  <v-card
    :class="statusClass"
    variant="tonal"
    color="black"
    style="margin: 10px"
    v-if="content"
    flat
  >
    <v-card-text
      style="display: flex; align-items: center; justify-content: center"
    >
      {{ content }}
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  content: {
    type: String,
    required: true,
    default: "",
  },
});

const statusClass = computed(() => {
  switch (props.content) {
    case "On Time":
      return "on-time";
    case "Late":
      return "late";
    case "Leave Early":
      return "leave-early";
    case "Absent":
      return "absent";
    case "Abnormal":
      return "abnormal";
    case "Day Off":
      return "day-off";
    case "Alert":
      return "alert"; 
    case "Warning":
      return "warning"; 
    default:
      return ""; 
  }
});
</script>

<style scoped>
.on-time {
  background-color: rgba(30, 154, 108, 0.3); 
}

.late {
  background-color: rgba(223, 155, 8, 0.3); 
}

.leave-early {
  background-color: rgba(255, 165, 0, 0.3); 
}

.absent {
  background-color: rgba(255, 255, 0, 0.3); 
}

.abnormal {
  background-color: rgba(255, 0, 0, 0.3); 
}

.day-off {
  background-color: transparent;
  color: #666666;
}
.alert {
  background-color: #fcd12a;
}
.warning {
  background-color: red;
}
</style>
