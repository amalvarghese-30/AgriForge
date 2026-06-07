import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import '../src/models/Category.js';
import '../src/models/Brand.js';
import '../src/models/Product.js';

const DEBUG = process.argv.includes('--debug');
const dbg = (...args) => DEBUG && console.log('[DEBUG]', ...args);
const step = (msg) => console.log(`\n${'='.repeat(60)}\n  ${msg}\n${'='.repeat(60)}`);

const __dirname = dirname(fileURLToPath(import.meta.url));

// ===== STEP 1: Load environment variables =====
step('STEP 1: Loading environment variables');

const envPath = resolve(__dirname, '..', '.env');
console.log(`  Reading from: ${envPath}`);
const envContent = readFileSync(envPath, 'utf-8');
const envLines = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const eq = l.indexOf('='); return [l.slice(0, eq), l.slice(eq + 1)]; })
);

const MONGO_URI = envLines.DATABASE_URL;
if (!MONGO_URI) throw new Error('DATABASE_URL not found in backend/.env');

// Mask connection string for display
const maskedUri = MONGO_URI.replace(/\/\/(.*?):.*?@/, '//***:***@');
console.log(`  DATABASE_URL: ${maskedUri}`);
console.log(`  NODE_ENV   : ${envLines.NODE_ENV || '(not set)'}`);
console.log(`  PORT       : ${envLines.PORT || '(not set)'}`);
console.log(`  CLIENT_URL : ${envLines.CLIENT_URL || '(not set)'}`);
dbg('All env vars loaded:', Object.keys(envLines).filter(k => !k.includes('SECRET') && !k.includes('KEY')));

// ===== STEP 2: Connect to MongoDB =====
step('STEP 2: Connecting to MongoDB Atlas');
const startTime = Date.now();
await mongoose.connect(MONGO_URI, { dbName: 'agriforge' });
const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`  Connected to MongoDB Atlas in ${elapsed}s`);
console.log(`  Database: agriforge`);
console.log(`  State: ${mongoose.connection.readyState === 1 ? 'CONNECTED' : 'PENDING'}`);
dbg('Mongoose connection state:', mongoose.connection.readyState);

// ============ STEP 3: CATEGORIES ============
step('STEP 3: Creating Categories');

const categories = [
  { name: 'Tractors', slug: 'tractors', description: 'Compact, utility and row-crop tractors from 20 HP to 120 HP backed by pan-India dealer support.' },
  { name: 'Harvesters', slug: 'harvesters', description: 'Grain harvesters, mini harvesters and forage harvesters engineered for Indian crop conditions.' },
  { name: 'Implements', slug: 'implements', description: 'Tillage, sowing, harvesting and post-harvest implements — ploughs, seeders, levellers and more.' },
  { name: 'Power Tillers', slug: 'power-tillers', description: 'Walk-behind power tillers and power weeders for small-plot farming, orchards and inter-cultivation.' },
  { name: 'Power Weeders', slug: 'power-weeders', description: 'Engine-driven weeders for paddy, sugarcane, vegetables and orchard floor management.' },
  { name: 'Planters & Seeders', slug: 'planters-seeders', description: 'Precision planters, seed cum fertilizer drills, super seeders and vacuum planters.' },
  { name: 'Loaders', slug: 'loaders', description: 'Front-end loaders, sugarcane loaders and backhoe loaders for material handling and construction.' },
  { name: 'Balers', slug: 'balers', description: 'Round balers, square balers and straw management solutions for residue-free farming.' },
  { name: 'Sprayers & Dusters', slug: 'sprayers-dusters', description: 'Tractor-mounted and self-propelled sprayers, mist blowers and dusters for crop protection.' },
  { name: 'Rotavators', slug: 'rotavators', description: 'Heavy-duty rotary tillers for seedbed preparation, puddling and stubble incorporation.' },
  { name: 'Threshers', slug: 'threshers', description: 'Multi-crop threshers for wheat, paddy, maize, soybean and pulses.' },
  { name: 'Spare Parts', slug: 'spare-parts', description: 'Genuine OEM spare parts — engine components, transmission, hydraulics, filters and bearings.' },
];

console.log(`  Deleting existing categories...`);
const Category = mongoose.model('Category');
const catDelResult = await Category.deleteMany({});
console.log(`  Deleted ${catDelResult.deletedCount} existing categories.`);

console.log(`  Inserting ${categories.length} categories:`);
const catDocs = await Category.insertMany(categories);
const catMap = Object.fromEntries(catDocs.map(c => [c.slug, c._id]));

catDocs.forEach(c => {
  console.log(`    ✓ ${c.name.padEnd(25)} (slug: ${c.slug}) → ${c._id}`);
});
console.log(`  ✓ Seeded ${catDocs.length} categories.`);

// ============ STEP 4: BRANDS ============
step('STEP 4: Creating Brands');

const brands = [
  { name: 'John Deere', slug: 'john-deere', description: 'World leader in agricultural machinery with over 180 years of engineering excellence.' },
  { name: 'Mahindra', slug: 'mahindra', description: "India's #1 tractor manufacturer — built for the toughest fields and highest yields." },
  { name: 'Swaraj', slug: 'swaraj', description: 'Trusted Indian tractor brand known for rugged build, low maintenance and high fuel efficiency.' },
  { name: 'Shaktiman', slug: 'shaktiman', description: 'Leading manufacturer of farm equipment — rotavators, harvesters and tillage solutions.' },
  { name: 'Kirloskar', slug: 'kirloskar', description: 'Pioneers in engine technology and mini agri-machinery — power tillers, weeders and drones.' },
  { name: 'Sonalika', slug: 'sonalika', description: "India's fastest-growing tractor brand with advanced European technology." },
  { name: 'New Holland', slug: 'new-holland', description: 'Global agricultural equipment leader with innovative harvesting and baling solutions.' },
  { name: 'Bull', slug: 'bull', description: 'Specialised in loaders and earth-moving attachments for agricultural and light construction use.' },
  { name: 'Redlands', slug: 'redlands', description: 'Premium hay and forage equipment — balers, rakes and grassland machinery.' },
  { name: 'BCS Ferrari', slug: 'bcs-ferrari', description: 'Italian engineering for two-wheel tractors, motor mowers and professional greens care.' },
  { name: 'Escorts', slug: 'escorts', description: 'Farmtrac and Powertrac tractors with modern technology at accessible price points.' },
  { name: 'Kubota', slug: 'kubota', description: 'Japanese precision in compact tractors, transplanters and rice farming machinery.' },
];

