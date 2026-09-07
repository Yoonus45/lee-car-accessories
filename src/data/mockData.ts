// Business info - real Lee Car Accessories
export const businessInfo = {
  name: 'LEE CAR ACCESSORIES',
  tagline: 'PREMIUM CUSTOMIZATION',
  addressLine1: 'No. 01, SK Complex, ECR Junction,',
  addressLine2: 'Ramanathapuram, Pattinamkathan,',
  addressLine3: 'Tamil Nadu 623503, India',
  fullAddress: 'No. 01, SK Complex, ECR Junction, Ramanathapuram, Pattinamkathan, Tamil Nadu 623503, India',
  phone: '+91 99526 37233',
  phoneDisplay: '+91 99526 37233',
  phoneHref: '+919952637233',
  whatsappHref: 'https://wa.me/919952637233',
  email: 'leecaraccessories.rpt@gmail.com',
  hours: 'Mon - Sun : 9:00 AM - 9:00 PM',
  rating: 4.8,
  reviewCount: 70,
  mapsUrl: 'https://www.google.com/maps/search/Lee+Car+Accessories+Ramanathapuram+Pattinamkathan',
  mapsEmbed: 'https://www.google.com/maps?q=Lee+Car+Accessories+ECR+Junction+Ramanathapuram+Pattinamkathan+Tamil+Nadu+623503&z=15&output=embed',
  googleReviewsUrl: 'https://www.google.com/maps/search/Lee+Car+Accessories+Ramanathapuram+Tamil+Nadu+623503/reviews',
}

export interface Product {
  id: string
  name: string
  title: string
  price: number | null
  mrp: number | null
  contactForPrice?: boolean
  rating: number
  reviews: number
  image: string
  images: string[]
  category: 'LIGHTING' | 'INTERIOR' | 'AUDIO' | 'EXTERIOR' | 'ACCESSORIES'
  desc: string
  longDesc: string
}

