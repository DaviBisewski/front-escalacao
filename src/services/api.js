const API_URL = "http://localhost:3000/players"

export async function getJogadores() {
  const res = await fetch(API_URL)
  return await res.json()
}

export async function getPlayerPhoto(name){

const res = await fetch(
`http://localhost:3000/player-photo?name=${encodeURIComponent(name)}`
)

return await res.json()

}