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

export const getNowPlaying = async (access_token) => {

  return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
  })
}

export const getNowPlayingPlaylist = async (access_token, url) => {

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
  })
}

export const getPlaybackState = async (access_token) => {

  return fetch("https://api.spotify.com/v1/me/player", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + access_token,
      "Content-Type": "application/json",
    },
  })
}

export default async (_, res) => {
  const { access_token } = await getAccessToken()
  const responseNowPlaying = await getNowPlaying(access_token)

  if (responseNowPlaying.status === 204 || responseNowPlaying.status > 400) {
    return res.status(200).json({ isPlaying: false })
  }
  const currentPlaying = await responseNowPlaying.json()
  //

  //
  const responsePlaybackState = await getPlaybackState(access_token)

  if (
    responsePlaybackState.status === 204 ||
    responsePlaybackState.status > 400
  ) {
    return res.status(200).json({ isPlaying: false })
  }
  const currentPlaybackState = await responsePlaybackState.json()
  //

  //
  var currentPlayingPlaylist_name = ""

  if (currentPlaying.context) {
    const responseNowPlayingPlaylist = await getNowPlayingPlaylist(
      access_token,
      currentPlaying.context.href
    )

    if (
      responseNowPlayingPlaylist.status === 204 ||
      responseNowPlayingPlaylist.status > 400
    ) {
      return res.status(200).json({ isPlaying: false })
    }
    const currentPlayingPlaylist = await responseNowPlayingPlaylist.json()
    currentPlayingPlaylist_name = currentPlayingPlaylist.name
  } else {
    currentPlayingPlaylist_name = ""
  }
  //

  const isPlaying = currentPlaying.is_playing

  return res.status(200).json({
    currentPlaying,
    currentPlaybackState,
    currentPlayingPlaylist_name,
    isPlaying,
  })
}
