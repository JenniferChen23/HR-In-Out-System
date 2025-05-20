<template>
  <v-app>
    <v-app-bar app color="white" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROTxcu9w5BKsCZKZHy2Yw8MJAnV6l-9mYp0g&s"
        max-width="40"
        max-height="32"
        class="ml-2"
        contain
      ></v-img>
      <v-toolbar-title style="font-size: 25px; font-weight: bold">HR-In-Out System</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer app v-model="drawer">
      <v-list-item
        :title="userName"
        subtitle="check records below"
      ></v-list-item>
      <v-divider></v-divider>
      <v-list>
        <v-list-item
          button
          @click="goToTodo('/today')"
          class="d-flex align-center"
        >
          <v-icon class="mr-2">mdi-folder-open</v-icon>
          Today
        </v-list-item>
        <v-list-item
          button
          @click="goToTodo('/attendenceLog')"
          class="d-flex align-center"
        >
          <v-icon class="mr-2">mdi-calendar-check</v-icon>
          Attendence Log
        </v-list-item>
        <v-list-item
          button
          @click="goToTodo('/myTeam')"
          class="d-flex align-center"
        >
          <v-icon class="mr-2">mdi-account-group</v-icon>
          My team
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <slot></slot>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "TodayAttendance", 
  components: {},
  setup() {
    const drawer = ref(false);
    const router = useRouter();

    const userName = ref(localStorage.getItem("userName") || "User");

    function goToTodo(page) {
      router.push(page);
    }

    return {
      drawer,
      goToTodo,
      userName,
    };
  },
};
</script>

<style scoped>
h2 {
  margin: 10px auto;
  font-size: 30px;
}

.login-page {
  display: flex;
  flex-direction: column;
  align-items: center; 
  margin-top: 0px;
}
.centered-input {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}
</style>
