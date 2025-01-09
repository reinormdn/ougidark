import Head from "next/head"
import styles from "../styles/Home.module.css"
import useSWR from "swr"
import fetch from "unfetch"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import Tilt from "react-parallax-tilt"
import * as dotaconstantsHeroes from "dotaconstants/build/heroes.json"
import { useEffect, useState } from "react"
import "tippy.js/dist/tippy.css"
import "bootstrap-icons/font/bootstrap-icons.css"

TimeAgo.addLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo("en-US")

const fetcher = (url) => fetch(url).then((r) => r.json())

function Home() {
  const { data: spotifyCurrentPlaying, errorspotifyCurrentPlaying } = useSWR(
    "/api/spotify-currentPlaying",
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 10000 }
  )

  const { data: anilistActivities, erroranilistActivities } = useSWR(
    "/api/anilist-activities",
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 10000 }
  )

  const { data: opendotaRecentMatches, erroropendotaRecentMatches } = useSWR(
    "/api/opendota-recentMatches",
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 10000 }
  )

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  // const Timer = (start) => {
  //   const [timer, setTime] = useState(start)
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setTime((currentTime) => {
  //         if (currentTime < 100) {
  //           return currentTime + 1
  //         } else {
  //           clearInterval(interval)
  //           return currentTime
  //         }
  //       })
  //     }, 1000)
  //     return () => clearInterval(interval)
  //   }, [])
  //   return <p>{timer}</p>
  // }

  if (
    erroranilistActivities ||
    errorspotifyCurrentPlaying ||
    erroropendotaRecentMatches
  )
    return <div>failed to load</div>
  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: "#ffffff",
        minHeight: "100vh",
      }}
    >
      <Head>
        <title>ougidark</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>

      {!anilistActivities ||
      !spotifyCurrentPlaying ||
      !opendotaRecentMatches ? (
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
          <div className="px-0">
            <header
              className={styles.header + " mb-3 mb-lg-0"}
              style={{
                backgroundImage: `linear-gradient(transparent, #ffffff 93%), url(${anilistActivities.user.data.User.bannerImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "50% 40%",
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
                  className="text-dark"
                  href={anilistActivities.user.data.User.siteUrl}
                  target="_blank"
                >
                  {anilistActivities.user.data.User.name}
                </a>
              </h1>
            </header>
          </div>

          <div className="container-xl">
            <div className="row gx-3 gy-3">
              <div className="col-lg-4">
                {!spotifyCurrentPlaying.isPlaying ? (
                  <h5 className="h5">Spotify</h5>
                ) : (
                  <h5 className="h5">Listening to Spotify</h5>
                )}
                {!spotifyCurrentPlaying.isPlaying ? (
                  <div className="list-group pb-3 mb-2 rounded-0 border-bottom border-2">
                    <div
                      className="position-relative"
                      style={{ overflow: "hidden", zIndex: "1" }}
                    >
                      <div className="list-group-item list-group-item-action position-relative">
                        <div className="row">
                          <div className="col-auto">
                            <img
                              src={`https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/2048px-Spotify_App_Logo.svg.png`}
                              alt={`Spotify`}
                              title={`Spotify`}
                              className={`spotify-image`}
                            />
                          </div>
                          <div className="col ps-1 pe-3">
                            <div className="row gx-2 py-2 pe-2">
                              <div className="col">
                                <h5
                                  className={`mb-1 fs-6`}
                                  style={{ verticalAlign: "middle" }}
                                >
                                  <b className="">Offline</b>
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
                      style={{ overflow: "hidden", zIndex: "1" }}
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
                        <div className="row gx-0">
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
                          <div className="col ps-1 pe-3 position-relative text-truncate">
                            <div className="row gx-2 py-2 pe-2">
                              <div className="col">
                                <div className="ps-2">
                                  <h5
                                    className={`mb-1 fs-6`}
                                    style={{ verticalAlign: "middle" }}
                                  >
                                    <b className="text-dark">
                                      {
                                        spotifyCurrentPlaying.currentPlaying
                                          .item.name
                                      }
                                    </b>
                                    <br />
                                    <div className="text-truncate">
                                      <span className="fs-7">
                                        {spotifyCurrentPlaying.currentPlaying.item.artists.map(
                                          (item, i) =>
                                            (i ? ", " : "") + item.name
                                        )}
                                      </span>
                                    </div>
                                    <div className="row gx-2 mt-1">
                                      <div className="col-9 me-auto my-auto text-truncate">
                                        {spotifyCurrentPlaying.currentPlayingPlaylist_name ==
                                        "" ? (
                                          ""
                                        ) : (
                                          <span className="fs-7">
                                            <i
                                              className="bi bi-vinyl-fill"
                                              style={{
                                                paddingRight: ".35rem",
                                              }}
                                            ></i>
                                            {
                                              spotifyCurrentPlaying.currentPlayingPlaylist_name
                                            }
                                          </span>
                                        )}
                                      </div>
                                      {spotifyCurrentPlaying
                                        .currentPlaybackState.shuffle_state ? (
                                        <div className="col-auto my-auto text-truncate">
                                          <span className="fs-7">
                                            <i className="bi bi-shuffle"></i>
                                          </span>
                                        </div>
                                      ) : (
                                        ""
                                      )}
                                      {(() => {
                                        switch (
                                          spotifyCurrentPlaying
                                            .currentPlaybackState.repeat_state
                                        ) {
                                          case "track":
                                            return (
                                              <div className="col-auto my-auto text-truncate">
                                                <span className="fs-7">
                                                  <i className="bi bi-repeat-1"></i>
                                                </span>
                                              </div>
                                            )
                                          case "context":
                                            return (
                                              <div className="col-auto my-auto text-truncate">
                                                <span className="fs-7">
                                                  <i className="bi bi-repeat"></i>
                                                </span>
                                              </div>
                                            )
                                          default:
                                            return ""
                                        }
                                      })()}
                                    </div>
                                  </h5>
                                </div>
                              </div>
                            </div>
                            <div
                              className="progress position-absolute start-0 bottom-0 w-100 rounded-0"
                              style={{ height: ".25rem" }}
                            >
                              <div
                                className="progress-bar progress-bar-custom"
                                style={{
                                  width:
                                    (spotifyCurrentPlaying.currentPlaying
                                      .progress_ms /
                                      spotifyCurrentPlaying.currentPlaying.item
                                        .duration_ms) *
                                      100 +
                                    "%",
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                )}

                {/* <h5 style={{ fontSize: "1rem" }}>
                  "Every journey has its final day. Don't rush." -Zhongli
                </h5> */}
              </div>
              <div className="col-lg-4">
                <h5 className="h5">Anime Activity</h5>
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
                          <div className="list-group mb-2">
                            <div
                              className="position-relative"
                              style={{ overflow: "hidden", zIndex: "1" }}
                            >
                              <img
                                src={
                                  useractivity.media.bannerImage ??
                                  useractivity.media.coverImage.extraLarge
                                }
                                className="position-absolute w-100 h-100 bg-anilist-activity"
                              />
                              <a
                                href={useractivity.siteUrl}
                                target="_blank"
                                className="list-group-item list-group-item-action2 flex-column align-items-start"
                              >
                                <div className="row">
                                  <div className="col-auto">
                                    <img
                                      src={useractivity.media.coverImage.medium}
                                      alt={useractivity.media.title.romaji}
                                      title={useractivity.media.title.romaji}
                                      className={`${styles.headerCoverImage}`}
                                      style={{
                                        borderBottom:
                                          "3px solid var(--custom-color-1)",
                                      }}
                                    />
                                  </div>
                                  <div className="col ps-1 pe-3">
                                    <div className="row gx-2 py-2 pe-2">
                                      <div className="col">
                                        <div className="truncate-3-lines">
                                          <h5
                                            className={`mb-0 fs-6`}
                                            style={{ verticalAlign: "middle" }}
                                          >
                                            <b
                                              className="text-link"
                                              style={{
                                                color: `${
                                                  useractivity.media.coverImage
                                                    .extraLarge || "#000"
                                                } !important`,
                                              }}
                                            >
                                              {useractivity.media.title.romaji}
                                            </b>
                                          </h5>
                                        </div>
                                        <p className={`mb-0 fs-6`} style={{ lineHeight: "1.1" }}>
                                          <small>{status}</small>
                                        </p>
                                      </div>
                                      <div className="col-lg-auto">
                                        <h5
                                          className="text-lg-end"
                                          style={{ fontSize: ".975rem" }}
                                        >
                                          <small className="text-small">
                                            {createdTime}
                                          </small>
                                        </h5>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
              <div className="col-lg-4">
                <h5 className="h5">Dota Recent Matches</h5>
                {!opendotaRecentMatches ? (
                  <div>-</div>
                ) : (
                  <div>
                    {opendotaRecentMatches.recentMatches
                      .slice(0, 9)
                      .map((recentMatches, i) => {
                        var playerTeam = ""

                        if (recentMatches.player_slot <= 127) {
                          playerTeam = "Radiant"
                        } else {
                          playerTeam = "Dire"
                        }

                        var match_timestamp = new Date(
                          (recentMatches.start_time + recentMatches.duration) *
                            1000
                        )

                        var matchStart = timeAgo.format(match_timestamp)
                        return (
                          <Tilt
                            tiltReverse={true}
                            tiltMaxAngleX={8}
                            tiltMaxAngleY={8}
                          >
                            <div className="list-group mb-2 rounded-0" key={i}>
                              <div
                                className="position-relative"
                                style={{ overflow: "hidden", zIndex: "1" }}
                              >
                                <img
                                  src={
                                    `https://cdn.cloudflare.steamstatic.com` +
                                    dotaconstantsHeroes[recentMatches.hero_id]
                                      .img
                                  }
                                  className="position-absolute w-100 h-100 bg-dota-recent"
                                />
                                <a
                                  href={
                                    `https://www.opendota.com/matches/` +
                                    recentMatches.match_id
                                  }
                                  target="_blank"
                                  className="list-group-item list-group-item-action3 position-relative"
                                  style={{ zIndex: "2" }}
                                >
                                  <div className="row">
                                    <div className="col-auto my-auto">
                                      <img
                                        src={
                                          `https://cdn.cloudflare.steamstatic.com` +
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
                                        <div className="col">
                                          <h5
                                            className={`mb-0 fs-6`}
                                            style={{ verticalAlign: "middle" }}
                                          >
                                            <div className="">
                                              <b className="text-dark">
                                                {
                                                  dotaconstantsHeroes[
                                                    recentMatches.hero_id
                                                  ].localized_name
                                                }
                                              </b>
                                            </div>
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
                                            className="text-end"
                                            style={{ fontSize: ".975rem" }}
                                          >
                                            <span>
                                              <small className="text-small">
                                                {matchStart}
                                              </small>
                                            </span>
                                            <br />
                                            <span
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
                                            </span>
                                          </h5>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </Tilt>
                        )
                      })}
                  </div>
                )}
              </div>
            </div>
            <footer className={styles.footer}>
              <div className="row gx-2">
                <div className="col-auto my-auto">
                  <a
                    href="https://web.facebook.com/reinormdn174/"
                    target="_blank"
                    className="text-dark text-hover"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                </div>
                <div className="col-auto my-auto">
                  <a
                    href="https://www.youtube.com/channel/UC5zUxlnFwpNWxUTWJ-HVdxg"
                    target="_blank"
                    className="text-dark text-hover"
                  >
                    <i className="bi bi-youtube"></i>
                  </a>
                </div>
                <div className="col-auto my-auto">
                  <a
                    href="https://www.instagram.com/reinormdn174/"
                    target="_blank"
                    className="text-dark text-hover"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                </div>
                <div className="col-auto my-auto">
                  <a
                    href="https://github.com/reinormdn"
                    target="_blank"
                    className="text-dark text-hover"
                  >
                    <i className="bi bi-github"></i>
                  </a>
                </div>
                <div className="col-auto my-auto ms-auto fs-6">
                  <h6 className="mb-0">
                    <small>@2020</small>
                  </h6>
                </div>
              </div>
            </footer>
          </div>
        </main>
      )}
    </div>
  )
}

export default Home
