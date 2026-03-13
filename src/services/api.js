const API_URL = "https://fut-draft-api.onrender.com/players"

export async function getJogadores() {
  const res = await fetch(API_URL)
  return await res.json()
}

export async function getPlayerPhoto(name){

const res = await fetch(
`https://fut-draft-api.onrender.com/player-photo?name=${encodeURIComponent(name)}`
)

return await res.json()

}