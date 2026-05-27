import { computed, reactive } from 'vue'
import { logAdminActivity } from '../services/adminAudit'

const STORAGE_KEY = 'sb_user'
const ADMIN_STORAGE_KEY = 'sb_admin_user'

const loadUser = () => {
	const adminRaw = sessionStorage.getItem(ADMIN_STORAGE_KEY)
	if (adminRaw) {
		try {
			const admin = JSON.parse(adminRaw)
			if (admin?.role === 'admin' && admin?.isAuthenticated) return admin
		} catch (error) {
			// ignore invalid session data
		}
	}

	const raw = localStorage.getItem(STORAGE_KEY)
	if (!raw) return null

	try {
		return JSON.parse(raw)
	} catch (error) {
		return null
	}
}

const state = reactive({
	isAuthenticated: false,
	role: 'member',
	name: '',
	email: '',
})

const saved = loadUser()
if (saved) {
	state.isAuthenticated = saved.isAuthenticated || false
	state.role = saved.role || 'member'
	state.name = saved.name || ''
	state.email = saved.email || ''
}

const persist = () => {
	if (state.role === 'admin' && state.isAuthenticated) {
		sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state))
		localStorage.removeItem(STORAGE_KEY)
		return
	}

	sessionStorage.removeItem(ADMIN_STORAGE_KEY)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

const login = ({ name, email, role }) => {
	state.isAuthenticated = true
	state.role = role || 'member'
	state.name = name || ''
	state.email = email || ''
	persist()

	if (state.role === 'admin') {
		void logAdminActivity({
			action: 'Admin Login',
			actorName: state.name,
			actorEmail: state.email,
			details: { type: 'login' },
		})
	}
}

const logout = () => {
	const wasAdmin = state.role === 'admin' && state.isAuthenticated
	const actorName = state.name
	const actorEmail = state.email

	state.isAuthenticated = false
	state.role = 'member'
	state.name = ''
	state.email = ''
	persist()
	sessionStorage.removeItem(ADMIN_STORAGE_KEY)

	if (wasAdmin) {
		void logAdminActivity({
			action: 'Admin Logout',
			actorName,
			actorEmail,
			details: { type: 'logout' },
		})
	}
}

const isAdmin = computed(() => state.isAuthenticated && state.role === 'admin')

export default {
	state,
	login,
	logout,
	isAdmin,
}
