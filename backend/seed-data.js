import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './src/models/Category.js';
import Brand from './src/models/Brand.js';
import Product from './src/models/Product.js';
dotenv.config();

// ── CATEGORIES ──
const categories = [
  { name: 'Tractors',         slug: 'tractors',        description: 'Compact, utility and row-crop tractors from 20 HP to 120 HP.' },
  { name: 'Harvesters',       slug: 'harvesters',      description: 'Combine harvesters, forage harvesters and threshers.' },
  { name: 'Tillers & Ploughs',slug: 'tillers-ploughs', description: 'Rotary tillers, disc ploughs, mould-board ploughs and harrows.' },
  { name: 'Seed Drills',      slug: 'seed-drills',     description: 'Zero-till seed drills, happy seeders and precision planters.' },
  { name: 'Sprayers',         slug: 'sprayers',        description: 'Boom sprayers, orchard sprayers and mist blowers.' },
  { name: 'Irrigation',       slug: 'irrigation',      description: 'Drip kits, sprinkler systems, pumps and PVC piping.' },
  { name: 'Spare Parts',      slug: 'spare-parts',     description: 'Genuine OEM engine parts, hydraulics, bearings and filters.' },
  { name: 'Engines & Motors', slug: 'engines-motors',  description: 'Diesel engines, electric motors and power tillers.' },
];

// ── BRANDS ──
const brands = [
  { name: 'John Deere',    slug: 'john-deere',    description: 'American heavy-equipment leader — green & gold standard.' },
  { name: 'Mahindra',      slug: 'mahindra',      description: 'India\'s #1 tractor brand with the widest dealer network.' },
  { name: 'Swaraj',        slug: 'swaraj',        description: 'Punjab-born rugged workhorses, now part of Mahindra group.' },
  { name: 'Kubota',        slug: 'kubota',        description: 'Japanese precision engineering for compact tractors and engines.' },
  { name: 'Sonalika',      slug: 'sonalika',      description: 'India\'s youngest tractor brand, exporting to 130+ countries.' },
  { name: 'Escorts',       slug: 'escorts',       description: 'Farmtrac & Powertrac brands — affordable power for small holdings.' },
  { name: 'New Holland',   slug: 'new-holland',   description: 'CNH Industrial brand with blue-blooded Italian engineering.' },
  { name: 'TAFE',          slug: 'tafe',          description: 'Massey Ferguson licensee — the silent giant of Indian agri.' },
];

