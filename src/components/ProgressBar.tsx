import { FunctionComponent, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { Context } from '../reducer/Store'

const ProgressBar: FunctionComponent = () => {
    // @ts-ignore
    const { state } = useContext(Context)
    const { t } = useTranslation()

    return (
        <div className='pt-1'>
            <div className='flex mb-2 items-center justify-between'>
                <div>
                    <span
                        className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200'
                    >
                        {(() => {
                            if (state.completed === 100) {
                                return t('dlCompleted')
                            }
                            return t('dlProgress')
                        })()}
                    </span>
                </div>
                <div className='text-right'>
                    <span className='text-xs font-semibold inline-block text-gray-600'>
                        {state.completed}
                        %
                    </span>
                </div>
            </div>
            <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300'>
                <div
                    style={{ width: `${state.completed}%` }}
                    className='ease-in-out duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-600'
                />
            </div>
            <div className='flex mb-2 items-center justify-between'>
                <div>
                    <span
                        className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200'
                    >
                        {(() => {
                            if (state.fileProgress === 100) {
                                return t('dlCompleted')
                            }
                            return t('dlFile', { currentFile: state.currentFile })
                        })()}
                    </span>
                </div>
                <div className='text-right'>
                    <span className='text-xs font-semibold inline-block text-gray-600'>
                        {state.fileProgress}
                        %
                    </span>
                </div>
            </div>
            <div className='overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-300'>
                <div
                    style={{ width: `${state.fileProgress}%` }}
                    className='ease-in-out duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-600'
                />
            </div>
        </div>
    )
}
export default ProgressBar
