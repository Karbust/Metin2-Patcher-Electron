import storeType from './storeType'

const Reducer = (
    state: storeType,
    action: { type: string, payload: any }
): storeType => {
    if (action.type === 'SET_COMPLETED') {
        return {
            ...state,
            completed: action.payload
        }
    } if (action.type === 'SET_FILEPROGRESS') {
        return {
            ...state,
            fileProgress: action.payload
        }
    } if (action.type === 'SET_CURRENTFILE') {
        return {
            ...state,
            currentFile: action.payload
        }
    } if (action.type === 'SET_VERIFYINGFILE') {
        return {
            ...state,
            verifyingFile: action.payload
        }
    } if (action.type === 'SET_ACTION') {
        return {
            ...state,
            action: action.payload
        }
    }
    return state
}

export default Reducer
