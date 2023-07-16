export const getRecentMatches = async () => {
  return fetch("https://api.opendota.com/api/players/297095950/matches?limit=9", {
    method: "GET",
  })
}

export default async (_, res) => {
  const response = await getRecentMatches()

  if (response.status === 204 || response.status > 400) {
    return res.status(200).json({ isError: true })
  }

  const recentMatches = await response.json()
  const isError = false

  return res.status(200).json({
    recentMatches,
    isError,
  })
}
