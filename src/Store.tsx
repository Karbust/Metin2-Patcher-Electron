// @ts-nocheck
import { createContext, FunctionComponent, useReducer } from 'react'

import Reducer from './Reducer'

const initialState = {
    totalSize: 0,
    completed: 0
}

const Store: FunctionComponent = ({ children }) => {
    const [state, dispatch] = useReducer(Reducer, initialState)

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

export const Context = createContext(initialState)
export default Store
