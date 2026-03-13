<script setup>
import { ref, computed, watch } from "vue"
import { getPlayerPhoto } from "../services/api"

const props = defineProps({
  jogadores: { default: null },
  posicao: { type: String, default: null }
})

const emit = defineEmits(["fechar", "escolher"])

const busca = ref("")
const fotos = ref({})

function onImgError(e) {
  e.target.style.display = "none"
  e.target.nextElementSibling?.classList.remove("hidden")
}

async function carregarFoto(nome){

  if(fotos.value[nome]) return

  try{

    const data = await getPlayerPhoto(nome)

    if(data?.image){

      fotos.value[nome] = data.image

    }

  }catch(e){

    console.log("erro ao buscar foto")

  }

}

function normalizar(texto) {
  return (texto ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

const mapaPosicoes = {
  GK: "Goalkeepers",

  CB1: "Defenders",
  CB2: "Defenders",
  LB: "Defenders",
  RB: "Defenders",

  CM1: "Midfielders",
  CM2: "Midfielders",
  CAM: "Midfielders",

  LW: "Forwards",
  RW: "Forwards",
  ST: "Forwards"
}

const lista = computed(() => {

  if (!props.jogadores) return []

  const categoria = mapaPosicoes[props.posicao]

  let jogadoresPosicao = []

  if(categoria){
    jogadoresPosicao = props.jogadores[categoria] || []
  }

  const todosJogadores = [
    ...(props.jogadores.Goalkeepers ?? []),
    ...(props.jogadores.Defenders ?? []),
    ...(props.jogadores.Midfielders ?? []),
    ...(props.jogadores.Forwards ?? [])
  ]

  const termo = normalizar(busca.value)

  // se estiver pesquisando pelo nome → procurar em TODOS
  if (termo) {

    return todosJogadores
      .filter(j => normalizar(j.name).includes(termo))
      .slice(0,50)

  }

  // se não estiver pesquisando → mostrar só da posição
  return jogadoresPosicao.slice(0,50)

})

watch(lista,(novaLista)=>{

  novaLista.slice(0,20).forEach(j=>{
    carregarFoto(j.name)
  })

})
</script>

<template>

<div class="modal-overlay fixed inset-0 bg-black/75 backdrop-blur-sm flex justify-center items-center z-50" @click.self="emit('fechar')">

<div class="modal-box bg-zinc-900 w-[420px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden">

<!-- Header -->
<div class="flex justify-between items-center px-5 py-4 border-b border-zinc-800">

<div>
<h2 class="font-bold text-lg leading-tight">
{{ posicao ? `Escolher para ${posicao}` : 'Escolher Jogador' }}
</h2>

<p class="text-xs text-zinc-400 mt-0.5">
{{ lista.length }} jogadores encontrados
</p>

</div>

<button
@click="emit('fechar')"
class="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
>

<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
<path d="M18 6L6 18M6 6l12 12"/>
</svg>

</button>

</div>

<!-- Search -->
<div class="px-4 pt-4 pb-2">

<div class="relative">

<svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
<circle cx="11" cy="11" r="8"/>
<path d="m21 21-4.35-4.35"/>
</svg>

<input
v-model="busca"
placeholder="Buscar jogador..."
autofocus
class="w-full pl-9 pr-4 py-2.5 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
/>

</div>

</div>

<!-- Lista -->
<div class="max-h-80 overflow-y-auto px-4 pb-4 space-y-1.5">

<div
v-for="j in lista"
:key="j.name"
@click="emit('escolher', {...j, image: fotos[j.name] || j.image})"
class="group flex items-center gap-3 p-2.5 rounded-xl bg-zinc-800 hover:bg-yellow-400 cursor-pointer transition-colors duration-150"
>

<div class="relative shrink-0 w-11 h-11">

<img
:src="fotos[j.name] || j.image"
@error="onImgError"
class="w-11 h-11 rounded-full object-cover ring-2 ring-zinc-700 group-hover:ring-yellow-300 transition-all"
/>

<svg class="fallback hidden absolute inset-0 w-11 h-11 rounded-full bg-zinc-700 p-2.5 text-zinc-400 ring-2 ring-zinc-600 group-hover:ring-yellow-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
<circle cx="12" cy="8" r="4"/>
<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
</svg>

</div>

<div class="flex-1 min-w-0">

<p class="font-semibold truncate group-hover:text-black">
{{ j.name }}
</p>

<p class="text-xs text-zinc-400 group-hover:text-black/60 truncate">
{{ j.team }}
</p>

</div>

<span class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-700 group-hover:bg-black/20 group-hover:text-black text-zinc-300 shrink-0">
{{ j.posicao }}
</span>

</div>

<div v-if="lista.length === 0" class="text-center text-zinc-500 py-10">

<svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mx-auto mb-2 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
<circle cx="11" cy="11" r="8"/>
<path d="m21 21-4.35-4.35"/>
</svg>

Nenhum jogador encontrado

</div>

</div>

</div>

</div>

</template>

<style scoped>

.modal-overlay{
animation:fadeIn .2s ease;
}

.modal-box{
animation:slideUp .2s ease;
}

@keyframes fadeIn{
from{opacity:0}
to{opacity:1}
}

@keyframes slideUp{
from{opacity:0;transform:scale(.95) translateY(8px)}
to{opacity:1;transform:scale(1) translateY(0)}
}

</style>