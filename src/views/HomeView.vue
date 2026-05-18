<script setup>
import sarawakLaksa from '@/assets/images/sarawaklaksaHomepage.jpg'
import kekLapis from '@/assets/images/keklapisHomepage.jpg'
import kampua from '@/assets/images/sarawakKampua.jpg'
import tehC from '@/assets/images/TehC.jpg'
import kolomee from '@/assets/images/kolomee.jpg'
</script>

<template>
	<section class="bg-light bg-gradient py-5 py-lg-6 border-bottom">
		<div class="container py-lg-4">
			<div class="row align-items-center g-5">
				<div class="col-lg-6">
					<div class="laksa-anim mb-3">
						<svg viewBox="0 0 260 180" role="img" aria-label="Kolomee noodles lifted by chopsticks">
							<defs>
								<linearGradient id="broth" x1="0" x2="1" y1="0" y2="1">
									<stop offset="0%" stop-color="#f7c24a" />
									<stop offset="100%" stop-color="#d9942f" />
								</linearGradient>
								<linearGradient id="bowlShade" x1="0" x2="0" y1="0" y2="1">
									<stop offset="0%" stop-color="#ffffff" />
									<stop offset="100%" stop-color="#e5e7eb" />
								</linearGradient>
								<clipPath id="bowlClip">
									<ellipse cx="135" cy="115" rx="74" ry="18" />
								</clipPath>
							</defs>
							<ellipse class="bowl-shadow" cx="135" cy="145" rx="86" ry="14" />
							<path class="bowl-body" d="M50 105 C65 155, 205 155, 220 105 Z" />
							<ellipse class="bowl" cx="135" cy="110" rx="92" ry="28" />
							<ellipse class="bowl-inner" cx="135" cy="112" rx="74" ry="18" />
							<g clip-path="url(#bowlClip)">
								<path class="noodle" d="M118 64 C106 84, 132 100, 120 122" />
								<path class="noodle" d="M130 64 C116 86, 144 100, 130 124" />
								<path class="noodle" d="M144 66 C130 88, 160 104, 146 126" />
								<path class="noodle" d="M156 66 C142 88, 170 106, 156 128" />
								<circle class="garnish" cx="120" cy="110" r="4" />
								<circle class="garnish" cx="150" cy="116" r="3" />
								<circle class="garnish" cx="168" cy="110" r="3.5" />
							</g>
							<ellipse class="bowl-rim" cx="135" cy="110" rx="92" ry="28" />
							<g class="lift-group">
								<path class="chopstick" d="M60 30 L182 68" />
								<path class="chopstick" d="M70 24 L192 62" />
								<g class="noodle-lift">
									<path class="noodle" d="M132 46 C118 66, 146 82, 132 102" />
									<path class="noodle" d="M142 46 C126 68, 156 84, 142 104" />
									<path class="noodle" d="M122 48 C108 70, 136 86, 122 106" />
									<path class="noodle" d="M152 48 C136 70, 166 88, 152 108" />
								</g>
							</g>
						</svg>
					</div>
					<div
						class="d-inline-flex align-items-center gap-2 rounded-pill bg-warning text-dark px-3 py-2 fw-semibold shadow-sm mb-4">
						<span class="small text-uppercase">Taste of Sarawak</span>
						<span class="badge text-bg-dark rounded-pill">Restaurant</span>
					</div>
					<h1 class="display-4 fw-bold lh-1 mb-4 text-dark">
						A warm Sarawak restaurant.
					</h1>
					<p class="lead text-secondary mb-4 pe-lg-5">
						Enjoy laksa, kolomee, kampua, and local drinks with a polished dine-in and takeaway.
					</p>
					<div class="d-flex flex-wrap gap-3 mb-4">
						<router-link class="btn btn-warning text-dark fw-bold rounded-pill px-4 py-3" to="/menu">Browse
							Menu</router-link>
						<router-link class="btn btn-outline-dark rounded-pill px-4 py-3" to="/history">Order
							History</router-link>
					</div>
					<div class="row g-3 mb-4">
						<div class="col-4">
							<div class="h-100 rounded-4 border bg-white shadow-sm p-3">
								<div class="h4 fw-bold mb-1">20+</div>
								<div class="small text-secondary">Local dishes</div>
							</div>
						</div>
						<div class="col-4">
							<div class="h-100 rounded-4 border bg-white shadow-sm p-3">
								<div class="h4 fw-bold mb-1">Fresh</div>
								<div class="small text-secondary">Made daily</div>
							</div>
						</div>
						<div class="col-4">
							<div class="h-100 rounded-4 border bg-white shadow-sm p-3">
								<div class="h4 fw-bold mb-1">Fast</div>
								<div class="small text-secondary">Pickup ready</div>
							</div>
						</div>
					</div>
					<div class="d-flex flex-wrap gap-2"></div>
				</div>
				<div class="col-lg-6">
					<div
						class="p-3 p-md-4 p-lg-5 rounded-5 shadow-lg text-white bg-dark bg-gradient border border-warning border-opacity-25">
						<div class="d-flex justify-content-between align-items-start gap-3 mb-4">
							<div>
								<div class="text-uppercase small text-warning fw-semibold">Chef's pick</div>
								<h3 class="fw-bold mb-1">Sarawak Laksa</h3>
								<p class="text-white-50 mb-0">Creamy broth, herbs, and spice in one iconic bowl.</p>
							</div>
							<span class="badge text-bg-warning text-dark rounded-pill px-3 py-2">Featured</span>
						</div>
						<div class="row g-3">
							<div class="col-12">
								<div class="ratio ratio-16x9 rounded-4 overflow-hidden bg-white shadow-sm">
									<img :src="sarawakLaksa" alt="Sarawak laksa" class="w-100 h-100 object-fit-cover" />
								</div>
							</div>
							<div class="col-6">
								<div class="ratio ratio-1x1 rounded-4 overflow-hidden bg-white shadow-sm">
									<img :src="kekLapis" alt="Kek lapis" class="w-100 h-100 object-fit-cover" />
								</div>
							</div>
							<div class="col-6">
								<div class="ratio ratio-1x1 rounded-4 overflow-hidden bg-white shadow-sm">
									<img :src="kampua" alt="Sarawak kampua" class="w-100 h-100 object-fit-cover" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="py-5 bg-white">
		<div class="container">
			<div class="d-flex align-items-end justify-content-between gap-3 mb-4 flex-wrap">
				<div class="ms-lg-auto text-lg-end">
					<h2 class="fw-bold mb-0">Good Taste</h2>
				</div>
				<router-link class="btn btn-warning text-dark fw-bold rounded-pill px-4" to="/menu">See full
					menu</router-link>
			</div>
			<div class="row g-4 align-items-stretch">
				<div class="col-12 col-lg-6">
					<div class="card h-100 border-0 shadow-sm rounded-4 bg-dark bg-gradient text-white map-card">
						<div class="card-body p-4 d-flex flex-column">
							<div class="text-uppercase small text-warning fw-semibold mb-2">Find us here</div>
							<h5 class="fw-bold mb-3">Our restaurant location</h5>
							<div class="ratio ratio-4x3 rounded-4 overflow-hidden mb-3 map-frame">
								<iframe title="Swinburne University location" class="w-100 h-100 border-0"
									src="https://www.google.com/maps?q=Swinburne%20University%20of%20Technology%20Sarawak%20Campus&output=embed"
									loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
							</div>
							<p class="text-white-50 mb-0">We are located here</p>
						</div>
					</div>
				</div>
				<div class="col-12 col-lg-6">
					<div class="good-taste-stack h-100 d-flex flex-column gap-3">
						<div
							class="card border border-warning border-opacity-50 shadow-sm rounded-4 overflow-hidden stack-card">
							<div class="row g-0 align-items-stretch">
								<div class="col-8">
									<div class="food-thumb h-100 bg-light">
										<img :src="kolomee" alt="Kolomee" class="food-thumb-img" />
									</div>
								</div>
								<div class="col-4">
									<div class="card-body p-3">
										<div class="text-uppercase small text-secondary fw-semibold mb-1">Noodles</div>
										<h6 class="fw-bold mb-1">Kolomee</h6>
										<p class="text-secondary mb-0">A classic Sarawak staple with a clean, satisfying
											finish.</p>
									</div>
								</div>
							</div>
						</div>
						<div
							class="card border border-warning border-opacity-50 shadow-sm rounded-4 overflow-hidden stack-card">
							<div class="row g-0 align-items-stretch">
								<div class="col-8">
									<div class="food-thumb h-100 bg-light">
										<img :src="tehC" alt="Teh C" class="food-thumb-img" />
									</div>
								</div>
								<div class="col-4">
									<div class="card-body p-3">
										<div class="text-uppercase small text-secondary fw-semibold mb-1">Drinks</div>
										<h6 class="fw-bold mb-1">Teh C</h6>
										<p class="text-secondary mb-0">Light, sweet, and perfect alongside spicy dishes.
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="py-5 bg-dark text-white border-top border-warning border-opacity-25">
		<div class="container">
			<div class="row align-items-center g-4">
				<div class="col-lg-8">
					<div class="text-uppercase small text-warning fw-semibold mb-2">Ready to dine?</div>
					<h3 class="fw-bold mb-2">Bring the taste of Sarawak to your table.</h3>
					<p class="text-white-50 mb-0">Start with the menu, add your favorite sides, and complete the meal in
						a few taps.</p>
				</div>
				<div class="col-lg-4 text-lg-end">
					<router-link class="btn btn-warning text-dark fw-bold rounded-pill px-4 py-3" to="/menu">Start
						ordering</router-link>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.laksa-anim {
	width: 500px;
}

