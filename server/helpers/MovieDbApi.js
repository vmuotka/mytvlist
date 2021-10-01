const API_KEY = process.env.MOVIEDB_API
const baseUrl = `https://api.themoviedb.org/3`

const axios = require('axios')
const axiosCache = require('axios-cache-adapter')

// mongoose models
const Tvlist = require('../models/tvlist')
const Movielist = require('../models/movielist')

const cache = axiosCache.setupCache({
    maxAge: 60 * 60 * 1000
})

const api = axios.create({
    adapter: cache.adapter
})

const Tv = async (id) => {

}

const getTvRecommendations = async (startIndex, endIndex, decodedToken) => {
    let tvlist = await Tvlist.find({ user: decodedToken.id })
    tvlist.sort((a, b) => {
        if (!a.score && !b.score)
            return 0
        if (!a.score)
            return 1
        if (!b.score)
            return -1
        calculateScoreValue(b)
        return calculateScoreValue(b) - calculateScoreValue(a)
    })
    tvlist = tvlist.slice(startIndex, endIndex)

    const tvshowIdArr = tvlist.map(show => show.tv_id)
    let recommendations = []
    const requests = tvshowIdArr.map(id => api(`${baseUrl}/tv/${id}/recommendations?api_key=${API_KEY}`))

    return axios.all(requests)
        .then(axios.spread(async (...responses) => {
            responses.forEach(response => {
                recommendations.push(response.data.results.slice(0, 4))
            })

            let recommendationDetails = []
            for (let i = 0; i < recommendations.length; i++) {
                // if (recommendations[i].length > 0) {
                let obj = {}
                const idArr = recommendations[i].map(show => show.id)
                // get the name of the show that the recommendations are for
                const tempArr = [tvlist[i].tv_id]
                const show = await getTvDetails(tempArr, decodedToken)
                obj.name = show[0].tv_info.name
                obj.recommendations = await getTvDetails(idArr, decodedToken)
                recommendationDetails.push(obj)
                // }
            }
            return recommendationDetails
        }))
}

const getMovieRecommendations = async (startIndex, endIndex, decodedToken) => {
    let movielist = await Movielist.find({ user: decodedToken.id })
    movielist.sort((a, b) => {
        if (!a.score && !b.score)
            return 0
        if (!a.score)
            return 1
        if (!b.score)
            return -1
        calculateScoreValue(b)
        return calculateScoreValue(b) - calculateScoreValue(a)
    })
    movielist = movielist.slice(startIndex, endIndex)

    const movieIdArr = movielist.map(movie => movie.movie_id)
    let recommendations = []
    const requests = movieIdArr.map(id => api(`${baseUrl}/movie/${id}/recommendations?api_key=${process.env.MOVIEDB_API}`))

    return axios.all(requests)
        .then(axios.spread(async (...responses) => {
            responses.forEach(response => {
                recommendations.push(response.data.results.slice(0, 4))
            })

            let recommendationDetails = []
            for (let i = 0; i < recommendations.length; i++) {
                // if (recommendations[i].length > 0) {
                let obj = {}
                const idArr = recommendations[i].map(show => show.id)
                // get the name of the show that the recommendations are for
                const tempArr = [movielist[i].movie_id]
                const movie = await getMovieDetails(tempArr, decodedToken)
                obj.name = movie[0].info.title
                obj.recommendations = await getMovieDetails(idArr, decodedToken)
                recommendationDetails.push(obj)
                // }
            }
            return recommendationDetails
        }))
        .catch(err => {
            console.error(err)
        })
}

const calculateScoreValue = (show) => {
    let last_watched_modifier = 1
    const modified_days_ago = Math.floor((new Date() - new Date(show.updatedAt)) / (24 * 60 * 60 * 1000))
    if (modified_days_ago <= 7)
        last_watched_modifier = 1
    else if (modified_days_ago <= 14)
        last_wathed_modifier = 0.95
    else if (modified_days_ago <= 21)
        last_watched_modifier = 0.9
    else if (modified_days_ago <= 28)
        last_watched_modifier = 0.85
    else
        last_watched_modifier = 0.8

    return last_watched_modifier * show.score
}

const getTvDetails = async (showlist, decodedToken) => {
    let tvlistArr
    if (decodedToken !== undefined) {
        tvlistArr = await Tvlist.find({ user: decodedToken.id })
    }

    const requests = showlist.map(listItem => api(`${baseUrl}/tv/${listItem}?api_key=${process.env.MOVIEDB_API}`))
    return axios.all(requests)
        .then(axios.spread((...responses) => {
            let results = []
            showlist.forEach((listItem, index) => {
                let show = {}
                show.tv_info = responses[index].data

                if (show.tv_info.number_of_seasons > 0) {
                    if (tvlistArr) {
                        if (tvlistArr.filter(item => item.tv_id === show.tv_info.id).length > 0) {
                            show.listed = tvlistArr.filter(item => item.tv_id === show.tv_info.id)[0].listed
                        }
                    } else {
                        show.listed = false
                    }
                    show.tv_id = show.tv_info.id
                    results.push(show)
                }
            })
            return results
        }))
}

