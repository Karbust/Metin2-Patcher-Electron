import { FunctionComponent, useContext } from 'react'
import { getI18n, useTranslation } from 'react-i18next'

import '../css/flag-icon.css'
import { Context } from '../reducer/Store'
import { discordUrl, enableDiscordButton } from '../config'

const { ipcRenderer } = window.require('electron')

const Buttons: FunctionComponent = () => {
    // @ts-ignore
    const { state } = useContext(Context)
    const { t } = useTranslation()
    const launchConfig = () => ipcRenderer.send('launchConfig')
    const launchClient = () => ipcRenderer.send('launchClient')
    const launchDiscord = () => ipcRenderer.send('launchUrl', { url: discordUrl })
    const changeLanguage = (lang: string) => {
        getI18n().changeLanguage(lang)
        ipcRenderer.send('languageChange', {
            language: lang
        })
    }

    return (
        <div className='relative'>
            <div className='absolute right-0'>
                <span
                    aria-hidden='true'
                    className='flags flag-icon flag-icon-gb mr-3 text-white px-4 py-2 rounded mr-1 mb-1 ease-linear transition-all duration-150'
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => changeLanguage('en')}
                />
                <span
                    aria-hidden='true'
                    className='flags flag-icon flag-icon-pt mr-3 text-white px-4 py-2 rounded mr-1 mb-1 ease-linear transition-all duration-150'
                    style={{ width: '32px', height: '32px' }}
                    onClick={() => changeLanguage('pt')}
                />
                {
                    enableDiscordButton && (
                        <button
                            className='mr-3 bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                            type='button'
                            onClick={launchDiscord}
                        >
                            Discord
                        </button>
                    )
                }
                <button
                    className='disabled:opacity-50 mr-3 bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={launchConfig}
                    disabled={state.completed !== 100}
                >
                    {t('settings')}
                </button>
                <button
                    className='disabled:opacity-50 bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                    type='button'
                    onClick={launchClient}
                    disabled={state.completed !== 100}
                >
                    {t('play')}
                </button>
            </div>
        </div>
    )
}
export default Buttons
