require('dotenv').config()
const Tvlist = require('../../server/models/tvlist')
const Tvprogress = require('../../server/models/tvprogress')
const Episode = require('../../server/models/episode')
const User = require('../../server/models/user')
const MovieDbApi = require('../../server/helpers/MovieDbApi')
const mongoose = require('mongoose')

// required parameters
let dbUri = process.env.MONGODB_URI

console.log(process.env.MOVIEDB_API)


const args = process.argv.slice(2)
console.log(args)




for (const arg of args) {
    if (arg.startsWith('-dbUri:'))
        dbUri = arg.slice(7)
}

const Run = async () => {
    // connect to database
    mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

    try {
        // const Users = 
        const tvlists = await Tvlist.find()
        console.log(`Retrieving data from the Movie Database API...`)
        const tvlists_with_data = await MovieDbApi.getTvDetailsWithProgress(tvlists)

        let index = 0
        console.log(`Converting ${tvlists_with_data.length} documents.`)

        for (const tvlist of tvlists_with_data) {
            console.log(`Processing ${index + 1} / ${tvlists_with_data.length}`)
            if (tvlist.progress) {
                for (let [watch_time, progress] of tvlist.progress.entries()) {
                    let tvprogress = new Tvprogress({
                        user: tvlist.user,
                        tv_id: tvlist.tv_id,
                        tvlist_id: tvlist.id,
                        watch_time: watch_time + 1,
                        episodes: []
                    })

                    if (progress.season === tvlist.tv_info.seasons.length - 1 && progress.episode >= tvlist.tv_info.seasons[tvlist.tv_info.seasons.length - 1].episodes.length)
                        progress.episode = 0

                    for (let season = 0; season < (progress.season === tvlist.tv_info.seasons.length ? progress.season : progress.season + 1); season++) {
                        for (let episode = 0; episode < ((season === progress.season) ? (Math.min(progress.episode, tvlist.tv_info.seasons[season].episodes.length)) : tvlist.tv_info.seasons[season].episodes.length); episode++) {
                            const episode_data = tvlist.tv_info.seasons[season].episodes[episode]
                            // console.log(tvlist.tv_info.name, season, episode)
                            const episode_document = new Episode({
                                user: tvlist.user,
                                tvprogress_id: tvprogress.id,
                                episode_id: episode_data.id,
                                watched: true,
                            })
                            tvprogress.episodes.push(episode_document.id)
                            await episode_document.save()
                        }
                    }
                    await tvprogress.save()
                    await Tvlist.findByIdAndUpdate(tvlist.id, { "$push": { "watch_progress": tvprogress.id } })
                }
            }
            index++
        }
    } catch (err) {
        console.error(err)
    } finally {
        mongoose.connection.close()

    }
}

Run()

console.log(dbUri)