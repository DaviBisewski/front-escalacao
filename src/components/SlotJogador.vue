<script setup>
import { ref } from "vue"

defineProps({
  label: { type: String, required: true },
  jogador: { default: null }
})

function onImgError(e) {
  e.target.style.display = "none"
  e.target.nextElementSibling?.classList.remove("hidden")
}
</script>

<template>
  <div v-if="jogador" class="player">
    <div class="img-wrapper">
      <img :src="jogador.image" :alt="jogador.name" @error="onImgError" />
      <!-- ícone só aparece se a imagem falhar -->
      <svg class="fallback hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    </div>
    <span>{{ jogador.name }}</span>
  </div>
  <div v-else class="empty">
    <span>+</span>
    <small>{{ label }}</small>
  </div>
</template>
