import ReactDOM from 'react-dom'
import { I18nextProvider } from 'react-i18next'

import './css/index.css'
import App from './App'
import Store from './reducer/Store'
import i18n from './i18n'

ReactDOM.render(
    <I18nextProvider i18n={i18n}>
        <Store>
            <App />
        </Store>
    </I18nextProvider>,
    document.getElementById('root')
)
