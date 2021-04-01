const Reducer = (state: any, action: { type: string, payload: any }) => {
    switch (action.type) {
        case 'SET_COMPLETED':
            return {
                ...state,
                completed: action.payload
            }
        case 'SET_TOTALSIZE':
            return {
                ...state,
                totalSize: action.payload
            }
        default:
            return state
    }
}

export default Reducer
