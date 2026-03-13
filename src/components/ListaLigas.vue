<script setup>
const LIGAS = [
  {
    nome: "Premier League",
    pais: "Inglaterra",
    logo: "https://media.api-sports.io/football/leagues/39.png"
  },
  {
    nome: "Brasileirão",
    pais: "Brasil",
    logo: "https://media.api-sports.io/football/leagues/71.png"
  },
  {
    nome: "Serie A",
    pais: "Itália",
    logo: "https://media.api-sports.io/football/leagues/135.png"
  },
  {
    nome: "Ligue 1",
    pais: "França",
    logo: "https://media.api-sports.io/football/leagues/61.png"
  },
  {
    nome: "Süper Lig",
    pais: "Turquia",
    logo: "https://media.api-sports.io/football/leagues/203.png"
  },
  {
    nome: "Bundesliga",
    pais: "Alemanha",
    logo: "https://media.api-sports.io/football/leagues/78.png"
  },
  {
    nome: "MLS",
    pais: "EUA",
    logo: "https://media.api-sports.io/football/leagues/253.png"
  },
  {
    nome: "La Liga",
    pais: "Espanha",
    logo: "https://media.api-sports.io/football/leagues/140.png"
  },
  {
    nome: "Eredivisie",
    pais: "Holanda",
    logo: "https://media.api-sports.io/football/leagues/88.png"
  },
  {
    nome: "Saudi Pro League",
    pais: "Arábia Saudita",
    logo: "https://media.api-sports.io/football/leagues/307.png"
  },
  {
    nome: "Liga Portugal",
    pais: "Portugal",
    logo: "https://media.api-sports.io/football/leagues/94.png"
  },
]
</script>

<template>
  <aside class="ligas-aside">
    <h2 class="ligas-titulo">Ligas</h2>
    <ul class="ligas-lista">
      <li
        v-for="liga in LIGAS"
        :key="liga.nome"
        class="liga-item"
      >
        <div class="liga-logo-wrap">
          <img
            :src="liga.logo"
            :alt="liga.nome"
            class="liga-logo"
            @error="e => e.target.style.display='none'"
          />
        </div>
        <div class="liga-info">
          <p class="liga-nome">{{ liga.nome }}</p>
          <p class="liga-pais">{{ liga.pais }}</p>
        </div>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.ligas-aside {
  width: 100%;
  background: #09090b;
  border: 1px solid #27272a;
  border-radius: 14px;
  padding: 16px 14px;
}

.ligas-titulo {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #71717a;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #27272a;
}

.ligas-lista {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.liga-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 8px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: background 0.15s, border-color 0.15s;
  cursor: default;
}

.liga-item:hover {
  background: #18181b;
  border-color: #3f3f46;
}

.liga-logo-wrap {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.liga-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.liga-nome {
  font-size: 13px;
  font-weight: 600;
  color: #e4e4e7;
  white-space: nowrap;
}

.liga-pais {
  font-size: 11px;
  color: #52525b;
}
</style>
