<script setup>
import { computed, ref } from 'vue'
import menuStore from '../../store/menu'

const search = ref('')
const categoryFilter = ref('All')

const items = computed(() => menuStore.state.items)
const categories = computed(() => ['All', ...new Set(items.value.map((item) => item.category))])
const categoryOrder = {
	Main: 0,
	Drinks: 1,
	Dessert: 2,
}

const filteredItems = computed(() => {
	const filtered = items.value.filter((item) => {
		const matchesSearch = item.name.toLowerCase().includes(search.value.toLowerCase())
		const matchesCategory = categoryFilter.value === 'All' || item.category === categoryFilter.value
		return matchesSearch && matchesCategory
	})

	return [...filtered].sort((a, b) => {
		const categoryDiff = (categoryOrder[a.category] ?? 999) - (categoryOrder[b.category] ?? 999)
		if (categoryDiff !== 0) return categoryDiff
		return a.id - b.id
	})
})

const groupedFilteredItems = computed(() => {
	const groups = {
		Main: [],
		Drinks: [],
		Dessert: [],
	}

	for (const item of filteredItems.value) {
		if (!groups[item.category]) {
			groups[item.category] = []
		}
		groups[item.category].push(item)
	}

	return Object.entries(groups)
		.filter(([, list]) => list.length > 0)
		.map(([category, list]) => ({ category, list }))
})

const deleteItem = (id) => {
	const target = items.value.find((entry) => entry.id === id)
	if (!target) return

	const ok = window.confirm(`Delete ${target.name}? This cannot be undone.`)
	if (ok) {
		menuStore.deleteMenuItem(id)
	}
}
</script>

<template>
	<section class="py-5">
		<div class="container">
			<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
				<div>
					<div class="text-uppercase small text-secondary">Admin Control</div>
					<h2 class="fw-bold mb-0">Manage Menu</h2>
				</div>
				<div class="d-flex gap-2">
					<router-link class="btn btn-outline-dark" to="/admin">Dashboard</router-link>
					<router-link class="btn btn-warning text-dark fw-bold rounded-pill px-4" to="/admin/menu/new">Add Menu Item</router-link>
				</div>
			</div>

			<div class="bg-white border shadow-sm rounded-4 p-4 mb-4">
				<div class="row g-3">
					<div class="col-md-7">
						<label class="form-label">Search</label>
						<input v-model="search" class="form-control" type="text" placeholder="Search menu" />
					</div>
					<div class="col-md-5">
						<label class="form-label">Category</label>
						<select v-model="categoryFilter" class="form-select">
							<option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
						</select>
					</div>
				</div>
			</div>

			<div v-if="filteredItems.length === 0" class="text-center text-muted py-4 bg-white border rounded-4">
				No menu items found.
			</div>
			<div v-for="group in groupedFilteredItems" :key="group.category" class="mb-4">
				<div class="text-uppercase small fw-semibold text-secondary mb-2">{{ group.category }}</div>
				<div class="row g-4">
					<div v-for="item in group.list" :key="item.id" class="col-12 col-lg-6">
						<div class="bg-white border shadow-sm rounded-4 p-4 h-100">
							<div class="d-flex justify-content-between align-items-center mb-2">
								<div>
									<div class="text-uppercase small text-secondary">{{ item.category }}</div>
									<h5 class="fw-bold mb-1">{{ item.name }}</h5>
								</div>
								<div class="d-flex gap-2">
									<router-link class="btn btn-sm btn-outline-dark" :to="`/admin/menu/${item.id}/edit`">
										Edit
									</router-link>
									<button class="btn btn-sm btn-outline-danger" type="button" @click="deleteItem(item.id)">
										Delete
									</button>
								</div>
							</div>
							<p class="text-muted small">{{ item.description }}</p>
							<div class="small text-muted">Sizes: {{ item.sizes.map((size) => size.label).join(', ') }}</div>
							<div class="small text-muted">Add-ons: {{ item.addons.length ? item.addons.map((addon) => addon.name).join(', ') : 'None' }}</div>
							<div class="mt-3 ratio ratio-1x1 bg-light rounded-3">
								<img :src="item.image" :alt="item.name" class="img-fluid p-3" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
