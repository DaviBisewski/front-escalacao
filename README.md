# Fut Draft - Front-end

Aplicacao web para montar uma escalacao de futebol com jogadores de ligas internacionais, visualizar o time em campo e exportar a arte final em PNG.

Dominio em producao: `https://fut-draft.netlify.app`

## Visao Geral

O front-end foi construido com Vue 3 e Vite, com interface responsiva e foco em uma experiencia rapida de montagem do time.

Fluxo principal da UI:

1. Usuario clica em uma posicao do campo.
2. Um modal abre com jogadores da categoria correta (GK, DEF, MID, ATK).
3. Usuario seleciona o atleta e preenche o slot.
4. Pode limpar a escalacao, nomear o time e exportar a imagem final em PNG.

## Stack de Front-end

- `Vue 3` (Composition API com `<script setup>`)
- `Vite` (build e ambiente de desenvolvimento)
- `Tailwind CSS v4` (estilizacao utilitaria)
- `html2canvas` (captura do campo para exportacao em imagem)

## Funcionalidades da Interface

- Campo tatico com 11 posicoes fixas (LW, ST, RW, CAM, CM1, CM2, LB, CB1, CB2, RB, GK).
- Modal de selecao com filtro por nome, lista por categoria de posicao, pre-carregamento de fotos e fallback visual quando a imagem falha.
- Lista lateral com ligas de referencia (logo, nome e pais).
- Input para nome da escalacao (limite de 40 caracteres).
- Exportacao para PNG com botao de loading e download automatico.
- Layout responsivo (mobile empilhado e desktop em 3 colunas).

## Integracao com API (consumo no front)

Servicos usados no front-end (`src/services/api.js`):

- `GET https://fut-draft-api.onrender.com/players`
- `GET https://fut-draft-api.onrender.com/player-photo?name=<nome>`

Observacao sobre exportacao:

- Na captura PNG, o front tenta converter imagens para base64 antes do `html2canvas`.
- Existe tentativa via proxy local `http://localhost:3000/image-proxy` para contornar CORS; se nao funcionar, usa URL original da imagem.

## Estrutura de Pastas (Front)

```text
src/
	App.vue                      # composicao principal da pagina
	main.js                      # bootstrap da aplicacao Vue
	style.css                    # import do Tailwind e estilos base
	components/
		CampoFutebol.vue           # campo tatico e posicionamento dos slots
		SlotJogador.vue            # card do slot (ocupado/vazio)
		ModalJogadores.vue         # busca e selecao de jogadores
		ListaLigas.vue             # sidebar de ligas
	services/
		api.js                     # camada de consumo da API
```

## Como Rodar Localmente

### Requisitos

- Node.js 18+
- npm

### Passos

```bash
npm install
npm run dev
```

Aplicacao local: `http://localhost:5173`

## Scripts

- `npm run dev` inicia o servidor de desenvolvimento.
- `npm run build` gera a build de producao.
- `npm run preview` executa a build localmente para validacao.

## Deploy

- Deploy do front hospedado no Netlify.
- URL publica: `https://fut-draft.netlify.app`
