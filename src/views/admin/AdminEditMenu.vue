<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FoodForm from '../../components/FoodForm.vue'
import menuStore from '../../store/menu'

const route = useRoute()
const router = useRouter()
const itemId = Number(route.params.id)

const item = computed(() => menuStore.state.items.find((entry) => entry.id === itemId))

const handleSubmit = async (payload) => {
	await menuStore.updateMenuItem(itemId, payload)
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
					<h2 class="fw-bold mb-0">Edit Menu Item</h2>
				</div>
				<router-link class="btn btn-outline-dark" to="/admin/menu">Back to list</router-link>
			</div>

			<div v-if="!item" class="text-center text-muted bg-white border rounded-4 p-5">
				Menu item not found. <router-link to="/admin/menu">Return to list</router-link>.
			</div>
			<FoodForm v-else :item="item" submit-label="Save Changes" @submit="handleSubmit" @cancel="handleCancel" />
		</div>
	</section>
</template>
