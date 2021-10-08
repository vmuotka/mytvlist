const tvlistRouter = require('express').Router()
const Tvlist = require('../models/tvlist')
const Tvprogress = require('../models/tvprogress')
const Episode = require('../models/episode')
const jwt = require('jsonwebtoken')
const UserHelper = require('../helpers/UserHelper')

const handleActivity = require('../functions/activities').handleActivity

tvlistRouter.post('/addtolist', async (req, res) => {
    const tv_id = req.body.id
    const show_name = req.body.show_name

    let decodedToken
    if (req.token)
        decodedToken = jwt.verify(req.token, process.env.SECRET)

    if (!req.token || !decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    // check if the user has listed the show before
    const query = {
        user: decodedToken.id,
        tv_id
    }
    let findlist = []
    try {
        findlist = await Tvlist.find(query)
    } catch (err) {
        res.status(503).json({ error: 'Database connection failed' })
    }

    if (findlist.length === 0) {
        // if the user has not listed the show before, create a document to the database
        const tvlist = new Tvlist({
            user: decodedToken.id,
            tv_id,
            listed: true,
            watching: true
        })
        handleActivity({
            user: decodedToken.id,
            desc: `added ${show_name} to their list.`
        })
        try {
            await tvlist.save()
            const tvprogress = new Tvprogress({
                user: decodedToken.id,
                tv_id,
                tvlist_id: tvlist.id,
                watch_time: 1,
                episodes: []
            })
            await tvprogress.save()
            const watch_progress = [
                tvprogress.id
            ]
            await Tvlist.findByIdAndUpdate(tvlist.id, { watch_progress })

        } catch (err) {
            res.status(503).json({ error: 'Database connection failed' })
        }
    } else {
        // if the user has listed the show before, change the shows following status instead
        findlist = findlist[0]
        findlist.listed = !findlist.listed
        try {
            await findlist.save()
        } catch (err) {
            res.status(503).json({ error: 'Database connection failed' })
        }

    }

    res.status(200).json({ message: 'success' })
})

tvlistRouter.post('/save_episode', async (req, res) => {
    const decodedToken = UserHelper.decodeToken(req.token)
    const body = { ...req.body, user: decodedToken.id }

    const query = {
        tvprogress_id: body.tvprogress_id,
        episode_id: body.episode_id,
        user: decodedToken.id
    }

    const episode_in_database = await Episode.findOne(query)

    if (episode_in_database) {
        const episode = await Episode.findByIdAndUpdate(episode_in_database.id, body, { new: true })
        res.status(200).json(episode)
    } else {
        const episode = new Episode(body)
        await episode.save().catch(err => console.error(err))
        await Tvprogress.findByIdAndUpdate(body.tvprogress_id, { "$push": { "episodes": episode.id } }, { new: true })
        res.status(200).json(episode)
    }
})

tvlistRouter.post('/save_score', async (req, res) => {
    const decodedToken = UserHelper.decodeToken(req.token)
    const body = req.body

    try {
        await Tvlist.findOneAndUpdate({ _id: body.id, user: decodedToken.id }, { score: body.score })
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
        return
    }

    res.status(200).json({ message: 'Success' })
})

tvlistRouter.post('/rewatch', async (req, res) => {
    const decodedToken = UserHelper.decodeToken(req.token)
    const body = req.body

    try {
        const existing_progresses = await Tvprogress.find({ tvlist_id: body.tvlist_id, user: decodedToken.id })
        const tvprogress = new Tvprogress({
            user: decodedToken.id,
            tv_id: body.tv_id,
            tvlist_id: body.tvlist_id,
            watch_time: existing_progresses.length + 1,
            episodes: []
        })
        tvprogress.save()
        await Tvlist.findByIdAndUpdate(body.tvlist_id, { "$push": { "watch_progress": tvprogress.id } })
        res.status(200).json(tvprogress)
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
        return
    }
})

tvlistRouter.post('/save_watching', async (req, res) => {
    const decodedToken = UserHelper.decodeToken(req.token)
    const body = req.body

    try {
        const tvlist = await Tvlist.findOneAndUpdate({ user: decodedToken.id, tv_id: body.tv_id }, { watching: body.watching }, { new: true })
        res.status(200).json(tvlist)
        return
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
        return
    }
})

tvlistRouter.post('/save_pinned', async (req, res) => {
    const decodedToken = UserHelper.decodeToken(req.token)
    const body = req.body

    try {
        const tvlist = await Tvlist.findOneAndUpdate({ user: decodedToken.id, tv_id: body.tv_id }, { pinned: body.pinned }, { new: true })
        res.status(200).json(tvlist)
        return
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
        return
    }
})
module.exports = tvlistRouter