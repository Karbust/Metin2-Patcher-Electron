import ReactDOM from 'react-dom'

import './css/index.css'
import App from './App'
import Store from './reducer/Store'

ReactDOM.render(
    <Store>
        <App />
    </Store>,
    document.getElementById('root')
)
