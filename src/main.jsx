import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppKitProvider } from './WagmiProvider.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'


createRoot(document.getElementById('root')).render(
   <StrictMode>
    <AppKitProvider>
      {/* <Provider store={store}> */}
    <App />

      {/* </Provider> */}
    </AppKitProvider>
 
  </StrictMode>,
)
