import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from 'swr'
import fetch from 'unfetch'
import Link from 'next/link'

import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import CircularProgress from '@material-ui/core/CircularProgress';

import 'bootstrap/dist/css/bootstrap.min.css'

const fetcher = url => fetch(url).then(r => r.json())

function pad(val){
  return (val < 10) ? val : val;
  // return (val < 10) ? '0' + val : val;
}

function Home() {
  // const { data: anilistProfile, erroranilistProfile } = useSWR('/api/anilist-profile', fetcher)
  const { data: anilistActivities, erroranilistActivities } = useSWR('/api/anilist-activities', fetcher)

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

          var current_year = current_timestamp.getFullYear()
          var current_month = current_timestamp.getMonth()+1
          var current_date = current_timestamp.getDate()
          var current_hour = current_timestamp.getHours()
          var current_minute = current_timestamp.getMinutes()

          var activity_year = activity_timestamp.getFullYear()
          var activity_month = activity_timestamp.getMonth()+1
          var activity_date = activity_timestamp.getDate()
          var activity_hour = activity_timestamp.getHours()
          var activity_minute = activity_timestamp.getMinutes()

          if ((current_year-activity_year) >= 1) {
            var createdTime = pad(current_year-activity_year) + " " + (((current_year-activity_year) >= 2) ? "years" : "year")
          } else if ((current_month-activity_month) >= 1) {
            var createdTime = pad(current_month-activity_month) + " " + (((current_month-activity_month) >= 2) ? "months" : "month")
          } else if ((current_date-activity_date) >= 1) {
            var createdTime = pad(current_date-activity_date) + " " + (((current_date-activity_date) >= 2) ? "days" : "day")
          } else if ((current_hour-activity_hour) >= 1) {
            var createdTime = pad(current_hour-activity_hour) + " " + (((current_hour-activity_hour) >= 2) ? "hours" : "hour")
          } else if ((current_minute-activity_minute) >= 1) {
            var createdTime = pad(current_minute-activity_minute) + " " + (((current_minute-activity_minute)) >= 2 ? "minutes" : "minute")
          }

          createdTime += " ago"

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
