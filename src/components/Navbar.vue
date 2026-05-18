<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import cartStore from '../store/cart'
import userStore from '../store/user'

const router = useRouter()
const itemCount = computed(() =>
	cartStore.state.items.reduce((total, item) => total + item.quantity, 0)
)

const isAdmin = computed(() => userStore.isAdmin.value)

const handleLogout = () => {
	userStore.logout()
	router.push('/')
}
</script>

<template>
	<nav
		class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-light border-opacity-10 py-3 shadow-sm">
		<div class="container">
			<router-link class="navbar-brand d-flex align-items-center gap-2 fw-bold text-white" to="/">
				<span class="badge text-bg-warning text-dark rounded-pill px-3 py-2">Taste</span>
				<span>of Sarawak</span>
			</router-link>
			<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"
				aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div id="mainNav" class="collapse navbar-collapse">
				<ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
					<template v-if="isAdmin">
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/admin/dashboard">Admin
								Dashboard</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/admin">Manage Orders</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/admin/menu">Manage Menu</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/admin/menu/new">Add Menu
								Item</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/admin/ratings">Manage
								Ratings</router-link>
						</li>
					</template>
					<template v-else>
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/">Home</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/menu">🍽️ Menu</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/ratings">⭐ Ratings</router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link px-lg-3 rounded-pill"
								active-class="active fw-semibold text-white" to="/history">📜 Order
								History</router-link>
						</li>
					</template>
					<li v-if="!isAdmin" class="nav-item">
						<router-link class="btn btn-warning btn-sm text-dark fw-bold rounded-pill px-3" to="/cart"
							data-cart-target="true">
							🛒 Order Cart <span class="badge text-bg-dark ms-2">{{ itemCount }}</span>
						</router-link>
					</li>
					<li v-if="!userStore.state.isAuthenticated" class="nav-item">
						<router-link class="btn btn-outline-light btn-sm rounded-pill px-3" to="/login">
							🔐 Login
						</router-link>
					</li>
					<li v-if="userStore.state.isAuthenticated" class="nav-item">
						<button class="btn btn-outline-light btn-sm rounded-pill px-3" type="button"
							@click="handleLogout">
							🚪 Logout
						</button>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>
