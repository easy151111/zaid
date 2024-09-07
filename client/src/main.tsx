import { Buffer } from 'buffer';

import ReactDOM from 'react-dom/client';

import { Root } from './Root';

// Uncomment this import in case, you would like to develop the application even outside
// the Telegram application, just in your browser.
import './mockEnv.ts';

import './globals.css';

// Make Buffer available globally
window.Buffer = Buffer;

ReactDOM.createRoot(document.getElementById('root')!).render(<Root/>);
