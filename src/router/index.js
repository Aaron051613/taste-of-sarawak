import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MenuListView from '../views/MenuListView.vue'
import MenuDetailView from '../views/MenuDetailView.vue'
import RatingView from '../views/RatingView.vue'
import CartView from '../views/CartView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HistoryView from '../views/HistoryView.vue'
import SelectOrderType from '../views/SelectOrderType.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminOrderView from '../views/admin/AdminOrderView.vue'
import AdminMenuList from '../views/admin/AdminMenuList.vue'
import AdminAddMenu from '../views/admin/AdminAddMenu.vue'
import AdminEditMenu from '../views/admin/AdminEditMenu.vue'
import { logAdminRouteVisit } from '../services/adminAudit'
import userStore from '../store/user'
import SelectTable from '../views/SelectTable.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/select-order-type', name: 'select-order-type', component: SelectOrderType },
    { path: '/select-table', name: 'select-table', component: SelectTable },
    { path: '/menu', name: 'menu', component: MenuListView },
    { path: '/menu/:id', name: 'menu-detail', component: MenuDetailView, props: true },
    { path: '/ratings', name: 'ratings', component: RatingView },
    {
      path: '/admin/ratings',
      name: 'admin-ratings',
      component: RatingView,
      meta: { requiresAdmin: true },
    },
    { path: '/cart', name: 'cart', component: CartView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/history', name: 'history', component: HistoryView },
    { path: '/admin', name: 'admin', component: AdminOrderView, meta: { requiresAdmin: true } },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/orders',
      name: 'admin-orders',
      component: AdminOrderView,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/menu',
      name: 'admin-menu',
      component: AdminMenuList,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/menu/new',
      name: 'admin-menu-new',
      component: AdminAddMenu,
      meta: { requiresAdmin: true },
    },
    {
      path: '/admin/menu/:id/edit',
      name: 'admin-menu-edit',
      component: AdminEditMenu,
      meta: { requiresAdmin: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta?.requiresAdmin && !userStore.isAdmin.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // allow admin and auth routes without customer ordering flow
  const publicPaths = ['/login', '/register', '/select-order-type', '/select-table']
  if (to.path.startsWith('/admin') || publicPaths.includes(to.path)) return true

  const orderType = localStorage.getItem('sb_order_type')
  if (!orderType) {
    return { name: 'select-order-type', query: { redirect: to.fullPath } }
  }

  // require table selection only for dine-in customers
  if (orderType === 'dine-in') {
    const table = localStorage.getItem('sb_table')
    if (!table) {
      return { name: 'select-table', query: { redirect: to.fullPath } }
    }
  }

  return true
})

router.afterEach((to) => {
  if (!to.path.startsWith('/admin')) return
  if (!userStore.isAdmin.value) return

  logAdminRouteVisit(to.name, {
    name: userStore.state.name,
    email: userStore.state.email,
  })
})

export default router
