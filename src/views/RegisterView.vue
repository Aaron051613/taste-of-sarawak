<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { postJson } from '../services/api'
import userStore from '../store/user'

const router = useRouter()

const form = reactive({
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
	error: '',
})

const handleRegister = async () => {
	if (form.password !== form.confirmPassword) {
		form.error = 'Passwords do not match.'
		return
	}

	try {
		const response = await postJson('auth.php', {
			action: 'register',
			name: form.name,
			email: form.email,
			password: form.password,
		})
		userStore.login({ name: response.user.name, email: response.user.email, role: response.user.role })
		form.error = ''
		router.push('/menu')
	} catch (error) {
		form.error = error.message || 'Registration failed.'
	}
}
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-md-7 col-lg-5">
					<div class="bg-white border shadow-sm rounded-4 p-4">
						<div class="text-uppercase small text-secondary">New Member</div>
						<h3 class="fw-bold mb-3">Register</h3>
						<form @submit.prevent="handleRegister">
							<div class="mb-3">
								<label class="form-label">Full name</label>
								<input v-model="form.name" class="form-control" type="text" placeholder="Your name" />
							</div>
							<div class="mb-3">
								<label class="form-label">Email</label>
								<input v-model="form.email" class="form-control" type="email" placeholder="you@example.com" />
							</div>
							<div class="mb-3">
								<label class="form-label">Password</label>
								<input v-model="form.password" class="form-control" type="password" placeholder="Create password" />
							</div>
							<div class="mb-3">
								<label class="form-label">Confirm password</label>
								<input v-model="form.confirmPassword" class="form-control" type="password" placeholder="Repeat password" />
							</div>
							<p v-if="form.error" class="text-danger small mb-3">{{ form.error }}</p>
							<button class="btn btn-warning w-100 text-dark fw-bold rounded-pill" type="submit">Create account</button>
						</form>
						<div class="small text-muted mt-3">
							Already have an account? <router-link to="/login">Login</router-link>.
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
