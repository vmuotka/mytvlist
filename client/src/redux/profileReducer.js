const profileReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_PROFILE':
            return {
                ...action.data, tvlist: action.data.tvlist.sort((a, b) => {
                    if (a.tv_info.name < b.tv_info.name)
                        return -1
                    if (a.tv_info.name > b.tv_info.name)
                        return 1
                    return 0
                })
            }
        case 'UPDATE_SHOW':
            return { ...state, tvlist: state.tvlist.map(show => +show.tv_info.id === +action.data.tv_info.id ? action.data : show) }
        case 'UPDATE_FOLLOW':
            return { ...state, following: action.data }
        default:
            return state
    }
}

export const setProfile = (profile) => {
    return {
        type: 'SET_PROFILE',
        data: profile
    }
}

export const updateEpisode = (show) => {
    return {
        type: 'UPDATE_SHOW',
        data: show
    }
}

export const updateFollow = (following) => {
    return {
        type: 'UPDATE_FOLLOW',
        data: following
    }
}

export default profileReducer