.laksa-anim svg {
	width: 100%;
	height: auto;
	display: block;
}

.noodle {
	fill: none;
	stroke: #d28c2d;
	stroke-width: 4.5;
	stroke-linecap: round;
}

.lift-group {
	transform-origin: 130px 60px;
	animation: lift 1.8s ease-in-out infinite;
}

.chopstick {
	fill: none;
	stroke: #6b4f2a;
	stroke-width: 5;
	stroke-linecap: round;
}

.bowl-shadow {
	fill: rgba(15, 23, 42, 0.12);
}

.bowl-body {
	fill: url(#bowlShade);
	stroke: #1f2933;
	stroke-width: 4;
}

.bowl {
	fill: #ffffff;
	stroke: #1f2933;
	stroke-width: 3.5;
}

.bowl-rim {
	fill: none;
	stroke: #111827;
	stroke-width: 3.5;
}

.bowl-inner {
	fill: url(#broth);
}

.garnish {
	fill: #3f8f5b;
}

.food-thumb {
	height: 100%;
	overflow: hidden;
}

.food-thumb-img {
	height: 100%;
	width: 100%;
	object-fit: cover;
	display: block;
}

.good-taste-stack .stack-card {
	flex: 1 1 0;
}

.map-card .map-frame {
	flex: 1 1 auto;
}

@keyframes lift {
	0% {
		transform: translateY(8px);
	}

	50% {
		transform: translateY(-6px);
	}

	100% {
		transform: translateY(8px);
	}
}

@media (max-width: 768px) {
	.laksa-anim {
		width: 380px;
	}

	.food-thumb {
		height: 100%;
	}
}
</style>
