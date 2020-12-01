export default async (_, res) => {
    var queryactivities = `
    query activities {
        Page(page: 1, perPage: 5) {
            activities(userId: 454750, sort: ID_DESC) {
                __typename
                ... on ListActivity {
                    media {
                        title {
                        romaji
                        }
                        coverImage {
                        large
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
    
    const resactivities = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: queryactivities
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
        }
    }
    `

    const resprofile = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: queryprofile
      }),
    })

    // if (resactivities.status === 204 || resactivities.status > 400) {
    //     return res.status(200).json({ isPlaying: false });
    // }

    const activities = await resactivities.json()
    const user = await resprofile.json()
    // const title = activities.data.Page.activities.map((_activities) => _activities.media.title.romaji).join(', ');
    // const coverImage = activities.data.Page.activities.map((_activities) => _activities.media.coverImage.large).join(', ');
    // const status = activities.data.Page.activities.map((_activities) => _activities.status).join(', ');
    // const progress = activities.data.Page.activities.map((_activities) => _activities.progress).join(', ');
    // const siteUrl = activities.data.Page.activities.map((_activities) => _activities.siteUrl).join(', ');
    // const createdAt = activities.data.Page.activities.map((_activities) => _activities.createdAt).join(', ');
    
    // const artist = activities.item.artists.map((_artist) => _artist.name).join(', ');
    // const albumImageUrl = activities.item.album.images[0].url;

    return res.status(200).json({
        user,
        activities,
        // title,
        // coverImage,
        // status,
        // progress,
        // siteUrl,
        // createdAt,
    });
};