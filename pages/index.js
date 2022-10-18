import Head from "next/head"
import styles from "../styles/Home.module.css"
import useSWR from "swr"
import fetch from "unfetch"
import Link from "next/link"
import TimeAgo from "javascript-time-ago"
import en from "javascript-time-ago/locale/en"
import Tilt from "react-parallax-tilt"

TimeAgo.addLocale(en)

// Create formatter (English).
const timeAgo = new TimeAgo("en-US")

const fetcher = (url) => fetch(url).then((r) => r.json())

function pad(val) {
  return val < 10 ? val : val
  // return (val < 10) ? '0' + val : val;
}

function Home() {
  // const { data: anilistProfile, erroranilistProfile } = useSWR('/api/anilist-profile', fetcher)
  const { data: anilistActivities, erroranilistActivities } = useSWR(
    "/api/anilist-activities",
    fetcher,
    { revalidateOnFocus: true, refreshInterval: 1000 }
  )

  const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  if (erroranilistActivities) return <div>failed to load</div>
  return (
    <div className={styles.container}>
      <Head>
        <title>ougidark</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
      </Head>

      {!anilistActivities ? (
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
                <h5 className="h5">Characters</h5>
                {/* <div className="list-group">
                <div className="list-group-item p-3"> */}
                {/* <div className="card">
                  <div className="card-body"> */}
                    <div className="row gx-2">
                      {anilistActivities.user.data.User.favourites.characters.nodes.map(
                        (usercharafav, i) => {
                          return (
                            <div className="col-4 col-xl-2_5 mb-2" key={i}>
                              <a href={usercharafav.siteUrl} target="_blank">
                                <img
                                  src={usercharafav.image.large}
                                  alt={usercharafav.name.full}
                                  title={usercharafav.name.full}
                                  className={`${styles.characterImage}`}
                                />
                              </a>
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
              <div className="col-lg-8">
                <h5 className="h5">Activity</h5>
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
                        <div className="col-xl-6" key={i}>
                          <Tilt tiltReverse={true}>
                            <div className="list-group mb-2">
                              <a
                                href={useractivity.siteUrl}
                                target="_blank"
                                className="list-group-item list-group-item-action flex-column align-items-start"
                              >
                                <div className="row">
                                  <div className="col-auto">
                                    <img
                                      src={useractivity.media.coverImage.large}
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
                          </Tilt>
                        </div>
                      )
                    }
                  )}
                </div>
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
              | <code>v0.2A</code>
            </footer>
          </div>
        </main>
      )}
    </div>
  )
}

export default Home
