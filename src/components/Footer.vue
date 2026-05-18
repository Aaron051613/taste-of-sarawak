<script setup>
import { computed } from 'vue'
import userStore from '../store/user'

const isAdmin = computed(() => userStore.isAdmin.value)
</script>

<template>
	<div v-if="!isAdmin">
		<footer class="mt-auto bg-dark border-top border-light border-opacity-10 py-4">
			<div class="container">
				<div class="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
					<div>
						<div class="d-flex align-items-center gap-2">
							<span class="badge text-bg-warning text-dark rounded-pill px-3 py-2 fw-bold">Taste</span>
							<span class="text-light fw-semibold">of Sarawak</span>
						</div>
						<div class="small text-light-emphasis mt-2">Fast pickup • Local chefs</div>
					</div>
					<ul class="nav nav-pills nav-fill gap-2">
						<li class="nav-item">
							<router-link
								class="nav-link text-light border border-light border-opacity-10 rounded-pill px-3"
								active-class="active bg-warning text-dark border-0" to="/">Home</router-link>
						</li>
						<li class="nav-item">
							<router-link
								class="nav-link text-light border border-light border-opacity-10 rounded-pill px-3"
								active-class="active bg-warning text-dark border-0" to="/menu">🍽️ Menu</router-link>
						</li>
						<li class="nav-item">
							<router-link
								class="nav-link text-light border border-light border-opacity-10 rounded-pill px-3"
								active-class="active bg-warning text-dark border-0" to="/ratings">⭐
								Ratings</router-link>
						</li>
						<li class="nav-item">
							<router-link
								class="nav-link text-light border border-light border-opacity-10 rounded-pill px-3"
								active-class="active bg-warning text-dark border-0" to="/history">📜 Order
								History</router-link>
						</li>
						<li class="nav-item">
							<router-link
								class="nav-link text-light border border-light border-opacity-10 rounded-pill px-3"
								active-class="active bg-warning text-dark border-0" to="/login">🔐 Login</router-link>
						</li>
					</ul>
				</div>
			</div>
		</footer>
	</div>
</template>
