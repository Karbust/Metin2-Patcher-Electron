// @ts-nocheck
import { createContext, FunctionComponent, useReducer } from 'react'

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

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    )
}

export const Context = createContext(initialState)
export default Store
