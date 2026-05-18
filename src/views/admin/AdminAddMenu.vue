<script setup>
import { useRouter } from 'vue-router'
import FoodForm from '../../components/FoodForm.vue'
import menuStore from '../../store/menu'

const router = useRouter()

const handleSubmit = async (payload) => {
	await menuStore.addMenuItem(payload)
	router.push('/admin/menu')
}

const handleCancel = () => {
	router.push('/admin/menu')
}
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
				<div>
					<div class="text-uppercase small text-secondary">Admin Control</div>
					<h2 class="fw-bold mb-0">Add Menu Item</h2>
				</div>
				<router-link class="btn btn-outline-dark" to="/admin/menu">Back to list</router-link>
			</div>

			<FoodForm submit-label="Create Menu Item" @submit="handleSubmit" @cancel="handleCancel" />
		</div>
	</section>
</template>
