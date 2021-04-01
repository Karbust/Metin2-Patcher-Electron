const Reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'SET_COMPLETED':
            return {
                ...state,
                completed: action.payload
            }
        default:
            return state
    }
}

export default Reducer
