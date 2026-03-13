<script setup>
import { ref, onMounted } from "vue"
import html2canvas from "html2canvas"
import CampoFutebol from "./components/CampoFutebol.vue"
import ModalJogadores from "./components/ModalJogadores.vue"
import ListaLigas from "./components/ListaLigas.vue"
import { getJogadores } from "./services/api"

// ─── Estado global da aplicação ──────────────────────────
const jogadores = ref(null)        // todos os jogadores carregados da API
const posicaoSelecionada = ref(null) // posição que está sendo preenchida
const modalAberto = ref(false)
const nomeEscalacao = ref("")      // nome dado pelo usuário à escalação
const campoRef = ref(null)         // ref do elemento capturado pelo html2canvas
const compartilhando = ref(false)  // flag para estado de loading do export

// ─── Escalação: 11 posições, inicialmente vazias ─────────
const time = ref({
  GK: null, LB: null, CB1: null, CB2: null, RB: null,
  CM1: null, CM2: null, CAM: null, LW: null, ST: null, RW: null,
})

// ─── Carrega jogadores ao montar o componente ─────────────
onMounted(async () => {
  jogadores.value = await getJogadores()
})

// ─── Funções da escalação ─────────────────────────────────
function abrirEscolha(pos) {
  posicaoSelecionada.value = pos
  modalAberto.value = true
}

function escolherJogador(player) {
  time.value[posicaoSelecionada.value] = player
  modalAberto.value = false
}

function limparEscalacao() {
  Object.keys(time.value).forEach(k => (time.value[k] = null))
}

// ─── Export PNG ───────────────────────────────────────────
// Converte URL de imagem para base64 via proxy local para evitar CORS
async function toBase64(src) {
  const proxySrc = `http://localhost:3000/image-proxy?url=${encodeURIComponent(src)}`
  for (const url of [proxySrc, src]) {
    try {
      const res = await fetch(url)
      if (!res.ok) continue
      const blob = await res.blob()
      return await new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      })
    } catch { continue }
  }
  return null
}

// Captura o campo como PNG e faz download
async function compartilhar() {
  if (!campoRef.value) return
  compartilhando.value = true
  try {
    const imgs = Array.from(campoRef.value.querySelectorAll("img"))
    const origSrcs = imgs.map(img => img.src)

    // substitui srcs por base64 antes de capturar
    await Promise.all(imgs.map(async (img, i) => {
      if (!origSrcs[i] || origSrcs[i].startsWith("data:")) return
      const b64 = await toBase64(origSrcs[i])
      if (b64) img.src = b64
    }))

    await new Promise(r => setTimeout(r, 100))

    const canvas = await html2canvas(campoRef.value, {
      backgroundColor: "#09090b",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 0,
    })

    // restaura os srcs originais após captura
    imgs.forEach((img, i) => { img.src = origSrcs[i] })

    const link = document.createElement("a")
    link.download = `${nomeEscalacao.value.trim() || "minha-escalacao"}.png`
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

  <!-- Cabeçalho principal da página -->
  <header class="py-7 px-6 text-center border-b border-zinc-800">
    <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
      Monte sua Escalação com os Jogadores<br/>
      <span class="text-yellow-400">das Melhores Ligas do Mundo 🌍</span>
    </h1>
    <p class="text-zinc-500 text-sm mt-2">Clique em uma posição no campo para escolher o jogador</p>
  </header>

  <!-- Layout principal: 3 colunas no desktop, empilhado no mobile -->
  <main class="flex-1 flex flex-col lg:flex-row lg:items-start gap-6 px-4 py-6 max-w-screen-xl mx-auto w-full">

    <!-- Coluna esquerda: lista das ligas disponíveis (aparece por último no mobile) -->
    <div class="order-3 lg:order-1 lg:w-52 lg:shrink-0 lg:sticky lg:top-6">
      <ListaLigas />
    </div>

    <!-- Coluna central: campo de futebol (aparece primeiro no mobile) -->
    <div class="order-1 lg:order-2 flex-1 flex justify-center">
      <!-- div capturada pelo html2canvas ao exportar PNG -->
      <div ref="campoRef" class="campo-capture">
        <p v-if="nomeEscalacao" class="capture-titulo">{{ nomeEscalacao }}</p>
        <CampoFutebol :time="time" @selecionar="abrirEscolha" />
      </div>
    </div>

    <!-- Coluna direita: ações (aparece segundo no mobile) -->
    <div class="order-2 lg:order-3 lg:w-72 lg:shrink-0 lg:sticky lg:top-6 flex flex-col gap-10 w-full">

      <!-- Botão para limpar toda a escalação -->
      <button
        @click="limparEscalacao"
        class="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-red-500/15 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 font-semibold text-zinc-300 transition-colors w-full justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
        </svg>
        Limpar escalação
      </button>

      <!-- Card: nomear e exportar a escalação como PNG -->
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

  <!-- Modal de seleção de jogador (montado apenas quando aberto) -->
  <ModalJogadores
    v-if="modalAberto"
    :jogadores="jogadores"
    :posicao="posicaoSelecionada"
    @fechar="modalAberto = false"
    @escolher="escolherJogador"
  />

</div>
</template>

<style scoped>
/* Wrapper capturado pelo html2canvas: inclui o nome e o campo */
.campo-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #09090b;
  border-radius: 16px;
  padding-top: 8px;
}

/* Título da escalação exibido acima do campo no PNG exportado */
.capture-titulo {
  font-size: 18px;
  font-weight: 800;
  color: #facc15;
  letter-spacing: 0.02em;
  margin-bottom: 4px;
  text-align: center;
}
</style>