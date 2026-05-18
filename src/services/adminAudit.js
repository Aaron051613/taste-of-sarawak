import { postJson } from './api'

const ROUTE_LABELS = {
	admin: 'Manage Orders',
	'admin-orders': 'Manage Orders',
	'admin-dashboard': 'Admin Dashboard',
	'admin-menu': 'Manage Menu',
	'admin-menu-new': 'Add Menu Item',
	'admin-menu-edit': 'Manage Menu',
	'admin-ratings': 'Manage Ratings',
}

const logAdminActivity = async ({ action, actorName = '', actorEmail = '', details = {} }) => {
	if (!action) return

	try {
		await postJson('adminActivity.php', {
			action,
			actorName,
			actorEmail,
			details,
		})
	} catch (error) {
		// ignore audit failures to avoid blocking primary workflows
	}
}

const logAdminRouteVisit = (routeName, actor = {}) => {
	const action = ROUTE_LABELS[String(routeName || '')]
	if (!action) return

	void logAdminActivity({
		action,
		actorName: actor.name || '',
		actorEmail: actor.email || '',
		details: { source: 'route-visit' },
	})
}

export { logAdminActivity, logAdminRouteVisit }