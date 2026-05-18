const menu = [
	{
		id: 1,
		name: 'Laksa Sarawak',
		category: 'Main',
		description: 'Famous Sarawak noodle soup with rich spicy broth and prawns.',
		image: new URL('../assets/images/sarawaklaksa.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [
			{ name: 'Extra Egg', price: 1 },
			{ name: 'Extra Prawn', price: 2 },
		],
	},
	{
		id: 2,
		name: 'Kolo Mee',
		category: 'Main',
		description: 'Dry tossed noodles with minced meat and crispy shallots.',
		image: new URL('../assets/images/kolomee.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [
			{ name: 'Extra Char Siew', price: 2 },
			{ name: 'Extra Fish Ball', price: 1 },
		],
	},
	{
		id: 3,
		name: 'Mee Kampua',
		category: 'Main',
		description: 'Light soy noodle with pork, spring onion, and fragrant oil.',
		image: new URL('../assets/images/sarawakKampua.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [
			{ name: 'Extra Meat', price: 2 },
			{ name: 'Extra Fish Ball', price: 1 },
		],
	},
	{
		id: 4,
		name: 'Nasi Goreng Kampung',
		category: 'Main',
		description: 'Smoky fried rice with anchovy, chili, and egg.',
		image: new URL('../assets/images/NasiGorengKampung.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [
			{ name: 'Extra Egg', price: 1 },
			{ name: 'Extra Sambal', price: 1 },
		],
	},
	{
		id: 5,
		name: 'Ayam Penyet',
		category: 'Main',
		description: 'Crispy smashed chicken with sambal and rice.',
		image: new URL('../assets/images/AyamPenyet.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [
			{ name: 'Extra Chicken', price: 3 },
			{ name: 'Extra Sambal', price: 1 },
		],
	},
	{
		id: 6,
		name: 'Teh C Peng Special',
		category: 'Drinks',
		description: 'Sweet iced tea with milk for a creamy finish.',
		image: new URL('../assets/images/TehC.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [],
	},
	{
		id: 7,
		name: 'Kopi O',
		category: 'Drinks',
		description: 'Classic Sarawak black coffee, strong and aromatic.',
		image: new URL('../assets/images/KopiO.png', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [],
	},
	{
		id: 8,
		name: 'Milo Ais',
		category: 'Drinks',
		description: 'Iced Milo with a rich chocolate malt taste.',
		image: new URL('../assets/images/Milo.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [],
	},
	{
		id: 9,
		name: '3 Layer Tea',
		category: 'Drinks',
		description: 'Signature Teh C 3 layer drink with foam and milk.',
		image: new URL('../assets/images/3LayerTea.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [],
	},
	{
		id: 10,
		name: 'Kek Lapis Sarawak',
		category: 'Dessert',
		description: 'Layered Sarawak cake with rich buttery flavors.',
		image: new URL('../assets/images/keklapis.jpg', import.meta.url).href,
		sizes: [
			{ label: 'Small', price: 5 },
			{ label: 'Medium', price: 6 },
			{ label: 'Special', price: 8 },
		],
		addons: [
			{ name: 'Extra Slice', price: 2 },
		],
	},
]

export default menu