const getTvDetailsWithProgress = async (tvlist, decodedToken) => {
    const requests = tvlist.map(item => api(`${baseUrl}/tv/${item.tv_id}?append_to_response=season&api_key=${API_KEY}`))

    let tvlistArr
    if (decodedToken !== undefined)
        tvlistArr = await Tvlist.find({ user: decodedToken.id, listed: true })

    await axios.all(requests)
        .then(axios.spread((...responses) => {
            tvlist.forEach((listItem, index) => {
                let show = responses[index].data
                show.seasons = show.seasons.filter(season => season.name !== 'Specials' && season.episode_count > 0)

                if (tvlistArr) {
                    if (tvlistArr.filter(item => item.tv_id === show.id).length > 0) {
                        listItem.listed = true
                    } else {
                        listItem.listed = false
                    }
                }

                listItem.tv_info = show
            })
        }))

    for await (const listItem of tvlist) {
        const season_requests = listItem.tv_info.seasons.map(season => api(`${baseUrl}/tv/${listItem.tv_id}/season/${season.season_number}?api_key=${API_KEY}`))

        await axios.all(season_requests)
            .then(axios.spread(async (...responses) => {
                const seasons = responses.map(response => response.data)
                listItem.tv_info.seasons = seasons
            }))
            .catch(err => {
                console.error(err)
            })
    }

    return tvlist
}

const getMovieDetailsWithProgress = async (movielist, decodedToken) => {
    let movielistArr
    if (decodedToken !== undefined)
        movielistArr = await Movielist.find({ user: decodedToken.id, listed: true })


    const movie_requests = movielist.map(item => api(`${baseUrl}/movie/${item.movie_id}?api_key=${process.env.MOVIEDB_API}`))

    await axios.all(movie_requests)
        .then(axios.spread((...responses) => {
            movielist.forEach((listItem, index) => {
                let movie = responses[index].data
                if (movielistArr) {
                    if (movielistArr.filter(item => item.movie_id === movie.id).length > 0) {
                        listItem.listed = true
                    } else {
                        listItem.listed = false
                    }
                }
                listItem.info = movie
            })
        }))

    return movielist
}

const getMovieDetails = async (movielist, decodedToken) => {
    let movielistArr
    if (decodedToken !== undefined) {
        movielistArr = await Movielist.find({ user: decodedToken.id })
    }

    const requests = movielist.map(listItem => api(`${baseUrl}/movie/${listItem}?api_key=${process.env.MOVIEDB_API}`))
    return axios.all(requests)
        .then(axios.spread((...responses) => {
            let results = []
            movielist.forEach((listItem, index) => {
                let movie = {}
                movie.info = responses[index].data
                if (decodedToken.id) {
                    if (movielistArr) {
                        if (movielistArr.find(item => item.tv_id === movie.info.id)) {
                            movie.listed = movielistArr.find(item => item.tv_id === movie.info.id).listed
                        }
                    } else {
                        movie.listed = false
                    }
                    movie.movie_id = movie.info.id
                    results.push(movie)
                }
            })
            return results
        }))
}

const discoverTv = async (decodedToken) => {
    const date = createDateString()

    let tv = await api(`${baseUrl}/discover/tv?api_key=${process.env.MOVIEDB_API}&sort_by=popularity.desc&air_date.gte=${date}&with_watch_monetization_types=flatrate`)
    const discoverIdArr = tv.data.results.map(show => show.id)
    tv = await getTvDetails(discoverIdArr, decodedToken)
    return tv
}

const discoverMovies = async (decodedToken) => {
    const date = createDateString()

    let movie = await api(`${baseUrl}/discover/movie?api_key=${process.env.MOVIEDB_API}&sort_by=popularity.desc&with_watch_monetization_types=flatrate&primary_release_date.gte${new Date().getYear()}`)
    const movieDiscoverIdArr = movie.data.results.map(movie => movie.id)
    movie = await getMovieDetails(movieDiscoverIdArr, decodedToken)
    return movie
}

const createDateString = () => {
    let date = new Date()
    date.setMonth(date.getMonth() - 6)
    date = date.toLocaleDateString('en-US').split('/')

    // API requires date string to have months and days with 2 numbers
    if (+date[0] < 10)
        date[0] = '0' + date[0]

    if (+date[1] < 10)
        date[1] = '0' + date[1]
    date = date[2] + '-' + date[0] + '-' + date[1]

    return date
}

module.exports = {
    getTvRecommendations,
    getMovieRecommendations,
    getTvDetails,
    getMovieDetails,
    getTvDetailsWithProgress,
    getMovieDetailsWithProgress,
    discoverTv,
    discoverMovies
}