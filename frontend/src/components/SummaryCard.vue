<template>
  <div class="displayAll">
    <h3 class="display">
      {{ totalWorkHours }}
      <p class="Note">{{ unit }}</p>
      <span :style="{ color: arrowColor, marginLeft: '10px' }">
        {{ arrowSymbol }}
      </span>
    </h3>
    <p class="d Note">last {{ timeUnit }}: {{ lastRecord }} {{ unit }}</p>
  </div>
</template>

<script>
export default {
  name: "WorkSummaryCard",
  props: {
    totalWorkHours: {
      type: [String, Number],
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    timeUnit: {
      type: String,
      required: true,
    },
    lastRecord: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    arrowSymbol() {
      if (Number(this.totalWorkHours) > Number(this.lastRecord)) {
        return "↑"; 
      } else if (Number(this.totalWorkHours) < Number(this.lastRecord)) {
        return "↓"; 
      } else {
        return "-"; 
      }
    },
    arrowColor() {
      if (Number(this.totalWorkHours) > Number(this.lastRecord)) {
        return "red";
      } else if (Number(this.totalWorkHours) < Number(this.lastRecord)) {
        return "green";
      } else {
        return "gray";
      }
    },
  },
};
</script>

<style>
.displayAll {
  display: inline-block; 
  text-align: center;
  width: 150px;
  height: 100px;
  padding: 4px;
}
.display {
  display: flex;
  align-items: end;
  justify-content: center;
  font-size: 30px; 
  margin: 1px; 
  width: 100%;
}
.Note {
  color: grey;
  font-size: 9px;
}
.d {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
