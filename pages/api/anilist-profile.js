export default async (_, res) => {
    var queryprofile = `
    query {
        User(name: "wetle174cm"){
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

    // if (response.status === 204 || response.status > 400) {
    //     return res.status(200).json({ isPlaying: false });
    // }

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
        // title,
        // coverImage,
        // status,
        // progress,
        // siteUrl,
        // createdAt,
    });
};