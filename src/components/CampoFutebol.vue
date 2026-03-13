<script setup>
import SlotJogador from "./SlotJogador.vue"

const POSICOES = [
  { id: "LW",  label: "LW",  top: "12%", left: "15%"    },
  { id: "ST",  label: "ST",  top:  "9%", left: "50%"    },
  { id: "RW",  label: "RW",  top: "12%", left: "85%"    },
  { id: "CAM", label: "CAM", top: "30%", left: "50%"    },
  { id: "CM1", label: "CM",  top: "38%", left: "27.5%"  },
  { id: "CM2", label: "CM",  top: "38%", left: "72.5%"  },
  { id: "LB",  label: "LB",  top: "57%", left: "12.5%"  },
  { id: "CB1", label: "CB",  top: "63%", left: "35%"    },
  { id: "CB2", label: "CB",  top: "63%", left: "65%"    },
  { id: "RB",  label: "RB",  top: "57%", left: "87.5%"  },
  { id: "GK",  label: "GK",  top: "91%", left: "50%"    },
]

const props = defineProps({
  time: { type: Object, default: () => ({}) }
})

const emit = defineEmits(["selecionar"])
</script>

<template>
  <div class="campo-container">
    <div class="campo">
      <!-- Linhas do campo -->
      <div class="linha-centro"></div>
      <div class="circulo-centro"></div>
      <div class="area-top"></div>
      <div class="area-bottom"></div>
      <div class="gol-top"></div>
      <div class="gol-bottom"></div>

      <!-- Posições -->
      <div
        v-for="pos in POSICOES"
        :key="pos.id"
        class="pos"
        :style="{ top: pos.top, left: pos.left }"
        @click="emit('selecionar', pos.id)"
      >
        <SlotJogador :label="pos.label" :jogador="time[pos.id]" />
      </div>
    </div>
  </div>
</template>

<style scoped>

.campo-container {
  display: flex;
  justify-content: center;
  padding: 24px 12px;
}

.campo {
  position: relative;
  width: min(560px, 92vw);
  aspect-ratio: 4 / 5;
  background: linear-gradient(180deg, #1a6e38 0%, #0f5132 50%, #1a6e38 100%);
  border-radius: 16px;
  overflow: hidden;
  border: 3px solid rgba(255,255,255,0.15);
  box-shadow: 0 16px 50px rgba(0,0,0,0.5);
}

/* Linhas */
.linha-centro {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  width: 100%;
  height: 2px;
  background: rgba(255,255,255,0.25);
  transform: translateY(-50%);
}

.circulo-centro {
  position: absolute;
  top: 50%; left: 50%;
  width: 22%; aspect-ratio: 1;
  border: 2px solid rgba(255,255,255,0.25);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.area-top {
  position: absolute;
  top: 0; left: 50%;
  width: 42%; height: 18%;
  border: 2px solid rgba(255,255,255,0.2);
  border-top: none;
  transform: translateX(-50%);
}

.area-bottom {
  position: absolute;
  bottom: 0; left: 50%;
  width: 42%; height: 18%;
  border: 2px solid rgba(255,255,255,0.2);
  border-bottom: none;
  transform: translateX(-50%);
}

.gol-top {
  position: absolute;
  top: 0; left: 50%;
  width: 18%; height: 6%;
  border: 2px solid rgba(255,255,255,0.2);
  border-top: none;
  transform: translateX(-50%);
}

.gol-bottom {
  position: absolute;
  bottom: 0; left: 50%;
  width: 18%; height: 6%;
  border: 2px solid rgba(255,255,255,0.2);
  border-bottom: none;
  transform: translateX(-50%);
}

/* Posição */
.pos {
  position: absolute;
  text-align: center;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

/* Imagem do jogador */
.pos :deep(.player .img-wrapper) {
  position: relative;
  display: inline-block;
}

.pos :deep(.player img) {
  width: clamp(34px, 9vw, 52px);
  height: clamp(34px, 9vw, 52px);
  border-radius: 50%;
  border: 2px solid #facc15;
  object-fit: cover;
  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
  transition: transform 0.15s;
  display: block;
}

.pos:hover :deep(.player img) {
  transform: scale(1.1);
}

/* Ícone fallback (só aparece se imagem falhar) */
.pos :deep(.player .fallback) {
  width: clamp(34px, 9vw, 52px);
  height: clamp(34px, 9vw, 52px);
  border-radius: 50%;
  border: 2px solid #facc15;
  background: rgba(0,0,0,0.4);
  padding: 6px;
  color: rgba(255,255,255,0.7);
  box-shadow: 0 3px 10px rgba(0,0,0,0.4);
}

.pos :deep(.player span) {
  display: block;
  margin-top: 4px;
  font-size: clamp(9px, 2vw, 11px);
  color: white;
  font-weight: 600;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  max-width: clamp(55px, 13vw, 72px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Slot vazio */
.pos :deep(.empty) {
  width: clamp(34px, 9vw, 50px);
  height: clamp(34px, 9vw, 50px);
  background: rgba(0,0,0,0.4);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255,255,255,0.3);
  transition: border-color 0.2s, background 0.2s;
  gap: 1px;
}

.pos:hover :deep(.empty) {
  border-color: #facc15;
  background: rgba(250,204,21,0.15);
}

.pos :deep(.empty span) {
  color: rgba(255,255,255,0.7);
  font-size: clamp(14px, 3.5vw, 18px);
  line-height: 1;
}

.pos :deep(.empty small) {
  color: rgba(255,255,255,0.5);
  font-size: clamp(7px, 1.5vw, 9px);
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>