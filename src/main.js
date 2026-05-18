import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

// Handle QR scan query params without forcing a full page reload.
// Wait for router to be ready and then perform a programmatic navigation.
router.isReady().then(() => {
	try {
		const params = new URLSearchParams(window.location.search)
		const ot = (params.get('order_type') || params.get('sb_order_type') || '').toLowerCase()
		if (ot === 'dine-in') {
			localStorage.setItem('sb_order_type', 'dine-in')
			localStorage.removeItem('sb_table')
			router.replace('/select-table')
			return
		}

		// Support QR links like /menu?table=5 which should set dine-in + table number
		const tableParam = params.get('table') || params.get('table_number') || params.get('tableNumber')
		if (tableParam) {
			const num = Number(tableParam)
			if (!Number.isNaN(num) && num > 0) {
				localStorage.setItem('sb_order_type', 'dine-in')
				localStorage.setItem('sb_table', String(num))
				// navigate to menu so user can order immediately
				router.replace('/menu')
				return
			}
		}

		if (ot === 'take-away' || ot === 'takeaway') {
			localStorage.setItem('sb_order_type', 'take-away')
			localStorage.removeItem('sb_table')
			router.replace('/menu')
			return
		}
	} catch (e) {
		// ignore and continue mounting
	}

	app.mount('#app')
}).catch(() => {
	// fallback to mounting app if router fails to become ready
	app.mount('#app')
})
