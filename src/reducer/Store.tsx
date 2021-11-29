import { createContext, FunctionComponent, useMemo, useReducer } from 'react'

import Reducer from './Reducer'
import storeType from './storeType'

const initialState: storeType = {
    completed: 0,
    fileProgress: 0,
    currentFile: '',
    verifyingFile: '',
    action: ''
}

const Store: FunctionComponent = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState)
    const provider = useMemo(() => ({ state, dispatch }), [state])

    return (
        <>
            { /* @ts-ignore */ }
            <Context.Provider value={provider}>
                {children}
            </Context.Provider>
        </>
    )
}

export const Context = createContext(initialState)
export default Store