console.log(`  Deleting existing brands...`);
const Brand = mongoose.model('Brand');
const brandDelResult = await Brand.deleteMany({});
console.log(`  Deleted ${brandDelResult.deletedCount} existing brands.`);

console.log(`  Inserting ${brands.length} brands:`);
const brandDocs = await Brand.insertMany(brands);
const brandMap = Object.fromEntries(brandDocs.map(b => [b.slug, b._id]));

brandDocs.forEach(b => {
  console.log(`    ✓ ${b.name.padEnd(20)} (slug: ${b.slug}) → ${b._id}`);
});
console.log(`  ✓ Seeded ${brandDocs.length} brands.`);

// ============ STEP 5: PRODUCTS ============
step('STEP 5: Creating Products');

const products = [
  // ===== TRACTORS =====
  {
    title: 'John Deere 5310 PowerTech — 55 HP Tractor',
    slug: 'john-deere-5310-powertech',
    description: `The John Deere 5310 PowerTech is a 55 HP workhorse engineered for heavy tillage, haulage and PTO-driven operations. Its 3-cylinder 2900 cc turbocharged engine delivers flat torque across the RPM band — ideal for cultivator, rotavator and trailer applications.

Key highlights:
• 55 HP @ 2100 RPM with excellent fuel efficiency
• 8 Forward + 4 Reverse collar-shift transmission
• 2000 kg hydraulic lift capacity
• Oil-immersed disc brakes for confident stopping under load
• Dual-clutch for independent PTO operation
• 68-litre fuel tank for full-day field work

Whether you're preparing seedbeds, running a 9-tyne cultivator or hauling sugarcane to the mill, the 5310 delivers consistent performance season after season. Backed by John Deere's nationwide dealer network and 5-year warranty.`,
    basePrice: 985000,
    salePrice: 949000,
    categorySlug: 'tractors',
    brandSlug: 'john-deere',
    stockQuantity: 12,
    specs: { engine: '2900 cc, 3-cylinder turbo', hp: '55 HP', gears: '8F + 4R', lift: '2000 kg', fuelTank: '68 L', warranty: '5 years' },
    featured: true,
  },
  {
    title: 'John Deere 5075E PowerTech — 75 HP Tractor',
    slug: 'john-deere-5075e-powertech',
    description: `The 5075E is the flagship of the 5E series — 75 HP of raw pulling power with advanced hydraulics and a comfortable operator station. Designed for large-acreage farms, custom hiring and commercial operations.

• 75 HP @ 2100 RPM, 4-cylinder turbo
• 9 Forward + 3 Reverse synchromesh transmission
• 2500 kg lift capacity with automatic depth control
• Category II 3-point linkage
• Deluxe seat with tilt steering
• 100-litre fuel tank

Compatible with all major implements from 11-tyne cultivators to heavy disc harrows. Optional 4WD for wet paddy conditions.`,
    basePrice: 1475000,
    salePrice: 1429000,
    categorySlug: 'tractors',
    brandSlug: 'john-deere',
    stockQuantity: 8,
    specs: { engine: '3900 cc, 4-cylinder turbo', hp: '75 HP', gears: '9F + 3R', lift: '2500 kg', fuelTank: '100 L', '4WD Option': 'Yes' },
    featured: true,
  },
  {
    title: 'John Deere 5045 GearPro — 45 HP Tractor',
    slug: 'john-deere-5045-gearpro',
    description: `Compact but mighty — the 5045 GearPro bridges the gap between sub-compact and utility tractors. 45 HP with a proven 3-cylinder engine and 8F+4R gearbox, perfect for orchards, vineyards and mixed farming.

• 45 HP @ 2100 RPM
• 8 Forward + 4 Reverse gear drive
• 1600 kg hydraulic lift
• Power steering
• 55-litre fuel tank`,
    basePrice: 689000,
    salePrice: 659000,
    categorySlug: 'tractors',
    brandSlug: 'john-deere',
    stockQuantity: 15,
    specs: { engine: '2500 cc, 3-cylinder', hp: '45 HP', gears: '8F + 4R', lift: '1600 kg', fuelTank: '55 L' },
    featured: false,
  },
  {
    title: 'John Deere 3028EN — 28 HP Compact Tractor',
    slug: 'john-deere-3028en',
    description: `The 3028EN is built for small farms, horticulture and inter-cultivation. At 28 HP, it's light enough for orchard row spacing but strong enough to run a 5-tyne cultivator or small trailer.

• 28 HP @ 2500 RPM
• 6 Forward + 2 Reverse
• 900 kg lift capacity
• 4WD for superior grip
• Ideal for orchards and vegetable farms`,
    basePrice: 495000,
    salePrice: 475000,
    categorySlug: 'tractors',
    brandSlug: 'john-deere',
    stockQuantity: 20,
    specs: { engine: '1500 cc', hp: '28 HP', gears: '6F + 2R', lift: '900 kg', 'Drive': '4WD' },
    featured: false,
  },
  {
    title: 'Mahindra 575 DI XP Plus — 50 HP Tractor',
    slug: 'mahindra-575-di-xp-plus',
    description: `The legendary Mahindra 575 DI — India's highest-selling 50 HP tractor for over a decade. The XP Plus variant adds a deluxe seat, better ergonomics and a factory-fitted drawbar.

• 50 HP @ 2000 RPM, 4-cylinder
• 8 Forward + 2 Reverse
• 1650 kg lift capacity
• ADDC hydraulic system
• Proven on every soil type in India`,
    basePrice: 785000,
    salePrice: 759000,
    categorySlug: 'tractors',
    brandSlug: 'mahindra',
    stockQuantity: 25,
    specs: { engine: '2979 cc, 4-cylinder', hp: '50 HP', gears: '8F + 2R', lift: '1650 kg' },
    featured: true,
  },
  {
    title: 'Mahindra Arjun 605 DI — 60 HP Tractor',
    slug: 'mahindra-arjun-605-di',
    description: `The Arjun 605 DI brings 60 HP with advanced hydraulics and a heavy-duty final drive. Built for custom hiring operators who demand maximum uptime during peak season.

• 60 HP @ 2100 RPM
• 8 Forward + 2 Reverse with synchromesh
• 2200 kg lift capacity
• Oil-immersed multi-disc brakes
• Deluxe platform with canopy-ready ROPS`,
    basePrice: 985000,
    salePrice: 949000,
    categorySlug: 'tractors',
    brandSlug: 'mahindra',
    stockQuantity: 10,
    specs: { engine: '3300 cc', hp: '60 HP', gears: '8F + 2R', lift: '2200 kg' },
    featured: false,
  },
  {
    title: 'Swaraj 744 XT — 50 HP 4WD Tractor',
    slug: 'swaraj-744-xt',
    description: `Swaraj 744 XT brings legendary Swaraj reliability with 4-wheel drive to handle the toughest paddy and sugarcane fields. 50 HP with excellent low-end torque.

• 50 HP @ 2000 RPM
• 8 Forward + 2 Reverse
• 1750 kg lift
• 4WD with differential lock
• 65-litre fuel tank
• Heavy-duty rear axle`,
    basePrice: 849000,
    salePrice: 819000,
    categorySlug: 'tractors',
    brandSlug: 'swaraj',
    stockQuantity: 18,
    specs: { engine: '3478 cc, 3-cylinder', hp: '50 HP', gears: '8F + 2R', lift: '1750 kg', 'Drive': '4WD' },
    featured: true,
  },
  {
    title: 'Swaraj 963 FE — 60 HP Tractor',
    slug: 'swaraj-963-fe',
    description: `The 963 FE is Swaraj's premier 60 HP workhorse. A powerful 4-cylinder engine paired with a robust drivetrain handles the heaviest implements effortlessly.

• 60 HP @ 2200 RPM
• 8 Forward + 2 Reverse
• 2200 kg lift
• Balanced power-to-weight ratio
• Field-proven across Punjab, Haryana and UP`,
    basePrice: 935000,
    salePrice: 899000,
    categorySlug: 'tractors',
    brandSlug: 'swaraj',
    stockQuantity: 14,
    specs: { engine: '4000 cc, 4-cylinder', hp: '60 HP', gears: '8F + 2R', lift: '2200 kg' },
    featured: false,
  },
  {
    title: 'Sonalika DI 745 III — 50 HP Tractor',
    slug: 'sonalika-di-745-iii',
    description: `The DI 745 III delivers 50 HP with European styling and fuel-efficient CRDi engine technology. A spacious operator platform and smooth synchromesh transmission reduce operator fatigue.

• 50 HP, 3-cylinder CRDi
• 8 Forward + 2 Reverse
• 1800 kg lift capacity
• Best-in-class turning radius
• 60-litre fuel tank`,
    basePrice: 799000,
    salePrice: 769000,
    categorySlug: 'tractors',
    brandSlug: 'sonalika',
    stockQuantity: 16,
    specs: { engine: '3065 cc CRDi', hp: '50 HP', gears: '8F + 2R', lift: '1800 kg', fuelTank: '60 L' },
    featured: false,
  },
  {
    title: 'Escorts Farmtrac 60 Powermaxx — 60 HP Tractor',
    slug: 'escorts-farmtrac-60-powermaxx',
    description: `Farmtrac 60 Powermaxx combines modern engineering with Escorts' 60-year legacy in tractors. Excellent for heavy-duty tillage and haulage.

• 60 HP, 4-cylinder
• 8 Forward + 2 Reverse
• 2000 kg lift capacity
• Multi-speed PTO
• EPA-compliant emissions`,
    basePrice: 859000,
    salePrice: 829000,
    categorySlug: 'tractors',
    brandSlug: 'escorts',
    stockQuantity: 12,
    specs: { engine: '3700 cc', hp: '60 HP', gears: '8F + 2R', lift: '2000 kg' },
    featured: false,
  },

  // ===== HARVESTERS =====
  {
    title: 'John Deere Grain Harvester W50 — 75 HP',
    slug: 'john-deere-grain-harvester-w50',
    description: `The John Deere W50 combine harvester is purpose-built for Indian wheat and paddy fields. 75 HP engine with a 10-foot cutter bar and high-efficiency threshing mechanism.

• 75 HP turbocharged engine
• 10-foot cutter bar
• 1.8-tonne grain tank
• Adjustable concave clearance
• Multi-crop capability (wheat, paddy, soybean, mustard)
• Low grain damage and high separation efficiency`,
    basePrice: 2450000,
    salePrice: 2349000,
    categorySlug: 'harvesters',
    brandSlug: 'john-deere',
    stockQuantity: 5,
    specs: { engine: '75 HP turbo', 'Cutter Bar': '10 ft', 'Grain Tank': '1.8 tonnes', crops: 'Wheat, Paddy, Soybean' },
    featured: true,
  },
  {
    title: 'Kirloskar Mini Harvester — 35 HP Rice/Wheat',
    slug: 'kirloskar-mini-harvester',
    description: `Compact, affordable and efficient — the Kirloskar Mini Harvester is designed for small and marginal farmers. Harvests, threshes and cleans in a single pass.

• 35 HP diesel engine
• 6-foot cutter width
• Track-type undercarriage for wet paddy
• Grain sack filling system
• Easy transport between fields
• Fuel efficient — 4-5 litres per acre`,
    basePrice: 495000,
    salePrice: 469000,
    categorySlug: 'harvesters',
    brandSlug: 'kirloskar',
    stockQuantity: 8,
    specs: { engine: '35 HP', 'Cutter Width': '6 ft', 'Type': 'Track-type', fuel: '4-5 L/acre' },
    featured: true,
  },

  // ===== IMPLEMENTS =====
  {
    title: 'John Deere Mulcher — Heavy Duty Rotary Mulcher',
    slug: 'john-deere-mulcher-heavy-duty',
    description: `Heavy-duty rotary mulcher for crop residue management. Shreds standing stubble and spreads it evenly as organic mulch. Essential for zero-till and conservation agriculture.

• 48-blade rotor
• 6-foot working width
• Adjustable skid depth
• Category I/II hitch
• Chain curtain for operator safety
• Suitable for 45-75 HP tractors`,
    basePrice: 135000,
    salePrice: 125000,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 30,
    specs: { blades: '48', width: '6 ft', 'Tractor HP': '45-75', hitch: 'Cat I/II' },
    featured: false,
  },
  {
    title: 'John Deere Flail Mower — 1.8m Working Width',
    slug: 'john-deere-flail-mower-1-8m',
    description: `The 1.8-metre flail mower delivers a clean, even cut on grass, light brush and cover crops. Y-blade flails produce a finer mulch than rotary cutters.

• 1.8-metre working width
• 28 Y-blade flails
• Hydraulic side-shift
• Adjustable rear roller
• Heavy-duty gearbox with shear bolt protection`,
    basePrice: 98000,
    salePrice: 92000,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 25,
    specs: { width: '1.8 m', flails: '28 Y-blade', shift: 'Hydraulic side-shift' },
    featured: false,
  },
  {
    title: 'John Deere Compact Round Baler — 4x4 ft Bales',
    slug: 'john-deere-compact-round-baler',
    description: `Produce dense 4x4 ft round bales of paddy straw, wheat straw or hay. The compact round baler works with 45+ HP tractors and features automatic twine wrapping.

• Bale size: 4 ft diameter × 4 ft width
• Pickup width: 1.5 metres
• Automatic twine wrap
• Bale density adjustment
• Needs 45+ HP tractor with 540 PTO`,
    basePrice: 385000,
    salePrice: 359000,
    categorySlug: 'balers',
    brandSlug: 'john-deere',
    stockQuantity: 6,
    specs: { 'Bale Size': '4x4 ft', pickup: '1.5 m', 'Tractor HP': '45+', pto: '540 RPM' },
    featured: false,
  },
  {
    title: 'Super Seeder — Happy Seeder Plus (65 HP+)',
    slug: 'super-seeder-happy-seeder-plus',
    description: `The Super Seeder plants wheat directly into standing paddy stubble without burning. It's the key machine for in-situ crop residue management mandated across Punjab, Haryana and UP.

• 10-row planting width
• Rotary tiller + seed drill in one pass
• Fluted roller seed metering
• Adjustable seed and fertilizer rates
• Saves ₹3,000-4,000/acre vs conventional tillage
• Requires 65+ HP tractor`,
    basePrice: 195000,
    salePrice: 179000,
    categorySlug: 'planters-seeders',
    brandSlug: 'shaktiman',
    stockQuantity: 40,
    specs: { rows: '10', 'Tractor HP': '65+', type: 'Rotary tiller + drill combo' },
    featured: true,
  },
  {
    title: 'Seed Cum Fertilizer Drill — 11 Tyne',
    slug: 'seed-cum-fertilizer-drill-11-tyne',
    description: `11-tyne seed cum fertilizer drill for simultaneous seeding and basal fertilizer application. Compatible with wheat, paddy, soybean, gram and mustard.

• 11 tynes × 7-inch spacing
• Separate seed and fertilizer boxes
• Fluted roller metering
• Adjustable seed depth
• Ground wheel-driven
• Suitable for 35-55 HP tractors`,
    basePrice: 48000,
    salePrice: 43900,
    categorySlug: 'planters-seeders',
    brandSlug: 'shaktiman',
    stockQuantity: 50,
    specs: { tynes: '11', spacing: '7 inch', 'Tractor HP': '35-55', drive: 'Ground wheel' },
    featured: false,
  },
  {
    title: 'Multi-Crop Vacuum Planter — 4 Row',
    slug: 'multi-crop-vacuum-planter-4-row',
    description: `Precision vacuum planter for maize, sunflower, cotton and vegetables. Singulates seeds with vacuum discs for perfect plant-to-plant spacing — no thinning labour required.

• 4 rows with adjustable spacing
• Vacuum metering discs for multiple seed sizes
• Individual row clutch for headland turns
• Press wheel depth control
• 35+ HP tractor compatible`,
    basePrice: 178000,
    salePrice: 165000,
    categorySlug: 'planters-seeders',
    brandSlug: 'john-deere',
    stockQuantity: 15,
    specs: { rows: '4', metering: 'Vacuum disc', spacing: 'Adjustable 18-36 inch' },
    featured: false,
  },
  {
    title: 'Rotavator Heavy Duty — 6 ft (48 Blades)',
    slug: 'rotavator-heavy-duty-6ft',
    description: `Heavy-duty 6-foot rotavator for primary and secondary tillage. 48 C-type blades pulverise soil, incorporate crop residues and prepare a perfect seedbed in 1-2 passes.

• 6-foot working width
• 48 C-type blades
• 3-speed gearbox (540/720/1000 RPM)
• Side clutch for safety
• Adjustable rear levelling board
• Suitable for 50-75 HP tractors`,
    basePrice: 75000,
    salePrice: 69900,
    categorySlug: 'rotavators',
    brandSlug: 'shaktiman',
    stockQuantity: 60,
    specs: { width: '6 ft', blades: '48 C-type', speeds: '3-speed gearbox', 'Tractor HP': '50-75' },
    featured: true,
  },
  {
    title: 'Disc Plough — 3 Bottom (MB Type)',
    slug: 'disc-plough-3-bottom-mb',
    description: `3-bottom mouldboard disc plough for primary tillage in hard, dry and stony soils. Breaks the plough pan and inverts soil for moisture conservation.

• 3 bottoms × 14-inch disc
• Category II hitch
• Adjustable working depth up to 12 inches
• Spring-loaded safety trip
• Suitable for 55+ HP tractors`,
    basePrice: 42000,
    salePrice: 38500,
    categorySlug: 'implements',
    brandSlug: 'shaktiman',
    stockQuantity: 45,
    specs: { bottoms: '3 × 14"', depth: 'Up to 12"', hitch: 'Cat II', 'Tractor HP': '55+' },
    featured: false,
  },
  {
    title: 'Cultivator — 9 Tyne Heavy Duty',
    slug: 'cultivator-9-tyne-heavy-duty',
    description: `9-tyne heavy spring cultivator for secondary tillage and field preparation. The spring-loaded tynes trip over obstacles, protecting the frame from damage in stony fields.

• 9 tynes with reversible shovels
• Spring-loaded auto-reset
• 7.5-foot working width
• Category I/II hitch
• Suitable for 45-65 HP tractors`,
    basePrice: 28000,
    salePrice: 25500,
    categorySlug: 'implements',
    brandSlug: 'shaktiman',
    stockQuantity: 80,
    specs: { tynes: '9', width: '7.5 ft', type: 'Spring auto-reset', 'Tractor HP': '45-65' },
    featured: false,
  },
  {
    title: 'Laser Land Leveler — 7 ft Bucket',
    slug: 'laser-land-leveler-7ft',
    description: `Laser-controlled land leveler for precision field grading. Reduces irrigation water use by 25-30% and improves germination uniformity across the field.

• 7-foot bucket with hydraulic control
• Laser transmitter + receiver included
• Automatic scraper height adjustment
• Accuracy: ±2 cm across 4 acres
• Suitable for 55+ HP tractors`,
    basePrice: 285000,
    salePrice: 259000,
    categorySlug: 'implements',
    brandSlug: 'shaktiman',
    stockQuantity: 12,
    specs: { bucket: '7 ft', accuracy: '±2 cm', control: 'Laser auto-level', 'Tractor HP': '55+' },
    featured: true,
  },
  {
    title: 'Single Bottom MB Plough',
    slug: 'single-bottom-mb-plough',
    description: `Single bottom mouldboard plough for primary tillage with smaller tractors. Complete soil inversion buries weeds, residues and pest eggs.

• 12-inch mouldboard
• Category I hitch
• Working depth: 8-12 inches
• Heat-treated share
• Suitable for 25-35 HP tractors`,
    basePrice: 12000,
    salePrice: 10500,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 100,
    specs: { size: '12" mouldboard', depth: '8-12"', hitch: 'Cat I', 'Tractor HP': '25-35' },
    featured: false,
  },
  {
    title: 'Puddler Cum Leveler — 8 ft',
    slug: 'puddler-cum-leveler-8ft',
    description: `8-foot puddler cum leveler for paddy field preparation. Creates a perfectly levelled puddle with minimum water — essential for uniform transplanting.

• 8-foot working width
• Puddling blades + levelling board
• Category I hitch
• Suitable for 45-55 HP tractors
• Saves 20-30% water vs manual puddling`,
    basePrice: 35000,
    salePrice: 32000,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 35,
    specs: { width: '8 ft', type: 'Puddling + levelling', 'Tractor HP': '45-55', 'Water Saving': '20-30%' },
    featured: false,
  },
  {
    title: 'Subsoiler — 1 to 3 Tine',
    slug: 'subsoiler-1-to-3-tine',
    description: `Subsoiler for breaking hardpan layers 18-24 inches below the surface. Improves water infiltration, root penetration and reduces waterlogging.

• Available in 1, 2 or 3 tine configuration
• Curved tine design reduces draft
• Heat-treated, replaceable points
• Working depth: 18-24 inches
• Category II hitch
• Suitable for 65+ HP tractors`,
    basePrice: 28000,
    salePrice: 24900,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 20,
    specs: { tines: '1-3 configurable', depth: '18-24"', hitch: 'Cat II', 'Tractor HP': '65+' },
    featured: false,
  },
  {
    title: 'Chisel Plough — 7 Tyne',
    slug: 'chisel-plough-7-tyne',
    description: `7-tyne chisel plough for deep tillage without soil inversion. Breaks compaction, increases aeration and promotes deep rooting — all while preserving surface residue.

• 7 curved chisel tynes
• Working depth: 10-16 inches
• Category II hitch
• Staggered layout for residue flow
• Suitable for 75+ HP tractors`,
    basePrice: 45000,
    salePrice: 41500,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 15,
    specs: { tynes: '7 curved', depth: '10-16"', hitch: 'Cat II', 'Tractor HP': '75+' },
    featured: false,
  },
  {
    title: 'Ridger — 3 Row Adjustable',
    slug: 'ridger-3-row-adjustable',
    description: `3-row adjustable ridger for making ridges and furrows in sugarcane, potato, cotton and vegetables. Adjustable wing boards control ridge height and width.

• 3 rows with adjustable spacing
• Wing board angle adjustment
• Category I hitch
• Suitable for 35-50 HP tractors`,
    basePrice: 18000,
    salePrice: 16200,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 40,
    specs: { rows: '3 adjustable', hitch: 'Cat I', 'Tractor HP': '35-50' },
    featured: false,
  },
  {
    title: 'Check Basin Former — 1.5m Width',
    slug: 'check-basin-former-1-5m',
    description: `Check basin former creates interconnected basins for efficient flood irrigation. Reduces runoff, ensures uniform water distribution and works well on uneven terrain.

• 1.5-metre working width
• Hydraulic lift system
• Basin size: adjustable
• Category I hitch
• Suitable for 35-50 HP tractors`,
    basePrice: 22000,
    salePrice: 19800,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 18,
    specs: { width: '1.5 m', control: 'Hydraulic lift', 'Tractor HP': '35-50' },
    featured: false,
  },
  {
    title: 'Ratoon Manager — Sugarcane Stubble Shaver',
    slug: 'ratoon-manager-sugarcane-shaver',
    description: `Sugarcane ratoon management implement that shaves stubble at the correct height for optimum regrowth. Paired with disc coulters that loosen the root zone for better tillering.

• Adjustable stubble cutting height
• Disc coulters for root zone aeration
• Heavy-duty gearbox
• Category II hitch
• Suitable for 50+ HP tractors`,
    basePrice: 65000,
    salePrice: 59900,
    categorySlug: 'implements',
    brandSlug: 'john-deere',
    stockQuantity: 10,
    specs: { type: 'Stubble shaver + discs', hitch: 'Cat II', 'Tractor HP': '50+' },
    featured: false,
  },
  {
    title: 'Fertilizer Broadcaster — 400 kg Hopper',
    slug: 'fertilizer-broadcaster-400kg',
    description: `400 kg capacity fertilizer broadcaster for even spreading of urea, DAP and MOP. PTO-driven spinning disc throws granules in a uniform 12-metre pattern.

• 400 kg hopper capacity
• 12-metre spread width
• Adjustable application rate (50-500 kg/ha)
• Stainless steel disc and vanes
• PTO 540 RPM
• Suitable for 35+ HP tractors`,
    basePrice: 25000,
    salePrice: 22500,
    categorySlug: 'implements',
    brandSlug: 'shaktiman',
    stockQuantity: 55,
    specs: { capacity: '400 kg', spread: '12 m', rate: '50-500 kg/ha', pto: '540 RPM' },
    featured: false,
  },
  {
    title: 'Roto Seeder — 8 Row',
    slug: 'roto-seeder-8-row',
    description: `8-row roto seeder combines rotary tillage and precision seeding in one pass. Saves diesel, time and retains soil moisture by eliminating a separate tillage operation.

• 8-row with fluted roller metering
• Rotary tiller + seed drill in one
• Working width: 5 feet
• Adjustable seed depth and rate
• 50+ HP tractor required`,
    basePrice: 135000,
    salePrice: 124500,
    categorySlug: 'planters-seeders',
    brandSlug: 'shaktiman',
    stockQuantity: 25,
    specs: { rows: '8', width: '5 ft', type: 'Rotary + seed drill', 'Tractor HP': '50+' },
    featured: false,
  },

  // ===== LOADERS =====
  {
    title: 'Bull Ultra Loader — 1 Tonne Capacity',
    slug: 'bull-ultra-loader-1-tonne',
    description: `The Bull Ultra Loader is a compact, manoeuvrable front-end loader for agricultural and light construction use. 1-tonne lift capacity with quick-attach bucket system.

• 1-tonne lift capacity
• 2.4-metre lift height
• Quick-attach bucket (included)
• Joystick hydraulic control
• Compatible with 45+ HP tractors
• ROPS-certified mounting frame`,
    basePrice: 185000,
    salePrice: 169000,
    categorySlug: 'loaders',
    brandSlug: 'bull',
    stockQuantity: 10,
    specs: { capacity: '1 tonne', height: '2.4 m', control: 'Joystick hydraulic', 'Tractor HP': '45+' },
    featured: false,
  },
  {
    title: 'Bull Sugarcane Loader V2 — Hydraulic Grab',
    slug: 'bull-sugarcane-loader-v2',
    description: `Sugarcane loader V2 with hydraulic grab for loading cane into trucks and trollies. All-weather operation with high reach and 360° swing.

• Hydraulic grab with serrated jaws
• 4-metre reach
• 360° continuous rotation
• Heavy-duty stabilizer legs
• Diesel engine power pack
• Optional remote control`,
    basePrice: 425000,
    salePrice: 395000,
    categorySlug: 'loaders',
    brandSlug: 'bull',
    stockQuantity: 5,
    specs: { type: 'Hydraulic grab', reach: '4 m', rotation: '360°', power: 'Diesel engine pack' },
    featured: true,
  },
  {
    title: 'Bull Backhoe Loader + Dozer — 50 HP',
    slug: 'bull-backhoe-loader-dozer-50hp',
    description: `Versatile backhoe loader with front dozer blade and rear excavator bucket. Ideal for farm pond digging, field bunding and drainage work.

• 50 HP diesel engine
• 0.25 m³ excavator bucket
• 2.1-metre dozer blade
• 4WD with differential lock
• Enclosed cabin with AC
• Road travel up to 30 km/h`,
    basePrice: 1450000,
    salePrice: 1379000,
    categorySlug: 'loaders',
    brandSlug: 'bull',
    stockQuantity: 3,
    specs: { engine: '50 HP', 'Excavator Bucket': '0.25 m³', blade: '2.1 m', drive: '4WD' },
    featured: false,
  },

  // ===== BALERS & HAY =====
  {
    title: 'Redlands Round Straw Baler — 4x5 ft',
    slug: 'redlands-round-straw-baler-4x5',
    description: `Redlands round baler producing dense 4×5 ft bales of wheat/paddy straw for biomass power plants, dairy farms and cardboard mills.

• Bale size: 4 ft × 5 ft
• Pickup width: 1.8 metres
• Net or twine wrapping
• Bale density up to 150 kg/m³
• Needs 55+ HP tractor
• Low maintenance belt system`,
    basePrice: 425000,
    salePrice: 399000,
    categorySlug: 'balers',
    brandSlug: 'redlands',
    stockQuantity: 8,
    specs: { 'Bale Size': '4×5 ft', pickup: '1.8 m', density: 'Up to 150 kg/m³', wrap: 'Net or twine' },
    featured: true,
  },
  {
    title: 'Redlands Rotary Hay Rake — 4 Rotor',
    slug: 'redlands-rotary-hay-rake-4-rotor',
    description: `4-rotor rotary hay rake for fast, clean raking of alfalfa, oat and grass hay. Gentle crop handling preserves leaf material for higher protein hay.

• 4 rotors, 7.5-metre working width
• Cam-operated tine arms
• Adjustable working height
• Transport width under 3 metres
• 35+ HP tractor required`,
    basePrice: 145000,
    salePrice: 132000,
    categorySlug: 'balers',
    brandSlug: 'redlands',
    stockQuantity: 10,
    specs: { rotors: '4', width: '7.5 m', 'Transport Width': '<3 m', 'Tractor HP': '35+' },
    featured: false,
  },
  {
    title: 'Redlands Bund Former — 2 Row',
    slug: 'redlands-bund-former-2-row',
    description: `Two-row bund former for creating field bunds and raised beds. Essential for drip-irrigated vegetable production and conservation agriculture.

• 2 rows, adjustable spacing
• Bund height: 30-45 cm
• Rear levelling attachment
• Category I/II hitch
• Suitable for 45+ HP tractors`,
    basePrice: 38000,
    salePrice: 34900,
    categorySlug: 'implements',
    brandSlug: 'redlands',
    stockQuantity: 20,
    specs: { rows: '2', 'Bund Height': '30-45 cm', hitch: 'Cat I/II', 'Tractor HP': '45+' },
    featured: false,
  },

  // ===== POWER TILLERS / WEEDERS =====
  {
    title: 'Kirloskar Power Tiller — 12 HP Diesel',
    slug: 'kirloskar-power-tiller-12hp',
    description: `Kirloskar 12 HP power tiller for paddy, vegetable and orchard farming. Comes with rotavator, puddler and trailer attachment points.

• 12 HP air-cooled diesel
• 6 forward + 2 reverse gears
• Rotavator attachment included
• Steering clutch for easy turns
• 4-litre fuel tank
• Ideal for 2-5 acre farms`,
    basePrice: 165000,
    salePrice: 149000,
    categorySlug: 'power-tillers',
    brandSlug: 'kirloskar',
    stockQuantity: 22,
    specs: { engine: '12 HP diesel', gears: '6F + 2R', attachments: 'Rotavator included', fuelTank: '4 L' },
    featured: true,
  },
  {
    title: 'Kirloskar Power Weeder — 5 HP Petrol',
    slug: 'kirloskar-power-weeder-5hp',
    description: `Lightweight 5 HP petrol power weeder for inter-row weeding in vegetables, sugarcane and orchards. Narrow width fits between crop rows without damage.

• 5 HP petrol engine
• Rotary weeding attachment
• Adjustable width: 30-50 cm
• Ergonomic handlebar with vibration damping
• 1.5-litre fuel tank
• Only 45 kg — easy to transport`,
    basePrice: 28000,
    salePrice: 24900,
    categorySlug: 'power-weeders',
    brandSlug: 'kirloskar',
    stockQuantity: 50,
    specs: { engine: '5 HP petrol', width: '30-50 cm', weight: '45 kg', fuelTank: '1.5 L' },
    featured: false,
  },
  {
    title: 'BCS Ferrari Power Weeder — 6 HP Professional',
    slug: 'bcs-ferrari-power-weeder-6hp',
    description: `Italian-engineered BCS Ferrari power weeder with 6 HP petrol engine. Quick-attach system swaps between weeder, ridger and cutter bar in minutes.

• 6 HP BCS petrol engine
• Quick-attach implement system
• Weeder + ridger + cutter bar included
• Differential lock for slopes
• Professional-grade gearbox
• Steel transport wheels`,
    basePrice: 55000,
    salePrice: 49900,
    categorySlug: 'power-weeders',
    brandSlug: 'bcs-ferrari',
    stockQuantity: 15,
    specs: { engine: '6 HP petrol', attachments: 'Weeder, ridger, cutter', weight: '68 kg' },
    featured: false,
  },
  {
    title: 'BCS Ferrari Reaper Binder — 8 HP Diesel',
    slug: 'bcs-ferrari-reaper-binder-8hp',
    description: `Walk-behind reaper binder for small-plot wheat and paddy harvesting. Cuts, gathers and ties bundles automatically — revolutionary for small farms.

• 8 HP diesel engine
• 1.2-metre cutter bar
• Automatic bundle tying (sisal twine)
• 0.3-0.4 acres/hour capacity
• Self-propelled — no tractor needed
• Operates on terraced and sloping fields`,
    basePrice: 135000,
    salePrice: 124500,
    categorySlug: 'harvesters',
    brandSlug: 'bcs-ferrari',
    stockQuantity: 12,
    specs: { engine: '8 HP diesel', 'Cutter Bar': '1.2 m', capacity: '0.3-0.4 acres/hr', tying: 'Auto sisal twine' },
    featured: true,
  },

  // ===== SPRAYERS =====
  {
    title: 'Shaktiman Boom Sprayer — 400 L Tank, 12m Boom',
    slug: 'shaktiman-boom-sprayer-400l',
    description: `Tractor-mounted boom sprayer with 400-litre HDPE tank and 12-metre hydraulic folding boom. Precision application with triple-nozzle body for low, medium and high volume spraying.

• 400-litre HDPE tank with strainer
• 12-metre hydraulic folding boom
• 3-piston diaphragm pump (40 LPM)
• Pressure gauge and regulating valve
• Triple nozzle body (flat fan, hollow cone, flood jet)
• Category I/II hitch for 35+ HP tractors`,
    basePrice: 48000,
    salePrice: 43900,
    categorySlug: 'sprayers-dusters',
    brandSlug: 'shaktiman',
    stockQuantity: 30,
    specs: { tank: '400 L', boom: '12 m', pump: '40 LPM 3-piston', 'Tractor HP': '35+' },
    featured: false,
  },

  // ===== THRESHERS =====
  {
    title: 'Shaktiman Multi-Crop Thresher — 8 HP Motor',
    slug: 'shaktiman-multi-crop-thresher',
    description: `Multi-crop thresher for wheat, paddy, maize, sorghum and pulses. Electric motor or tractor PTO drive with spike-tooth cylinder and cleaning sieve.

• 8 HP / 5.5 kW electric motor
• Spike-tooth threshing cylinder
• 2 sieve cleaning system
• Output: 500-800 kg/hour (wheat)
• Wheat, paddy, maize, soybean, gram ready
• 3 HP blower for chaff separation`,
    basePrice: 145000,
    salePrice: 132000,
    categorySlug: 'threshers',
    brandSlug: 'shaktiman',
    stockQuantity: 18,
    specs: { motor: '8 HP electric', output: '500-800 kg/hr', crops: 'Multi-crop', cleaning: '2-sieve + blower' },
    featured: false,
  },

  // ===== SPARE PARTS =====
  {
    title: 'John Deere Genuine Oil Filter Set — 500 Series',
    slug: 'john-deere-oil-filter-set-500',
    description: `Genuine John Deere oil filter kit for 5000-series tractors (5310, 5405, 5075E, 5045). Includes primary oil filter, fuel filter and hydraulic filter.

• OEM part numbers: RE509241, RE529480, RE60022
• For JD 3-cylinder and 4-cylinder engines
• Genuine John Deere packaging
• 500-hour service interval`,
    basePrice: 2800,
    salePrice: 2490,
    categorySlug: 'spare-parts',
    brandSlug: 'john-deere',
    stockQuantity: 200,
    specs: { type: 'Filter kit', models: '5000 Series', interval: '500 hrs', includes: 'Oil, fuel, hydraulic filters' },
    featured: false,
  },
  {
    title: 'Rotavator Blade Set — C-Type (48 pcs)',
    slug: 'rotavator-blade-set-48-c-type',
    description: `Complete set of 48 C-type rotavator blades for 6-foot heavy-duty rotavators. Boron steel, heat-treated to 48-52 HRC for extended wear life.

• 48 pieces (24 left + 24 right)
• Boron steel, heat-treated
• 48-52 HRC hardness
• Fits Shaktiman, Mahindra, Fieldking 6 ft rotavators
• Bolt kit included`,
    basePrice: 4200,
    salePrice: 3750,
    categorySlug: 'spare-parts',
    brandSlug: 'shaktiman',
    stockQuantity: 500,
    specs: { material: 'Boron steel', hardness: '48-52 HRC', qty: '48 pcs', fit: '6 ft rotavators' },
    featured: false,
  },
];

  // Real Unsplash photo IDs for product images (verified working)
  const UNSPLASH_IDS = [
    // Tractors
    '1592838064575-70ed626d3a0e', '1594771804886-a933bb2d609b', '1614977645540-7abd88ba8e56',
    '1615811361523-6bd03d7748e7', '1606739211185-2c846d734a6d', '1602446692855-6d096499f69b',
    '1564868480822-32f714a0e763', '1527847263472-aa5338d178b8', '1629807473015-41699c4471b5',
    '1619719826894-89d6c4fd5739', '1618346976725-71ee4a1ecc89', '1530267981375-f0de937f5f13',
    '1696441567908-6a04d49e1350', '1659021181759-2f987070b6c9', '1580901369227-308f6f40bdeb',
    // Harvesters
    '1600747476236-76579658b1b1', '1635174815612-fd9636f70146', '1565647952915-9644fcd446a4',
    '1507311036505-05669fc503cb', '1635174815469-6efd052297d4', '1533241242276-46a506b40d66',
    '1614977645968-6db1d7798ac7', '1627996780136-c071a5a74f9f', '1612563788366-21dc6b211b20',
    '1635174815483-81657b67ec48', '1625586891428-65bb5d6f743c', '1731361183731-21d1a6458316',
    '1618987488793-78738e8f80d0', '1689150396762-65ed008390cf', '1635174815474-f16ace18a08f',
    // Irrigation
    '1692369584496-3216a88f94c1', '1738598665698-7fd7af4b5e0c', '1743742566156-f1745850281a',
    '1596753365498-2d23bbfcbc24', '1600266189529-58cc5dc3d63d', '1655048425771-daa9087aaa00',
    '1593463897552-69da7e8343eb', '1645727527942-f12e14a0c841', '1689349483530-bb7a0734d9fb',
    '1708721205892-89515b3aeffb', '1453161535619-303d362ea39f', '1541024626294-9eb360170dd9',
    '1704162485983-7b5cf81894e1', '1593539912781-8a7c3617f400', '1734801973563-b8f3f229b5f1',
    // Sprayers
    '1627920768905-575535d6dd2e', '1627920769842-6887c6df05ca', '1655130944329-b3a63166f6b5',
    '1688892039994-37ee71aa23bc', '1621490087833-96307b5d5620', '1558906307-1a1c52b5ac8a',
    '1655130944281-072e0644db75', '1655130944276-496518f92f98', '1601995163669-210ca5381a4a',
    '1690986375486-460dc48dd499', '1539851286640-d34f4d698024', '1597659506177-4fd0d85cbc92',
    '1696010619929-493071e82b0d',
    // Seed drills / planters
    '1757770576431-669047f57ce6', '1707680880067-5b9e13ba7527', '1707680946878-d02775437174',
    '1774351923106-efc3173ec4ad', '1692397737651-6597ea493faa', '1596289383434-5df5cf5a78df',
    '1707680875721-bc83ba58f09a', '1774351922952-9b276d2f9845', '1742397563685-c87f78a0bfc5',
    '1702563437324-eaeb112bef9c', '1749402635760-4bd7d9ceaafa', '1619519807383-896b6a1a21d5',
    '1684677806819-a3c5d7ebc752', '1774351922771-e628870e8e1a', '1749402641717-1de1a10b28c9',
    // Engines / spare parts
    '1429772011165-0c2e054367b8', '1523559094051-53bac879eb80', '1720244253125-f39d7aeccccf',
    '1628222274353-0f7c1adf8d21', '1666708399175-4096d8fcccd9', '1570762574077-2ca891dd1f3e',
    '1702146715274-d466e629ecc2', '1604434171479-4bfa093e5a82', '1614447428943-52ec0bdbc7aa',
    '1777900201609-ad2f57813ab8', '1763836393413-3b79e6b4560a', '1655103955676-c9fbc4b65525',
    '1770705950498-d373e33ecb1a', '1766842996145-464b9bed0493', '1664697166605-31a99e6c017c',
    // Extra farm/agriculture
    '1560493676-04071c5f467b', '1655929299728-93ee15ed7967', '1573119798379-011dfedae008',
    '1589742906594-b8f9bf425a15', '1598890283065-5577e2c31661', '1557096336-8e576993d3ff',
    '1708955029891-98738cd0361f', '1655048408044-60c05c04a611', '1630095829654-b734f5cb2b25',
    '1688278526565-5bb028024473', '1688320243376-69b68a8f656f', '1776687289197-3ca6321d9928',
    '1780690208760-218fd50574a1', '1776687289195-ade5b0e14354', '1776687300225-a9f112122d17',
  ];

  function getUnsplashId(slug) {
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = ((hash << 5) - hash) + slug.charCodeAt(i);
      hash |= 0;
    }
    return UNSPLASH_IDS[Math.abs(hash) % UNSPLASH_IDS.length];
  }

  console.log(`  Deleting existing products...`);
  const Product = mongoose.model('Product');
  const prodDelResult = await Product.deleteMany({});
  console.log(`  Deleted ${prodDelResult.deletedCount} existing products.`);

  console.log(`  Preparing ${products.length} product documents...`);
  const productDocs = products.map(p => {
    const { categorySlug, brandSlug, ...rest } = p;
    return {
      ...rest,
      categoryId: catMap[categorySlug],
      brandId: brandMap[brandSlug],
      inStock: p.stockQuantity > 0,
      featured: p.featured || false,
      images: [
        { url: `https://images.unsplash.com/photo-${getUnsplashId(p.slug)}?w=800&h=800&fit=crop`, alt: p.title },
      ],
      thumbnail: `https://images.unsplash.com/photo-${getUnsplashId(p.slug)}?w=400&h=400&fit=crop`,
    };
  });

  console.log(`  Inserting ${productDocs.length} products into MongoDB...`);
  const insertStart = Date.now();
  const insertedDocs = await Product.insertMany(productDocs, { ordered: false });
  const insertTime = ((Date.now() - insertStart) / 1000).toFixed(1);

  // Show a summary table
  const byCategory = {};
  insertedDocs.forEach(p => {
    const catSlug = Object.keys(catMap).find(k => String(catMap[k]) === String(p.categoryId));
    if (!byCategory[catSlug]) byCategory[catSlug] = [];
    byCategory[catSlug].push(p);
  });

  console.log(`\n  ┌${'─'.repeat(72)}┐`);
  console.log(`  │ ${'Category'.padEnd(22)} │ ${'Count'.padEnd(6)} │ ${'Products'}${''.padEnd(32)}│`);
  console.log(`  ├${'─'.repeat(72)}┤`);
  for (const [cat, prods] of Object.entries(byCategory)) {
    const names = prods.slice(0, 3).map(p => p.title.slice(0, 30)).join(', ');
    console.log(`  │ ${cat.padEnd(22)} │ ${String(prods.length).padEnd(6)} │ ${(names + (prods.length > 3 ? ' ...' : '')).slice(0, 40).padEnd(40)} │`);
  }
  console.log(`  └${'─'.repeat(72)}┘`);

  console.log(`\n  ✓ Inserted ${insertedDocs.length} products in ${insertTime}s`);

// ============ STEP 6: Update Counts & Disconnect ============
step('STEP 6: Updating product counts & disconnecting');

console.log(`  Updating category product counts...`);
for (const cat of catDocs) {
  const count = await Product.countDocuments({ categoryId: cat._id });
  await Category.findByIdAndUpdate(cat._id, { productCount: count });
  dbg(`  ${cat.name}: ${count} products`);
}
console.log(`  Updated ${catDocs.length} categories.`);

console.log(`  Updating brand product counts...`);
for (const brand of brandDocs) {
  const count = await Product.countDocuments({ brandId: brand._id });
  await Brand.findByIdAndUpdate(brand._id, { productCount: count });
  dbg(`  ${brand.name}: ${count} products`);
}
console.log(`  Updated ${brandDocs.length} brands.`);

const totalProducts = await Product.countDocuments();
console.log(`\n  ✓ All done! ${totalProducts} products in database.`);

await mongoose.disconnect();
console.log('  Disconnected from MongoDB.');
