<template>
  <q-layout view="lHh Lpr lFf" class="bg-dark text-white overflow-hidden">
    <!-- 粒子背景：始终存在，营造氛围 -->
    <div class="fixed-full -z-10 pointer-events-none">
      <div class="blob blob-purple" style="top: -15%; left: -10%; width: 350px; height: 350px;"></div>
      <div class="blob blob-pink" style="bottom: -10%; right: -15%; width: 300px; height: 300px; animation-delay: -4s;"></div>
      <div class="blob blob-gold" style="top: 40%; right: 10%; width: 200px; height: 200px; animation-delay: -8s;"></div>
    </div>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="page-enter-active"
          leave-active-class="page-leave-active"
          enter-from-class="page-enter-from"
          leave-to-class="page-leave-to"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>
