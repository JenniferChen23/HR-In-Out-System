<template>
  <div class="text-center">
    <v-btn prepend-icon="mdi-export" color="black">
      <slot />
      <!-- 這裡會顯示父元件傳進來的內容 -->
    </v-btn>
  </div>
</template>