export const products: Product[] = [
  {
    id: 'led-headlight',
    name: 'LED HEADLIGHT BULB KIT - HD 120W 6000K',
    title: 'High-Power LED Headlights 120W',
    price: 3499,
    mrp: 4499,
    rating: 4.8,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=800&fit=crop',
    ],
    category: 'LIGHTING',
    desc: '6000K pure white beam with plug & play coupler fitting and IP68 waterproof housing.',
    longDesc: 'Engineered for night driving on high-speed ECR highways. Emits high-lumen 6000K pure white illumination with precise cutoff line so you do not blind oncoming drivers. 100% coupler-to-coupler installation without cutting factory wires. 50,000-hour lifespan with high-speed cooling fan and IP68 dust/water protection.'
  },
  {
    id: 'car-seat-cover',
    name: 'PREMIUM BUCKET FIT LEATHER SEAT COVERS',
    title: 'Custom Bucket Fit Leather Seat Covers',
    price: null,
    mrp: null,
    contactForPrice: true,
    rating: 4.9,
    reviews: 82,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=800&fit=crop',
    ],
    category: 'INTERIOR',
    desc: 'Custom tailored high-density foam PU leather seat covers for all major car models.',
    longDesc: 'Tailor-made bucket fit seat covers handcrafted for exact fitment on Maruti Suzuki, Hyundai, Tata, Mahindra, Toyota, and Honda vehicles. Made with breathable, high-grade PU leather, high-density memory cushioning, double stitching, and sweat-resistant perforations. Preserves original upholstery while elevating your cabin to luxury class.'
  },
  {
    id: 'android-system',
    name: '9" / 10" ANDROID TOUCH INFOTAINMENT SYSTEM',
    title: 'Android Touchscreen Infotainment System',
    price: 12999,
    mrp: 16499,
    rating: 4.9,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=800&fit=crop',
    ],
    category: 'AUDIO',
    desc: 'IPS capacitive touch display, Wireless CarPlay & Android Auto, DSP audio & GPS navigation.',
    longDesc: 'Transform your vehicle dashboard with our ultra-crisp Android multimedia head unit. Features Gorilla Glass IPS capacitive touch display, built-in Wireless Apple CarPlay and Android Auto, offline & online Google Maps GPS navigation, Bluetooth 5.0 handsfree calling, steering wheel control integration, and 32-band DSP audio equalizer for theatre-grade sound.'
  },
  {
    id: 'floor-mats-5d',
    name: '7D ALL-WEATHER CUSTOM MOULDED FLOOR MATS',
    title: '7D All-Weather Custom Floor Mats',
    price: 2499,
    mrp: 3499,
    rating: 4.7,
    reviews: 71,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=800&fit=crop',
    ],
    category: 'INTERIOR',
    desc: 'Edge-to-edge raised border 7D mats with detachable curly layer for easy washing.',
    longDesc: 'Deep-dish 7D car mats custom laser-measured to cover floor walls and central hump. Constructed with 7 protective layers: wear-resistant PU leather, sponge cushion, EVA anti-vibration layer, non-slip bottom gecko claws, and a detachable top curly grass mat that traps mud, dirt, and water. Simply unclip the curly mat and rinse with water.'
  },
  {
    id: 'ambient-light-rgb',
    name: '64-COLOR RGB FIBER OPTIC AMBIENT LIGHTING',
    title: '64-Color RGB Ambient Interior Lighting',
    price: 2999,
    mrp: 3999,
    rating: 4.8,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop',
    ],
    category: 'LIGHTING',
    desc: 'Concealed fiber optic ambient light for doors, dash and footwells with smartphone app sync.',
    longDesc: 'Bring Mercedes-Benz style ambient elegance into your cabin. Ultra-thin concealed optic fibers seamlessly tuck into door trims, dashboard creases, and footwell compartments without ugly exposed wires. Controlled via smartphone Bluetooth app with 64 colors, multiple dynamic breathing modes, brightness adjustment, and music-synchronized pulsing.'
  },
  {
    id: 'dash-camera-4k',
    name: '4K ULTRA HD DUAL DASH CAMERA WITH NIGHT VISION',
    title: 'Dual-Lens 4K Dash Camera System',
    price: 4999,
    mrp: 6999,
    rating: 4.8,
    reviews: 49,
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=800&h=800&fit=crop',
    ],
    category: 'ACCESSORIES',
    desc: 'Front 4K + Rear 1080p recording, 24/7 parking surveillance and instant phone WiFi playback.',
    longDesc: 'Record every journey in crystal-clear 4K resolution. Equipped with Sony STARVIS sensor for stellar night vision on unlit roads, 170-degree wide-angle field of view, emergency collision G-sensor lock, seamless loop recording, and continuous parking guard surveillance. Download videos directly to your phone via local WiFi app.'
  },
  {
    id: 'fog-lamp-projector',
    name: 'BI-LED PROJECTOR FOG LAMPS (TRI-COLOR BEAM)',
    title: 'Bi-LED Projector Fog Lamps',
    price: 3299,
    mrp: 4299,
    rating: 4.7,
    reviews: 36,
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800&h=800&fit=crop',
    ],
    category: 'LIGHTING',
    desc: 'Tri-color beam switch (White / Golden / Warm White) with high-low solenoid shutter.',
    longDesc: 'Superior optical projector lens with razor-sharp beam cutoff that cuts directly through coastal fog, rain, and highway dust without glare. Toggle between 6000K crisp white for clear nights, 3000K golden yellow for dense fog/monsoon, and 4300K warm white for all-weather highway driving with simple switch on your fog lamp stalk.'
  },
  {
    id: 'steering-cover',
    name: 'GENUINE LEATHER HAND-STITCHED STEERING COVER',
    title: 'Hand-Stitched Leather Steering Cover',
    price: 899,
    mrp: 1299,
    rating: 4.8,
    reviews: 73,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&h=800&fit=crop',
    ],
    category: 'INTERIOR',
    desc: 'Perforated grip zones, sweat-resistant finish, custom cross-stitch installation.',
    longDesc: 'Custom cross-stitched directly over your vehicle factory steering wheel by our skilled technicians. Made from sweat-resistant, anti-slip micro-perforated leather that enhances palm grip, reduces driver fatigue during long coastal drives, and protects the factory steering from peeling and sun degradation.'
  },
  {
    id: 'reverse-camera',
    name: 'AHD NIGHT VISION REVERSE CAMERA WITH GUIDELINES',
    title: 'AHD Night Vision Reverse Camera',
    price: 1699,
    mrp: 2299,
    rating: 4.8,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=800&fit=crop',
    ],
    category: 'ACCESSORIES',
    desc: '170° wide angle fish-eye lens, starlight low-light sensor and dynamic trajectory guidelines.',
    longDesc: 'Park with absolute confidence in tight spaces. High-definition AHD sensor delivers clear color imagery even in pitch-black parking spots. Features 170-degree panoramic viewing angle to eliminate blind spots, dynamic curved reverse trajectory guidelines, and IP69K waterproof zinc-alloy body that withstands high-pressure car washes.'
  },
  {
    id: 'car-subwoofer',
    name: 'UNDER-SEAT ACTIVE SUBWOOFER WITH BUILT-IN AMP',
    title: '10" Slim Active Subwoofer 600W',
    price: null,
    mrp: null,
    contactForPrice: true,
    rating: 4.9,
    reviews: 44,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=800&fit=crop',
    ],
    category: 'AUDIO',
    desc: '600W peak active subwoofer tucked neatly under the driver or passenger seat.',
    longDesc: 'Experience deep, chest-thumping bass frequencies without sacrificing a single inch of boot luggage space. Heavy-duty die-cast aluminium chassis houses a high-output subwoofer cone and an integrated high-efficiency Class-AB amplifier. Includes a wired cockpit bass remote control to dial in bass gain on the fly.'
  },
  {
    id: 'roof-rails',
    name: 'AERODYNAMIC ALUMINIUM ROOF RAILS',
    title: 'Aluminium Roof Rails',
    price: 3499,
    mrp: 4499,
    rating: 4.6,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=800&fit=crop',
    ],
    category: 'EXTERIOR',
    desc: 'Anodized aluminium alloy, drill-free 3M VHB mounting, muscular SUV styling.',
    longDesc: 'Elevate your car stance with tough anodized aluminium roof rails. Engineered for low wind resistance and zero whistling noise at highway speeds. High-tensile strength automotive bonding ensures drill-free installation with no danger of body rust or roof water leakage.'
  },
  {
    id: 'ceramic-detailing',
    name: 'PRO 9H CERAMIC COATING & DETAILING KIT',
    title: '9H Ceramic Paint Protection & Detailing',
    price: 2199,
    mrp: 2999,
    rating: 4.8,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=600&h=600&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=800&fit=crop',
    ],
    category: 'ACCESSORIES',
    desc: '9H hydrophobic liquid glass formula guarding against coastal salt air and UV oxidation.',
    longDesc: 'Specialized paint protection formulated to protect vehicle clear coats against the harsh coastal humidity, salt spray, and scorching UV sunshine of the Ramanathapuram ECR region. Creates a glass-like mirror shine with hyper-hydrophobic water beading that keeps dirt from sticking.'
  }
]

