import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HomePage } from './components/pages/home/home-page'
import './index.scss'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<HomePage />
	</StrictMode>,
)
