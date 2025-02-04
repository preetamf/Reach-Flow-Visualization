import { memo } from 'react'
import './App.css'
import GraphContainer from './components/GraphContainer'
import NodeCustomizationPanel from './components/NodeCustomizationPanel'
import UndoRedoControls from './components/UndoRedoControls'
import ErrorBoundary from './components/ErrorBoundary'

const App = () => {
	return (
		<ErrorBoundary>
			<div className="app-container">
				<header className="app-header">
					<h1>Graph Flow</h1>
					<UndoRedoControls />
				</header>
				<main className="app-main">
					<NodeCustomizationPanel />
					<div className="graph-wrapper">
						<GraphContainer />
					</div>
				</main>
			</div>
		</ErrorBoundary>
	)
}

export default memo(App)