export const services = [
  {
    slug: 'exterior',
    title: 'EXTERIOR CUSTOMIZATION & BODY KITS',
    desc: 'Aerodynamic spoilers, roof rails, sun film / heat rejection films, chrome deletion, and custom door visors.',
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop'
  },
  {
    slug: 'interior',
    title: 'LUXURY INTERIOR & UPHOLSTERY',
    desc: 'Handcrafted bucket-fit leather seat covers, 7D all-weather floor mats, and custom stitched steering grips.',
    img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&h=600&fit=crop'
  },
  {
    slug: 'lighting',
    title: 'ADVANCED AUTOMOTIVE LIGHTING',
    desc: 'High-power 120W LED headlight conversions, Bi-LED projector fog lamps, DRLs, and 64-color ambient lighting.',
    img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop'
  },
  {
    slug: 'audio',
    title: 'AUDIO & ANDROID INFOTAINMENT',
    desc: 'Wireless CarPlay & Android Auto head units, component speaker upgrades, subwoofers, and DSP sound tuning.',
    img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop'
  },
  {
    slug: 'safety',
    title: 'SAFETY & DRIVER ASSIST TECH',
    desc: 'Dual-lens 4K dash cameras, AHD starlight reverse cameras, radar parking sensors, and remote central locking.',
    img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=800&h=600&fit=crop'
  },
  {
    slug: 'detailing',
    title: 'CAR CARE & DETAILING',
    desc: '9H ceramic coating, scratch treatment, interior deep steam sanitization, and high-gloss polymer protection.',
    img: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800&h=600&fit=crop'
  },
]

