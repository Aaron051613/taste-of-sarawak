<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postJson } from '../services/api'
import userStore from '../store/user'

const route = useRoute()
const router = useRouter()

const form = reactive({
	username: '',
	password: '',
	error: '',
})

const handleLogin = async () => {
	try {
		const email = form.username.includes('@') ? form.username : 'admin@tasteofsarawak.local'
		const response = await postJson('auth.php', {
			action: 'login',
			email,
			password: form.password,
		})

		if (response?.user?.role !== 'admin') {
			form.error = 'Admin access required.'
			return
		}

		form.error = ''
		userStore.login({ name: response.user.name, email: response.user.email, role: response.user.role })
		const redirect = route.query.redirect || '/admin'
		router.push(redirect)
	} catch (error) {
		form.error = error.message || 'Invalid username or password.'
	}
}
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-md-6 col-lg-4">
					<div class="bg-white border shadow-sm rounded-4 p-4">
						<div class="text-uppercase small text-secondary">Admin Access</div>
						<h3 class="fw-bold mb-3">Admin Login</h3>
						<form @submit.prevent="handleLogin">
							<div class="mb-3">
								<label class="form-label">Username / Email</label>
								<input v-model="form.username" class="form-control" type="text" placeholder="Enter username" />
							</div>
							<div class="mb-3">
								<label class="form-label">Password</label>
								<input v-model="form.password" class="form-control" type="password" placeholder="Enter password" />
							</div>
							<p v-if="form.error" class="text-danger small mb-3">{{ form.error }}</p>
							<button class="btn btn-warning w-100 text-dark fw-bold rounded-pill" type="submit">Login</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
