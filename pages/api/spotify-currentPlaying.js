const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env

const getAccessToken = async () => {
  const resRefreshToken = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    }
  )
  const refreshToken = await resRefreshToken.json()

  return refreshToken
}

export const getNowPlaying = async () => {
  const { access_token } = await getAccessToken()

  return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
  })
}

export default async (_, res) => {
  const response = await getNowPlaying()

  if (response.status === 204 || response.status > 400) {
    return res.status(200).json({ isPlaying: false })
  }

  const currentPlaying = await response.json()
  const isPlaying = currentPlaying.is_playing

  return res.status(200).json({
    currentPlaying,
    isPlaying,
  })
}
