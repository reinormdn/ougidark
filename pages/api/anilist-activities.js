export default async (_, res) => {
  var queryactivities = `
    query activities {
        Page(page: 1, perPage: 6) {
            activities(userId: 454750, sort: ID_DESC) {
                __typename
                ... on ListActivity {
                    media {
                        title {
                            romaji
                        }
                        coverImage {
                            extraLarge
                            large
                            medium
                            color
                        }
                    }
                    status
                    progress
                    siteUrl
                    createdAt
                }
            }
        }
    }
    `

  const resactivities = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: queryactivities,
    }),
  })

  var queryprofile = `
    query {
        User(id: 454750){
            id
            name
            about
            siteUrl
            avatar {
                large
            }
            bannerImage
            favourites(page: 1) {
                characters(perPage: 10, page: 1) {
                    nodes {
                        name {
                            full
                            native
                        }
                        image {
                            large
                            medium
                        }
                        siteUrl
                    }
                }
                anime(perPage: 5, page: 1) {
                  nodes {
                      title {
                          romaji
                          native
                      }
                      coverImage {
                          large
                          medium
                      }
                      seasonYear
                      format
                      siteUrl
                  }
                }
            }
        }
    }
    `

  const resprofile = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: queryprofile,
    }),
  })

  const activities = await resactivities.json()
  const user = await resprofile.json()

  return res.status(200).json({
    user,
    activities,
  })
}
