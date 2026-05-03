import React, { useEffect, useState } from 'react'

// Use Smartsupp official loader. The widget token is the identifier portion
// from the provided widget URL. If you have a different Smartsupp key, set
// `SMARTSUPP_KEY` below or pass it in via environment/config.
const SMARTSUPP_KEY = '10876c3f5a49136bdcbaa00ea358ae20809c164b'
const SMARTSUPP_LOADER = 'https://www.smartsuppchat.com/loader.js'

export default function SuppaChat(): JSX.Element {
	const [ready, setReady] = useState(false)

	useEffect(() => {
		// Use a local alias for window to avoid parser issues with complex expressions
		const w = window as any

		// Inject Smartsupp loader only once
		if (w.smartsuppLoaded) {
			setReady(true)
			return
		}

		// Expose a small helper to open the widget; implementation below
		w.openSuppaChat = async () => {
			// prefer official API if available
			try {
				const api = w.smartsupp
				if (typeof api === 'function') {
					// smartsupp API may accept methods; try 'open' or 'toggle'
					try { api('open'); return } catch {}
					try { api('toggle'); return } catch {}
				}

				// fallback: try to find injected widget button and click it
				const selCandidates = [
					'[class*=\"smartsupp\"]',
					'[id*=\"smartsupp\"]',
					'[data-smartsupp]'
				]
				for (const sel of selCandidates) {
					const el = document.querySelector(sel)
					if (el) { (el as HTMLElement).click(); return }
				}

				// final fallback: open the widget page in a new tab
				window.open('https://widget-page.smartsupp.com/widget/' + SMARTSUPP_KEY, '_blank')
			} catch (e) {
				window.open('https://widget-page.smartsupp.com/widget/' + SMARTSUPP_KEY, '_blank')
			}
		}

		// create loader script
		try {
			w._smartsupp = w._smartsupp || {}
			w._smartsupp.key = SMARTSUPP_KEY
			const script = document.createElement('script')
			script.type = 'text/javascript'
			script.async = true
			script.src = SMARTSUPP_LOADER
			script.onload = () => {
				w.smartsuppLoaded = true
				setReady(true)
			}
			script.onerror = () => setReady(true)
			document.head.appendChild(script)
		} catch (e) {
			setReady(true)
		}

		return () => {
			try { delete w.openSuppaChat } catch {}
		}
	}, [])

	// Render nothing UI-heavy — Smartsupp will inject its own floating widget.
	// We still keep a small helper button for users who prefer a native control.
	return (
		<>
			<button
				aria-label="Open support chat"
				onClick={() => (window as any).openSuppaChat && (window as any).openSuppaChat()}
				style={{
					position: 'fixed',
					right: 18,
					bottom: 18,
					width: 52,
					height: 52,
					borderRadius: '50%',
					background: 'linear-gradient(135deg,#f0b90b 0%,#d19e09 100%)',
					border: 'none',
					boxShadow: '0 8px 24px rgba(240,185,11,0.35)',
					zIndex: 9999,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					cursor: 'pointer'
				}}
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="#0f172a"/>
				</svg>
			</button>
		</>
	)

}


