<script setup>
import { computed, ref } from 'vue'
import FilterSidebar from '../components/FilterSidebar.vue'
import FoodCard from '../components/FoodCard.vue'
import cartStore from '../store/cart'
import menuStore from '../store/menu'

const activeFilters = ref({
	search: '',
	category: 'All',
})

const onFilterChange = (filters) => {
	activeFilters.value = filters
}

const items = computed(() => menuStore.state.items)
const itemCount = computed(() =>
	cartStore.state.items.reduce((total, item) => total + item.quantity, 0)
)
const categories = computed(() => [...new Set(items.value.map((item) => item.category))])
const categoryOrder = {
	Main: 0,
	Drinks: 1,
	Dessert: 2,
}

const filteredItems = computed(() => {
	const { search, category } = activeFilters.value
	const filtered = items.value.filter((item) => {
		const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
		const matchesCategory = category === 'All' || item.category === category
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
</script>

<template>
	<section class="py-5">
		<div class="container-fluid px-4">
			<div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
				<div>
					<div class="text-uppercase small text-secondary">Menu</div>
					<h2 class="fw-bold mb-0">Taste of Sarawak</h2>
				</div>
				<div class="small text-muted">Showing {{ filteredItems.length }} of {{ items.length }} items</div>
			</div>
			<div class="row g-4">
				<div class="col-12 col-lg-3">
					<FilterSidebar :categories="categories" @filter-change="onFilterChange" />
				</div>
				<div class="col-12 col-lg-9">
					<div v-for="group in groupedFilteredItems" :key="group.category" class="mb-4">
						<div class="text-uppercase small fw-semibold text-secondary mb-2">{{ group.category }}</div>
						<div class="row g-4">
							<div v-for="item in group.list" :key="item.id" class="col-12 col-md-6 col-xxl-4">
								<FoodCard :item="item" />
							</div>
						</div>
					</div>
					<div v-if="filteredItems.length === 0" class="text-center py-5 text-muted">
						No menu items match the current filters.
					</div>
				</div>
			</div>
		</div>
		<router-link class="floating-cart btn btn-warning text-dark fw-bold rounded-3 shadow-lg" to="/cart"
			data-cart-target="true">
			🛒 Order Cart <span class="badge text-bg-dark ms-2">{{ itemCount }}</span>
		</router-link>
	</section>
</template>

<style scoped>
.floating-cart {
	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 5.5rem;
	z-index: 1040;
	padding: 0.85rem 1.4rem;
}

@media (max-width: 768px) {
	.floating-cart {
		left: 50%;
		bottom: 5rem;
		transform: translateX(-50%);
		padding: 0.75rem 1.2rem;
	}
}
</style>
