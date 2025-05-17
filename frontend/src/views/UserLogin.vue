<template>
  <SideBar>
    <div class="login-page" style="text-align: center; margin-top: 60px">
      <img
        src="https://upload.wikimedia.org/wikipedia/zh/thumb/8/83/Taiwan_Semiconductor_Manufacturing_Co_logo.svg/1200px-Taiwan_Semiconductor_Manufacturing_Co_logo.svg.png"
        alt="TSMC Logo"
        style="max-width: 100px; max-height: 100px"
        class="login-icon"
      />
      <h2>Login</h2>
      <v-text-field
        clearable
        label="E-mail"
        variant="outlined"
        class="centered-input"
        v-model="email"
      />
      <v-text-field
        clearable
        label="Password"
        variant="outlined"
        v-model="password"
        class="centered-input"
      />

      <v-btn height:20px variant="tonal" @click="login"> Submit </v-btn>
    </div>
  </SideBar>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/api"; // @ 代表 src 目錄

// 用 ref 來存使用者輸入
const email = ref("");
const password = ref("");

const router = useRouter();

async function login() {
  try {
    const response = await api.post("/api/auth/login", {
      email: email.value, // 用變數帶入
      password: password.value, // 用變數帶入
    });

    const { message, token, user } = response.data;

    console.log(message); // "Login successful"
    console.log(token); // "your.jwt.token"
    console.log(user); // { id: 1, email: "...", name: "John Doe" }

    localStorage.setItem("jwt", token);
    localStorage.setItem("userID", user.EmployeeID);
    router.push("/today");
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
  }
}
</script>

<style scoped>
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
