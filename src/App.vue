<script setup>
import { ref, onMounted } from "vue"
import html2canvas from "html2canvas"
import CampoFutebol from "./components/CampoFutebol.vue"
import ModalJogadores from "./components/ModalJogadores.vue"
import ListaLigas from "./components/ListaLigas.vue"
import { getJogadores } from "./services/api"

const jogadores = ref(null)
const posicaoSelecionada = ref(null)
const modalAberto = ref(false)
const nomeEscalacao = ref("")
const campoRef = ref(null)
const compartilhando = ref(false)

const time = ref({
  GK:null, LB:null, CB1:null, CB2:null, RB:null,
  CM1:null, CM2:null, CAM:null, LW:null, ST:null, RW:null
})

onMounted(async () => {
  jogadores.value = await getJogadores()
})

function abrirEscolha(pos) {
  posicaoSelecionada.value = pos
  modalAberto.value = true
}

function escolherJogador(player) {
  time.value[posicaoSelecionada.value] = player
  modalAberto.value = false
}

function limparEscalacao() {
  Object.keys(time.value).forEach(k => time.value[k] = null)
}

async function toBase64(src) {
  // Tenta via proxy local (evita CORS do servidor de imagens externo)
  const proxySrc = `http://localhost:3000/image-proxy?url=${encodeURIComponent(src)}`
  for (const url of [proxySrc, src]) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const blob = await res.blob()
      const b64 = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
      return b64
    } catch {
      continue
    }
  }
  return null
}

async function compartilhar() {
  if (!campoRef.value) return
  compartilhando.value = true
  try {
    const imgs = Array.from(campoRef.value.querySelectorAll("img"))
    const origSrcs = imgs.map(img => img.src)

    // Converte para base64 apenas as que conseguir — não altera as que falharem
    await Promise.all(imgs.map(async (img, i) => {
      if (!origSrcs[i] || origSrcs[i].startsWith("data:")) return
      const b64 = await toBase64(origSrcs[i])
      if (b64) img.src = b64
    }))

    // Aguarda um tick para o browser aplicar os novos srcs
    await new Promise(r => setTimeout(r, 100))

    const canvas = await html2canvas(campoRef.value, {
      backgroundColor: "#09090b",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 0,
    })

    // Restaura todos os srcs originais
    imgs.forEach((img, i) => { img.src = origSrcs[i] })

    const link = document.createElement("a")
    const nome = nomeEscalacao.value.trim() || "minha-escalacao"
    link.download = `${nome}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  } catch (e) {
    console.error("Erro ao exportar:", e)
  } finally {
    compartilhando.value = false
  }
}
</script>

<template>

<div class="min-h-screen bg-zinc-950 text-white flex flex-col">

  <!-- Header -->
  <header class="py-7 px-6 text-center border-b border-zinc-800">
    <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
      Monte sua Escalação com os Jogadores<br/>
      <span class="text-yellow-400">das Melhores Ligas do Mundo 🌍</span>
    </h1>
    <p class="text-zinc-500 text-sm mt-2">Clique em uma posição no campo para escolher o jogador</p>
  </header>

  <!-- Main: 3 colunas desktop / empilhado mobile -->
  <main class="flex-1 flex flex-col lg:flex-row lg:items-start gap-6 px-4 py-6 max-w-screen-xl mx-auto w-full">

    <!-- Coluna esquerda: Ligas (mobile: aparece por último) -->
    <div class="order-3 lg:order-1 lg:w-52 lg:shrink-0 lg:sticky lg:top-6">
      <ListaLigas />
    </div>

    <!-- Coluna centro: Campo (mobile: aparece primeiro) -->
    <div class="order-1 lg:order-2 flex-1 flex justify-center">
      <!-- wrapper capturado pelo html2canvas -->
      <div ref="campoRef" class="campo-capture">
        <p v-if="nomeEscalacao" class="capture-titulo">{{ nomeEscalacao }}</p>
        <CampoFutebol
          :time="time"
          @selecionar="abrirEscolha"
        />
      </div>
    </div>

    <!-- Coluna direita: Ações (mobile: aparece segundo) -->
    <div class="order-2 lg:order-3 lg:w-72 lg:shrink-0 lg:sticky lg:top-6 flex flex-col gap-10 w-full">

      <!-- Botão limpar -->
      <button
        @click="limparEscalacao"
        class="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-red-500/15 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 font-semibold text-zinc-300 transition-colors w-full justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
        </svg>
        Limpar escalação
      </button>

      <!-- Nome + Compartilhar -->
      <div class="w-full flex flex-col gap-4 p-5 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div>
          <label class="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Nome da escalação</label>
          <input
            v-model="nomeEscalacao"
            placeholder="Ex: Meu time dos sonhos"
            maxlength="40"
            class="w-full px-3 py-2.5 rounded-lg bg-zinc-800 text-white placeholder-zinc-600 outline-none focus:ring-2 focus:ring-yellow-400/40 transition"
          />
          <p class="text-xs text-zinc-600 mt-1.5">{{ nomeEscalacao.length }}/40 caracteres</p>
        </div>

        <div class="border-t border-zinc-800 pt-4">
          <p class="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Exportar escalação</p>
          <p class="text-xs text-zinc-600 mb-3">Gera um PNG com o campo e os jogadores escolhidos.</p>
          <button
            @click="compartilhar"
            :disabled="compartilhando"
            class="flex items-center justify-center gap-2.5 w-full px-4 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-black font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="!compartilhando" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ compartilhando ? 'Gerando PNG...' : 'Exportar como PNG' }}
          </button>
        </div>
      </div>

    </div>

  </main>

  <ModalJogadores
    v-if="modalAberto"
    :jogadores="jogadores"
    :posicao="posicaoSelecionada"
    @fechar="modalAberto=false"
    @escolher="escolherJogador"
  />

</div>

</template>

<style scoped>
.campo-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #09090b;
  border-radius: 16px;
  padding-top: 8px;
}

.capture-titulo {
  font-size: 18px;
  font-weight: 800;
  color: #facc15;
  letter-spacing: 0.02em;
  margin-bottom: 4px;
  text-align: center;
}
</style>