// ── PRODUCTS ──
const products = [
  {
    title: 'Mahindra 575 DI XP Plus — 45 HP Tractor',
    slug: 'mahindra-575-di-xp-plus',
    description: 'The Mahindra 575 DI XP Plus is a 45 HP workhorse built for Indian terrain. 4-cylinder 2730 cc engine, water-cooled with constant-mesh transmission. 8 forward + 2 reverse gears, power steering and a lift capacity of 1600 kg. Ideal for puddling, haulage and rotavation across medium to large holdings.',
    basePrice: 765000,
    salePrice: 729000,
    categorySlug: 'tractors',
    brandSlug: 'mahindra',
    thumbnail: 'https://images.unsplash.com/photo-1600688188072-04d201d36da4?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1600688188072-04d201d36da4?w=1200&fit=crop', alt: 'Mahindra 575 DI front quarter' },
      { url: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200&fit=crop', alt: 'Mahindra 575 DI side profile in field' },
    ],
    stockQuantity: 15,
    featured: true,
    specs: { engine: '2730 cc, 4-cylinder', hp: '45 HP', gears: '8F + 2R', lift: '1600 kg', fuelTank: '60 L' },
    ratings: { average: 4.6, count: 328 },
  },
  {
    title: 'John Deere 5310 — 55 HP Gear Pro Tractor',
    slug: 'john-deere-5310',
    description: 'John Deere 5310 Gear Pro with 55 HP turbocharged PowerTech engine. 3-cylinder 2900 cc, oil-immersed disc brakes, and 2000 kg hydraulic lift. The 5310 is renowned for its fuel efficiency under load and low maintenance costs — a favourite among custom-hire operators.',
    basePrice: 1095000,
    salePrice: 1039000,
    categorySlug: 'tractors',
    brandSlug: 'john-deere',
    thumbnail: 'https://images.unsplash.com/photo-1530267981375-f08d74229d7f?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1530267981375-f08d74229d7f?w=1200&fit=crop', alt: 'John Deere 5310 green profile' },
    ],
    stockQuantity: 8,
    featured: true,
    specs: { engine: '2900 cc, 3-cylinder turbo', hp: '55 HP', gears: '8F + 4R', lift: '2000 kg', fuelTank: '68 L' },
    ratings: { average: 4.8, count: 412 },
  },
  {
    title: 'Swaraj 744 XT — 50 HP 4WD Tractor',
    slug: 'swaraj-744-xt',
    description: 'Swaraj 744 XT brings 50 HP with 4-wheel drive to handle the toughest paddy and sugarcane fields. 3478 cc 3-cylinder engine with dual-clutch, 8F + 2R transmission and heavy-duty rear axle. The 4WD option gives unmatched grip in wet conditions.',
    basePrice: 895000,
    salePrice: 859000,
    categorySlug: 'tractors',
    brandSlug: 'swaraj',
    thumbnail: 'https://images.unsplash.com/photo-1599252908224-4e69d0b3a8e8?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1599252908224-4e69d0b3a8e8?w=1200&fit=crop', alt: 'Swaraj 744 XT in wheat field' },
    ],
    stockQuantity: 12,
    featured: true,
    specs: { engine: '3478 cc, 3-cylinder', hp: '50 HP', gears: '8F + 2R', lift: '1800 kg', drive: '4WD' },
    ratings: { average: 4.5, count: 267 },
  },
  {
    title: 'Sonalika DI 60 Torque Super — 60 HP',
    slug: 'sonalika-di-60-torque-super',
    description: 'Sonalika DI 60 Torque Super is a 60 HP tractor with 4080 cc engine and advanced hydraulics delivering 2200 kg lift. Constant-mesh gearbox with 12F + 3R, multi-speed PTO and oil-immersed brakes. Known for best-in-class fuel economy and lowest maintenance in its segment.',
    basePrice: 975000,
    salePrice: 949000,
    categorySlug: 'tractors',
    brandSlug: 'sonalika',
    thumbnail: 'https://images.unsplash.com/photo-1577404749488-682b03dbba63?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1577404749488-682b03dbba63?w=1200&fit=crop', alt: 'Sonalika DI 60 front' },
    ],
    stockQuantity: 6,
    featured: false,
    specs: { engine: '4080 cc, 4-cylinder', hp: '60 HP', gears: '12F + 3R', lift: '2200 kg', fuelTank: '65 L' },
    ratings: { average: 4.4, count: 183 },
  },
  {
    title: 'Kubota MU4501 — 45 HP Compact 4WD',
    slug: 'kubota-mu4501',
    description: 'Kubota MU4501 packs Japanese precision into a compact 45 HP 4WD tractor ideal for horticulture and inter-crop operations. Silent 4-cylinder 2434 cc engine, synchromesh gearbox and Category-II 3-point linkage. Narrow turning radius makes it perfect for orchards.',
    basePrice: 835000,
    salePrice: 799000,
    categorySlug: 'tractors',
    brandSlug: 'kubota',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&fit=crop', alt: 'Kubota MU4501 compact' },
    ],
    stockQuantity: 4,
    featured: false,
    specs: { engine: '2434 cc, 4-cylinder', hp: '45 HP', gears: '8F + 8R synchromesh', lift: '1200 kg', drive: '4WD' },
    ratings: { average: 4.7, count: 98 },
  },
  {
    title: 'Kubota HARVESKING PRO — Combine Harvester',
    slug: 'kubota-harvesking-pro',
    description: 'Kubota HARVESKING PRO is a 72 HP combine harvester engineered for rice, wheat and soybean. 5-row cutting bar (2.3m width), 1500L grain tank with 42 L/s unloading rate. Closed-centre hydraulic reel drive and auto-levelling sieves deliver clean grain even on uneven terrain.',
    basePrice: 2850000,
    salePrice: 2749000,
    categorySlug: 'harvesters',
    brandSlug: 'kubota',
    thumbnail: 'https://images.unsplash.com/photo-1600401914252-20be288a64c7?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1600401914252-20be288a64c7?w=1200&fit=crop', alt: 'Kubota combine harvester in paddy' },
    ],
    stockQuantity: 2,
    featured: true,
    specs: { engine: '72 HP diesel', cuttingWidth: '2.3 m', grainTank: '1500 L', unloadingRate: '42 L/s', headerType: '5-row' },
    ratings: { average: 4.9, count: 56 },
  },
  {
    title: 'Mahindra Rotavator — 48-Blade Heavy-Duty',
    slug: 'mahindra-rotavator-48-blade',
    description: 'Heavy-duty 48-blade rotavator compatible with 45-60 HP tractors. 180 cm working width with L-type carbon-steel blades, multi-speed gear drive (205/235 RPM) and adjustable skid depth. One-pass puddling capability — the go-to implement for rice belt farmers.',
    basePrice: 145000,
    salePrice: 134500,
    categorySlug: 'tillers-ploughs',
    brandSlug: 'mahindra',
    thumbnail: 'https://images.unsplash.com/photo-1620699835080-9e6dd43e18de?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1620699835080-9e6dd43e18de?w=1200&fit=crop', alt: 'Rotavator on field' },
    ],
    stockQuantity: 25,
    featured: true,
    specs: { blades: '48 L-type', workingWidth: '180 cm', rpm: '205/235', weight: '380 kg', compatible: '45-60 HP' },
    ratings: { average: 4.5, count: 145 },
  },
  {
    title: 'John Deere Happy Seeder — Zero-Till Planter',
    slug: 'john-deere-happy-seeder',
    description: 'Zero-till happy seeder for direct drilling into standing stubble — no burning required. 10-row with 20 cm row spacing, fluted coulters and inverted-T openers. 200L seed hopper with electric metering drive. Designed to comply with Punjab/Haryana stubble management mandates.',
    basePrice: 195000,
    salePrice: 179500,
    categorySlug: 'seed-drills',
    brandSlug: 'john-deere',
    thumbnail: 'https://images.unsplash.com/photo-1598512195062-06b2e8d8e5f0?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1598512195062-06b2e8d8e5f0?w=1200&fit=crop', alt: 'Happy Seeder in stubble field' },
    ],
    stockQuantity: 18,
    featured: true,
    specs: { rows: 10, rowSpacing: '20 cm', hopper: '200 L', openerType: 'Inverted-T', compatible: '45-55 HP' },
    ratings: { average: 4.3, count: 87 },
  },
  {
    title: 'New Holland FieldKing Boom Sprayer — 600L',
    slug: 'new-holland-fieldking-600l',
    description: 'Tractor-mounted 600-litre boom sprayer with 12 m stainless-steel boom. Triple-diaphragm pump delivering 45 L/min at 40 bar. Height-adjustable boom (50–180 cm) with individual nozzle cut-offs. Ideal for cotton, chilli and vegetable row crops.',
    basePrice: 115000,
    salePrice: 98500,
    categorySlug: 'sprayers',
    brandSlug: 'new-holland',
    thumbnail: 'https://images.unsplash.com/photo-1600456890530-d3e489ba7b8e?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1600456890530-d3e489ba7b8e?w=1200&fit=crop', alt: 'Boom sprayer in action' },
    ],
    stockQuantity: 10,
    featured: false,
    specs: { tank: '600 L', boom: '12 m', pump: '45 L/min ,40 bar', nozzles: '24 adjustable', material: 'Stainless steel' },
    ratings: { average: 4.1, count: 44 },
  },
  {
    title: 'TAFE 45 HP 4-Cylinder Diesel Engine — Genuine OEM',
    slug: 'tafe-45-hp-diesel-engine',
    description: 'Genuine OEM replacement diesel engine block for TAFE/MF 45 HP tractors. 4-cylinder, 2960 cc, direct injection with forged crankshaft. Comes with cylinder head, pistons, liners, gasket kit and timing assembly — ready to drop in.',
    basePrice: 185000,
    salePrice: 167500,
    categorySlug: 'engines-motors',
    brandSlug: 'tafe',
    thumbnail: 'https://images.unsplash.com/photo-1591029132371-6b4c5b40c0a1?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1591029132371-6b4c5b40c0a1?w=1200&fit=crop', alt: 'Diesel engine block' },
    ],
    stockQuantity: 3,
    featured: false,
    specs: { type: 'Direct injection diesel', cylinders: 4, displacement: '2960 cc', crank: 'Forged steel', condition: 'OEM New' },
    ratings: { average: 4.7, count: 33 },
  },
  {
    title: 'Mahindra Hydraulic Pump Kit — 575/585 Series',
    slug: 'mahindra-hydraulic-pump-kit',
    description: 'Complete hydraulic pump rebuild kit for Mahindra 575 and 585 series. Includes gear pump (12 GPM), relief valve, O-ring seal set, suction filter and gaskets. Genuine Mahindra part — 6-month warranty.',
    basePrice: 12500,
    salePrice: 11499,
    categorySlug: 'spare-parts',
    brandSlug: 'mahindra',
    thumbnail: 'https://images.unsplash.com/photo-1631545806609-eac14b0d7b08?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1631545806609-eac14b0d7b08?w=1200&fit=crop', alt: 'Hydraulic pump assembly' },
    ],
    stockQuantity: 40,
    featured: true,
    specs: { flow: '12 GPM', maxPressure: '210 bar', compatible: 'Mahindra 575/585', warranty: '6 months' },
    ratings: { average: 4.4, count: 212 },
  },
  {
    title: 'Swaraj PTO Clutch Assembly — 744 / 855',
    slug: 'swaraj-pto-clutch-assembly',
    description: 'Genuine Swaraj dual PTO clutch plate assembly covering 744, 855 and 963 models. Ceramic-metallic friction material for extended life under heavy rotavator and thresher loads. Complete kit with pressure plate, release bearing and pilot bush.',
    basePrice: 8900,
    salePrice: 8199,
    categorySlug: 'spare-parts',
    brandSlug: 'swaraj',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&fit=crop', alt: 'Clutch assembly' },
    ],
    stockQuantity: 35,
    featured: false,
    specs: { type: 'Dual PTO plate', material: 'Ceramic-metallic', compatible: 'Swaraj 744/855/963', includes: 'Pressure plate + bearing' },
    ratings: { average: 4.2, count: 178 },
  },
  {
    title: 'Escorts Farmtrac 60 EPI Classic — 60 HP',
    slug: 'escorts-farmtrac-60-epi',
    description: 'Farmtrac 60 EPI Classic powered by a 60 HP 3-cylinder 3330 cc engine with EPI (Electronic Pump Injection) technology. 12F + 3R gearbox, oil-immersed brakes and 2000 kg lift. Best value in the 60 HP bracket with class-leading fuel efficiency of 4.5 L/hr at rated load.',
    basePrice: 850000,
    salePrice: 815000,
    categorySlug: 'tractors',
    brandSlug: 'escorts',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&fit=crop', alt: 'Farmtrac 60 front view' },
    ],
    stockQuantity: 10,
    featured: true,
    specs: { engine: '3330 cc, 3-cylinder', hp: '60 HP', gears: '12F + 3R', lift: '2000 kg', injection: 'EPI' },
    ratings: { average: 4.3, count: 156 },
  },
  {
    title: 'New Holland 3630 TX Plus — 55 HP',
    slug: 'new-holland-3630-tx-plus',
    description: 'New Holland 3630 TX Plus offers 55 HP with proven FPT engine technology. 8F + 2R synchromesh transmission, power steering and 1800 kg hydraulic lift. Factory-fitted ROPS canopy and dual-acting draft control. The blue machine that keeps Punjab farming round the clock.',
    basePrice: 920000,
    salePrice: 889000,
    categorySlug: 'tractors',
    brandSlug: 'new-holland',
    thumbnail: 'https://images.unsplash.com/photo-1601221275297-37a78e773ddd?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1601221275297-37a78e773ddd?w=1200&fit=crop', alt: 'New Holland 3630 blue' },
    ],
    stockQuantity: 9,
    featured: true,
    specs: { engine: '2931 cc, 3-cylinder FPT', hp: '55 HP', gears: '8F + 2R', lift: '1800 kg', fuelTank: '62 L' },
    ratings: { average: 4.5, count: 231 },
  },
  {
    title: 'John Deere W50 — Walk-Behind Power Tiller',
    slug: 'john-deere-w50-power-tiller',
    description: 'John Deere W50 is a 6 HP walk-behind power tiller ideal for small holdings (< 2 acres) and inter-row cultivation. 212 cc petrol engine, 3-forward + 1-reverse speed gearbox. 60 cm tilling width with adjustable depth (10–25 cm). Ships with 20-blade rotor and pneumatic wheels.',
    basePrice: 52000,
    salePrice: 47900,
    categorySlug: 'tillers-ploughs',
    brandSlug: 'john-deere',
    thumbnail: 'https://images.unsplash.com/photo-1594675660248-4b6ae5b0e7f6?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1594675660248-4b6ae5b0e7f6?w=1200&fit=crop', alt: 'Power tiller working' },
    ],
    stockQuantity: 30,
    featured: false,
    specs: { engine: '212 cc petrol', hp: '6 HP', speeds: '3F + 1R', tillingWidth: '60 cm', depth: '10-25 cm' },
    ratings: { average: 4.0, count: 62 },
  },
  {
    title: 'TAFE Drip Irrigation Kit — 1 Acre Complete',
    slug: 'tafe-drip-irrigation-kit-1-acre',
    description: 'Complete 1-acre drip irrigation kit with 400 m lateral piping (12 mm), 200 m mainline (40 mm PVC), 600 drippers (4 L/hr), sand filter, venturi injector and all fittings. Reduces water usage by 60% vs flood irrigation. Pre-designed layout diagram included.',
    basePrice: 18500,
    salePrice: 16499,
    categorySlug: 'irrigation',
    brandSlug: 'tafe',
    thumbnail: 'https://images.unsplash.com/photo-1563514227147-6d2fc72dd5a4?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1563514227147-6d2fc72dd5a4?w=1200&fit=crop', alt: 'Drip irrigation system' },
    ],
    stockQuantity: 50,
    featured: true,
    specs: { coverage: '1 acre', lateral: '400 m', mainline: '200 m', drippers: '600 x 4 L/hr', filter: 'Sand + screen' },
    ratings: { average: 4.6, count: 94 },
  },
  {
    title: 'Mahindra Fuel Injector Set — 4-Piece OEM',
    slug: 'mahindra-fuel-injector-set',
    description: 'OEM fuel injector set (4 pieces) for Mahindra 45-60 HP diesel engines. Bosch-licensed multi-hole nozzle with 5-hole 0.22 mm orifice pattern. Factory-calibrated to 220 bar opening pressure. Replace all four for balanced fuel delivery.',
    basePrice: 6500,
    salePrice: 5899,
    categorySlug: 'spare-parts',
    brandSlug: 'mahindra',
    thumbnail: 'https://images.unsplash.com/photo-1581092159803-2c6d6e7c9c6e?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1581092159803-2c6d6e7c9c6e?w=1200&fit=crop', alt: 'Fuel injector set' },
    ],
    stockQuantity: 60,
    featured: false,
    specs: { type: 'Multi-hole 5x0.22mm', openingPressure: '220 bar', pieces: 4, compatible: 'Mahindra 45-60 HP', warranty: '3 months' },
    ratings: { average: 4.3, count: 89 },
  },
  {
    title: 'Sonalika 8100 Multi-Crop Thresher',
    slug: 'sonalika-8100-thresher',
    description: 'Multi-crop thresher handling wheat, paddy, soybean, maize and sunflower. 22 kW (30 HP) output shaft drive with axial-flow drum and double-aspiration cleaning. 1200 kg/hr throughput in wheat, 800 kg/hr in paddy. Tractor PTO-driven — mounts on any 45+ HP tractor.',
    basePrice: 245000,
    salePrice: 229000,
    categorySlug: 'harvesters',
    brandSlug: 'sonalika',
    thumbnail: 'https://images.unsplash.com/photo-1600788996946-6f5f2c6f6f87?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1600788996946-6f5f2c6f6f87?w=1200&fit=crop', alt: 'Multi-crop thresher' },
    ],
    stockQuantity: 7,
    featured: false,
    specs: { drive: 'PTO 540 RPM', output: '22 kW / 30 HP', throughput: 'Wheat 1200 kg/hr, Paddy 800 kg/hr', crops: 'Wheat, paddy, soybean, maize', compatible: '45+ HP tractor' },
    ratings: { average: 4.4, count: 67 },
  },
  {
    title: 'Mahindra Arjun 605 DI — 60 HP Tractor',
    slug: 'mahindra-arjun-605-di',
    description: 'Mahindra Arjun 605 DI is a 60 HP tractor purpose-built for heavy-duty operations. 3530 cc 4-cylinder engine with constant-mesh transmission delivering 12F + 3R gears. Advanced hydraulics with 2200 kg lift capacity, dual-acting power steering and oil-immersed disc brakes.',
    basePrice: 920000,
    salePrice: 884500,
    categorySlug: 'tractors',
    brandSlug: 'mahindra',
    thumbnail: 'https://images.unsplash.com/photo-1599731732112-c3c4c8c2c7e6?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1599731732112-c3c4c8c2c7e6?w=1200&fit=crop', alt: 'Mahindra Arjun 605' },
    ],
    stockQuantity: 11,
    featured: true,
    specs: { engine: '3530 cc, 4-cylinder', hp: '60 HP', gears: '12F + 3R', lift: '2200 kg', steering: 'Dual-acting power' },
    ratings: { average: 4.6, count: 291 },
  },
  {
    title: 'John Deere Air Filter — Heavy-Duty Dual Element',
    slug: 'john-deere-air-filter-dual-element',
    description: 'Genuine John Deere dual-element air filter for 5310/5310 Diamond series. Primary element with advanced NanoForce media (99.9% filtration at 2 microns) plus secondary safety element. 500-hour service interval in dusty field conditions.',
    basePrice: 2200,
    salePrice: 1949,
    categorySlug: 'spare-parts',
    brandSlug: 'john-deere',
    thumbnail: 'https://images.unsplash.com/photo-1581092173125-53e3b8c7a2c0?w=600&h=600&fit=crop',
    images: [
      { url: 'https://images.unsplash.com/photo-1581092173125-53e3b8c7a2c0?w=1200&fit=crop', alt: 'Air filter dual element' },
    ],
    stockQuantity: 80,
    featured: false,
    specs: { type: 'Dual element', filtration: '99.9% @ 2 microns', serviceInterval: '500 hours', compatible: 'JD 5310/5042/5045', warranty: '2 months' },
    ratings: { average: 4.7, count: 156 },
  },
];

