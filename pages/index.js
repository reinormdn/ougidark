import Head from "next/head"
import styles from "../styles/Home.module.css"
import useSWR from "swr"
import fetch from "unfetch"
import Link from "next/link"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import Tilt from "react-parallax-tilt"
import * as dotaconstantsHeroes from "dotaconstants/build/heroes.json"

TimeAgo.addLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo("en-US")

const fetcher = (url) => fetch(url).then((r) => r.json())

function pad(val) {
  return val < 10 ? val : val
}

function Home() {
  const { data: anilistActivities, erroranilistActivities } = useSWR(
    "/api/anilist-activities",
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 5000 }
  )

  const { data: spotifyCurrentPlaying, errorspotifyCurrentPlaying } = useSWR(
    "/api/spotify-currentPlaying",
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 5000 }
  )

  const { data: opendotaRecentMatches, erroropendotaRecentMatches } = useSWR(
    "/api/opendota-recentMatches",
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 10000 }
  )

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  if (
    erroranilistActivities ||
    errorspotifyCurrentPlaying ||
    erroropendotaRecentMatches
  )
    return <div>failed to load</div>
  return (
    <div className={styles.container}>
      <Head>
        <title>ougidark</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>

      {!anilistActivities || !spotifyCurrentPlaying || !opendotaRecentMatches ? (
        <div
          className={styles.main}
          style={{ justifyContent: "center", minHeight: "100vh" }}
        >
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <main>
          {/* <Breadcrumbs separator="-" aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
        </Breadcrumbs> */}

          <div className="container-xl">
            <header
              className={styles.header}
              style={{
                backgroundImage: `linear-gradient(transparent, white 93%), url(${anilistActivities.user.data.User.bannerImage})`,
              }}
            >
              <a
                href={anilistActivities.user.data.User.siteUrl}
                target="_blank"
              >
                <img
                  src={anilistActivities.user.data.User.avatar.large}
                  className={`${styles.headerHomeImage} ${styles.borderCircle}`}
                  alt={anilistActivities.user.data.User.name}
                />
              </a>

              <h1 className={styles.headingXl + " text-center"}>
                <a
                  href={anilistActivities.user.data.User.siteUrl}
                  target="_blank"
                >
                  {anilistActivities.user.data.User.name}
                </a>
              </h1>
            </header>

            <div className="row gx-3">
              <div className="col-lg-4 d-none d-lg-block">
                {!spotifyCurrentPlaying.isPlaying ? (
                  <h5 className="h5">Not Listening</h5>
                ) : (
                  <h5 className="h5">Listening to Spotify</h5>
                )}
                {/* <Tilt tiltReverse={true} tiltMaxAngleX={8} tiltMaxAngleY={8}> */}
                {!spotifyCurrentPlaying.isPlaying ? (
                  <div className="list-group pb-3 mb-2 rounded-0 border-bottom border-2">
                    <div
                      className="position-relative"
                      style={{ overflow: "hidden" }}
                    >
                      <div className="list-group-item list-group-item-action position-relative">
                        <div className="row">
                          <div className="col-auto">
                            <img
                              src={`https://community.spotify.com/t5/image/serverpage/image-id/25294i2836BD1C1A31BDF2?v=v2`}
                              alt={`Spotify`}
                              title={`Spotify`}
                              className={`spotify-image`}
                            />
                          </div>
                          <div className="col ps-1 pe-3">
                            <div className="row gx-2 py-2 pe-2">
                              <div className="col">
                                <h5
                                  className={`mb-1 ` + `${styles.h5}`}
                                  style={{ verticalAlign: "middle" }}
                                >
                                  <b className="">-</b>
                                  <br />
                                  <small>-</small>
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="list-group pb-3 mb-2 rounded-0 border-bottom border-2">
                    <div
                      className="position-relative"
                      style={{ overflow: "hidden" }}
                    >
                      <img
                        src={
                          spotifyCurrentPlaying.currentPlaying.item.album
                            .images[1].url
                        }
                        className="position-absolute w-100 h-100 bg-spotify-current"
                      />
                      <a
                        href={
                          spotifyCurrentPlaying.currentPlaying.item
                            .external_urls.spotify
                        }
                        target="_blank"
                        className="list-group-item list-group-item-action position-relative"
                        style={{ zIndex: "2" }}
                      >
                        <div className="row">
                          <div className="col-auto">
                            <img
                              src={
                                spotifyCurrentPlaying.currentPlaying.item.album
                                  .images[1].url
                              }
                              alt={
                                spotifyCurrentPlaying.currentPlaying.item.name
                              }
                              title={
                                spotifyCurrentPlaying.currentPlaying.item.name
                              }
                              className={`spotify-image`}
                            />
                          </div>
                          <div className="col ps-1 pe-3">
                            <div className="row gx-2 py-2 pe-2">
                              <div className="col">
                                <h5
                                  className={`mb-1 ` + `${styles.h5}`}
                                  style={{ verticalAlign: "middle" }}
                                >
                                  <b className="text-primary">
                                    {
                                      spotifyCurrentPlaying.currentPlaying.item
                                        .name
                                    }
                                  </b>
                                  <br />
                                  <small>
                                    {
                                      spotifyCurrentPlaying.currentPlaying.item
                                        .artists[0].name
                                    }
                                  </small>
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                )}
                {/* </Tilt> */}

                <h5 className="h5">Fav. Characters</h5>
                {/* <div className="list-group">
                <div className="list-group-item p-3"> */}
                {/* <div className="card">
                  <div className="card-body"> */}
                <div className="row gx-2">
                  {anilistActivities.user.data.User.favourites.characters.nodes.map(
                    (usercharafav, i) => {
                      return (
                        <div className="col-4 col-xl-2_5 mb-2" key={i}>
                          <Tilt
                            tiltEnable={false}
                            tiltReverse={true}
                            glareEnable={true}
                            glareMaxOpacity={0.9}
                            glareColor="#ffffff3a"
                            glarePosition="all"
                          >
                            <div>
                              <a href={usercharafav.siteUrl} target="_blank">
                                <img
                                  src={usercharafav.image.large}
                                  alt={usercharafav.name.full}
                                  title={usercharafav.name.full}
                                  className={`${styles.characterImage}`}
                                />
                              </a>
                            </div>
                          </Tilt>
                        </div>
                      )
                    }
                  )}
                </div>
                {/* </div>
                </div> */}
                {/* </div>
              </div> */}
              </div>
              <div className="col-lg-4">
                <h5 className="h5">Anilist Activity</h5>
                <div className="row gx-2">
                  {anilistActivities.activities.data.Page.activities.map(
                    (useractivity, i) => {
                      var current_timestamp = new Date()
                      var activity_timestamp = new Date(
                        useractivity.createdAt * 1000
                      )

                      var msPerMinute = 60 * 1000
                      var msPerHour = msPerMinute * 60
                      var msPerDay = msPerHour * 24
                      var msPerMonth = msPerDay * 30
                      var msPerYear = msPerDay * 365

                      var createdTime = timeAgo.format(activity_timestamp)

                      var status = useractivity.status
                      var progress = useractivity.progress

                      if (
                        status == "watched episode" ||
                        status == "rewatched episode" ||
                        status == "read chapter"
                      ) {
                        status += " " + progress
                      }

                      status = capitalizeFirst(status)

                      return (
                        <div className="col-xl-12" key={i}>
                          <Tilt
                            tiltReverse={true}
                            tiltMaxAngleX={8}
                            tiltMaxAngleY={8}
                          >
                            <div className="list-group mb-2">
                              <div
                                className="position-relative"
                                style={{ overflow: "hidden" }}
                              >
                                {/* <img
                                  src={
                                    useractivity.media.coverImage.medium
                                  }
                                  className="position-absolute w-100 h-100 bg-spotify-current"
                                /> */}
                                <a
                                  href={useractivity.siteUrl}
                                  target="_blank"
                                  className="list-group-item list-group-item-action2 flex-column align-items-start"
                                >
                                  <div className="row">
                                    <div className="col-auto">
                                      <img
                                        src={
                                          useractivity.media.coverImage.medium
                                        }
                                        alt={useractivity.media.title.romaji}
                                        title={useractivity.media.title.romaji}
                                        className={`${styles.headerCoverImage}`}
                                      />
                                    </div>
                                    <div className="col ps-1 pe-3">
                                      <div className="row gx-2 py-2 pe-2">
                                        <div className="col">
                                          <h5
                                            className={`mb-1 ` + `${styles.h5}`}
                                            style={{ verticalAlign: "middle" }}
                                          >
                                            <b className="text-primary">
                                              {useractivity.media.title.romaji}
                                            </b>
                                            <br />
                                            <small>{status}</small>
                                          </h5>
                                        </div>
                                        <div className="col-auto">
                                          <h5 style={{ fontSize: ".975rem" }}>
                                            <small>{createdTime}</small>
                                          </h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </Tilt>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
              <div className="col-lg-4 d-none d-lg-block">
                <h5 className="h5">Dota Recent Matches</h5>
                {!opendotaRecentMatches ? (
                  <div>-</div>
                ) : (
                  <div className="pb-2 border-bottom border-2">
                    {opendotaRecentMatches.recentMatches.map(
                      (recentMatches, i) => {
                        var playerTeam = ""

                        if (recentMatches.player_slot <= 127) {
                          playerTeam = "Radiant"
                        } else {
                          playerTeam = "Dire"
                        }
                        return (
                          <div className="list-group mb-2 rounded-0" key={i}>
                            <div
                              className="position-relative"
                              style={{ overflow: "hidden" }}
                            >
                              <img
                                src={
                                  `https://api.opendota.com` +
                                  dotaconstantsHeroes[recentMatches.hero_id].img
                                }
                                className="position-absolute w-100 h-100 bg-dota-recent"
                              />
                              <a
                                href={`#`}
                                target="_blank"
                                className="list-group-item list-group-item-action3 position-relative"
                                style={{ zIndex: "2" }}
                              >
                                <div className="row">
                                  <div className="col-auto">
                                    <img
                                      src={
                                        `https://api.opendota.com` +
                                        dotaconstantsHeroes[
                                          recentMatches.hero_id
                                        ].img
                                      }
                                      alt={
                                        dotaconstantsHeroes[
                                          recentMatches.hero_id
                                        ].localized_name
                                      }
                                      title={
                                        dotaconstantsHeroes[
                                          recentMatches.hero_id
                                        ].localized_name
                                      }
                                      className={`dota-recent-image`}
                                    />
                                  </div>
                                  <div className="col ps-1 pe-3">
                                    <div className="row gx-3 py-2 pe-2">
                                      <div className="col text-truncate">
                                        <h5
                                          className={`mb-1 ` + `${styles.h5}`}
                                          style={{ verticalAlign: "middle" }}
                                        >
                                          <b className="text-primary">
                                            {
                                              dotaconstantsHeroes[
                                                recentMatches.hero_id
                                              ].localized_name
                                            }
                                          </b>
                                          <br />
                                          <small>
                                            KDA:{" "}
                                            {recentMatches.kills +
                                              `/` +
                                              recentMatches.deaths +
                                              `/` +
                                              recentMatches.assists}
                                          </small>
                                        </h5>
                                      </div>
                                      <div className="col-auto">
                                        <h5
                                          className={
                                            (playerTeam == "Radiant" &&
                                              recentMatches.radiant_win ==
                                                true) ||
                                            (playerTeam == "Dire" &&
                                              recentMatches.radiant_win ==
                                                false)
                                              ? "text-success"
                                              : "text-danger"
                                          }
                                          style={{ fontSize: ".975rem" }}
                                        >
                                          <small>
                                            {(playerTeam == "Radiant" &&
                                              recentMatches.radiant_win ==
                                                true) ||
                                            (playerTeam == "Dire" &&
                                              recentMatches.radiant_win ==
                                                false)
                                              ? "Won Match"
                                              : "Lost Match"}
                                          </small>
                                        </h5>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                          </div>
                        )
                      }
                    )}
                  </div>
                )}
              </div>
            </div>
            <footer className={styles.footer}>
              Hosted on{" "}
              <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel
              </a>{" "}
              | <code>v0.2C</code>
            </footer>
          </div>
        </main>
      )}
    </div>
  )
}

export default Home