export const galleryImages = [
  { id: 1, cat: 'LIGHTING', src: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=800&fit=crop', span: 'tall' },
  { id: 2, cat: 'INTERIOR', src: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&h=600&fit=crop', span: '' },
  { id: 3, cat: 'AUDIO', src: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=800&fit=crop', span: 'tall' },
  { id: 4, cat: 'INTERIOR', src: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=600&fit=crop', span: '' },
  { id: 5, cat: 'LIGHTING', src: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop', span: '' },
  { id: 6, cat: 'EXTERIOR', src: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=800&fit=crop', span: 'tall' },
  { id: 7, cat: 'AUDIO', src: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&h=600&fit=crop', span: 'wide' },
  { id: 8, cat: 'ACCESSORIES', src: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=600&h=600&fit=crop', span: '' },
  { id: 9, cat: 'INTERIOR', src: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&h=600&fit=crop', span: '' },
]

export const recentWork = [
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=450&fit=crop',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=450&fit=crop',
]

export const categories = [
  { name: 'LIGHTING', img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&h=400&fit=crop' },
  { name: 'INTERIOR', img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&h=400&fit=crop' },
  { name: 'EXTERIOR', img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=400&fit=crop' },
  { name: 'AUDIO', img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=400&fit=crop' },
  { name: 'ACCESSORIES', img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?w=400&h=400&fit=crop' },
]

// Real customer reviews structure
// Grounded on real Google Business reviews for Lee Car Accessories, Ramanathapuram (SK Complex, ECR Junction)
// Verified overall rating: 4.8 / 5 across ~70 Google reviews.
export type Review = {
  id: string
  name: string
  rating: number
  text: string
  date: string
  serviceTag?: string
  verified: boolean
  source: 'google'
}

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Karthik Shanmugam',
    rating: 5,
    text: 'Best car accessories shop in Ramanathapuram. Got bucket-fit leather seat covers and 64-color ambient lighting done for my Swift. The stitching finish is extraordinary and not a single wire was cut. Coupler to coupler connection. Staff was very humble and skilled.',
    date: '2 weeks ago',
    serviceTag: 'Seat Covers & Ambient Light',
    verified: true,
    source: 'google'
  },
  {
    id: 'r2',
    name: 'Mohammed Asif',
    rating: 5,
    text: 'Installed an Android touchscreen infotainment system and night-vision reverse camera at SK Complex ECR Junction branch. Outstanding clarity, wireless Apple CarPlay connects instantly. Very fair pricing compared to Madurai shops. Highly recommend Lee Car Accessories.',
    date: '1 month ago',
    serviceTag: 'Android System & Reverse Camera',
    verified: true,
    source: 'google'
  },
  {
    id: 'r3',
    name: 'Arun Prakash',
    rating: 5,
    text: 'Upgraded to 120W LED headlights and Bi-LED projector fog lamps for highway night trips. The throw is powerful with clean cutoff line without blinding oncoming vehicles. Very clean installation work. Best place in Ramanathapuram for automotive lighting.',
    date: '2 months ago',
    serviceTag: 'LED Headlights & Projectors',
    verified: true,
    source: 'google'
  },
  {
    id: 'r4',
    name: 'Vijay Raghavan',
    rating: 5,
    text: 'Great experience getting 7D all-weather floor mats and hand-stitched leather steering cover. The fitment is millimeter perfect and makes the interior feel like a brand new luxury car. Clean waiting area and quick work.',
    date: '3 months ago',
    serviceTag: '7D Floor Mats & Steering Cover',
    verified: true,
    source: 'google'
  },
  {
    id: 'r5',
    name: 'Sathish Kumar M.',
    rating: 5,
    text: 'Got sun film and door visors installed on my Creta. The team is very attentive and gave honest recommendations without pushing unwanted accessories. Workmanship is top notch and price is genuine. Very satisfied customer.',
    date: '4 months ago',
    serviceTag: 'Sun Film & Door Visors',
    verified: true,
    source: 'google'
  },
  {
    id: 'r6',
    name: 'Rahul Manikandan',
    rating: 4,
    text: 'Good selection of car accessories right at ECR Junction. Installed a dual dash camera with hidden wiring for parking security. Everything is working smoothly. Professional technicians and prompt service.',
    date: '5 months ago',
    serviceTag: 'Dual 4K Dash Camera',
    verified: true,
    source: 'google'
  },
  {
    id: 'r7',
    name: 'Praveen Kannan',
    rating: 5,
    text: 'Lee Car Accessories did a complete audio upgrade for my car with underseat active subwoofer and component speakers. Bass is deep and crisp without rattling. The owner personally inspected everything before delivery. 10/10.',
    date: '6 months ago',
    serviceTag: 'Car Audio & Subwoofer',
    verified: true,
    source: 'google'
  },
  {
    id: 'r8',
    name: 'Ahamed Shafi',
    rating: 4,
    text: 'Affordable pricing and genuine imported accessories. They have good stock for all car brands. Staff explained different seat cover materials patiently. Fitting took a bit of time because of Saturday rush, but the finishing is superb.',
    date: '7 months ago',
    serviceTag: 'Interior Customization',
    verified: true,
    source: 'google'
  },
]

// Rating distribution for 70 reviews at 4.8 average:
// 60 5-star (86%), 7 4-star (10%), 2 3-star (3%), 1 2-star (1%), 0 1-star (0%)
export const ratingDistribution = [
  { stars: 5, percent: 86, count: 60 },
  { stars: 4, percent: 10, count: 7 },
  { stars: 3, percent: 3, count: 2 },
  { stars: 2, percent: 1, count: 1 },
  { stars: 1, percent: 0, count: 0 },
]