// ── RUN ──
async function seed() {
  await mongoose.connect(process.env.DATABASE_URL, { dbName: 'agriforge' });
  console.log('Connected to MongoDB');

  // Clear existing data
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Brand.deleteMany({});
  console.log('Cleared existing products, categories, brands');

  // Insert categories
  const createdCategories = await Category.insertMany(categories);
  const catMap = Object.fromEntries(createdCategories.map(c => [c.slug, c._id]));
  console.log(`Inserted ${createdCategories.length} categories`);

  // Insert brands
  const createdBrands = await Brand.insertMany(brands);
  const brandMap = Object.fromEntries(createdBrands.map(b => [b.slug, b._id]));
  console.log(`Inserted ${createdBrands.length} brands`);

  // Insert products with category/brand refs
  const productDocs = products.map(p => ({
    ...p,
    categoryId: catMap[p.categorySlug],
    brandId: brandMap[p.brandSlug],
  }));
  // Strip the temp slug fields before inserting
  const clean = productDocs.map(({ categorySlug, brandSlug, ...rest }) => rest);
  await Product.insertMany(clean);
  console.log(`Inserted ${clean.length} products`);

  // Update product counts on categories & brands
  for (const cat of createdCategories) {
    const count = await Product.countDocuments({ categoryId: cat._id });
    await Category.updateOne({ _id: cat._id }, { productCount: count });
  }
  for (const brand of createdBrands) {
    const count = await Product.countDocuments({ brandId: brand._id });
    await Brand.updateOne({ _id: brand._id }, { productCount: count });
  }
  console.log('Updated product counts');

  await mongoose.disconnect();
  console.log('Done — database seeded successfully.');
}

seed().catch(err => { console.error(err); process.exit(1); });
