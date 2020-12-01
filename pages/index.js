import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from 'swr'
import fetch from 'unfetch'
import Link from 'next/link'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)
 
// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

import CircularProgress from '@material-ui/core/CircularProgress';

import 'bootstrap/dist/css/bootstrap.min.css'

const fetcher = url => fetch(url).then(r => r.json())

function pad(val){
  return (val < 10) ? val : val;
  // return (val < 10) ? '0' + val : val;
}

function Home() {
  // const { data: anilistProfile, erroranilistProfile } = useSWR('/api/anilist-profile', fetcher)
  const { data: anilistActivities, erroranilistActivities } = useSWR('/api/anilist-activities', fetcher, { revalidateOnFocus: true, refreshInterval: 1000 })

  if (erroranilistActivities) return <div>failed to load</div>
  if (!anilistActivities) return <div className={styles.container}>
    <Head>
      <title>sakuta</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.main} style={{justifyContent: 'center'}}>
      <CircularProgress />
    </div>
  </div>
  return (
    <div className={styles.container}>
      <Head>
        <title>sakuta</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code&family=Lato&family=Roboto&family=Share+Tech+Mono&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>

      <main>
        {/* <Breadcrumbs separator="-" aria-label="breadcrumb">
          <Link color="inherit" href="/">
            Home
          </Link>
        </Breadcrumbs> */}

        <header className={styles.header}>
          <a href={anilistActivities.user.data.User.siteUrl} target="_blank">
            <img
              src={anilistActivities.user.data.User.avatar.large}
              className={`${styles.headerHomeImage} ${styles.borderCircle}`}
              alt={anilistActivities.user.data.User.name}
            />
          </a>
          <a href={anilistActivities.user.data.User.siteUrl} target="_blank"><h1 className={styles.headingXl}>{anilistActivities.user.data.User.name}</h1></a>
        </header>

        {anilistActivities.activities.data.Page.activities.map((useractivity, i) => {
          var current_timestamp = new Date()
          var activity_timestamp = new Date(useractivity.createdAt*1000)

          var msPerMinute = 60 * 1000;
          var msPerHour = msPerMinute * 60;
          var msPerDay = msPerHour * 24;
          var msPerMonth = msPerDay * 30;
          var msPerYear = msPerDay * 365;

          var createdTime = timeAgo.format(activity_timestamp)

          var status = useractivity.status
          var progress = useractivity.progress

          if (status == "plans to watch") {
            status = "Plans to watch"
          } else if (status == "watched episode") {
            status = "Watched episode " + progress
          } else if (status == "completed") {
            status = "Completed"
          } else if (status == "rewatched episode") {
            status = "Rewatched episode " + progress
          } else if (status == "paused") {
            status = "Paused"
          } else if (status == "dropped") {
            status = "Dropped"
          }

          return (
            <div className="list-group mb-2" key={i}>
              <a href={useractivity.siteUrl} target="_blank" className="list-group-item list-group-item-action flex-column align-items-start">
                <div className="row">
                  <div className="col-auto">
                  <img
                    src={useractivity.media.coverImage.large}
                    alt={useractivity.media.title.romaji}
                    className={`${styles.headerCoverImage}`}
                  />
                  </div>
                  <div className="col pl-1 pr-3">
                    <div className="row py-2 pr-2">
                      <div className="col">
                        <h5 className="mb-1" style={{verticalAlign: 'middle'}}>
                          {useractivity.media.title.romaji}
                          <br />
                          <small>{status}</small>
                        </h5>
                      </div>
                      <div className="col-auto">
                        <small>{createdTime}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export default Home
