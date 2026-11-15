import type { Catalog } from '@/types/entities/catalog.types';
import type { BusinessStory } from '@/features/stories/types';
import type { Conversation, Message, CreateMessageDTO } from '@/features/chat/types';
import type { ProductWithDetails } from '@/hooks/use-product';

export interface DemoBusinessProfile {
  id: string;
  user_id: string;
  owner_id: string;
  business_name: string;
  business_category: string;
  description: string;
  address: string;
  city: string;
  province: string;
  country: string;
  quartier: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  logo_url: string;
  cover_image_url: string;
  carousel_images: string[];
  latitude: number;
  longitude: number;
  is_verified: boolean;
  is_active: boolean;
  is_sleeping: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  slug: string;
}

const now = new Date().toISOString();
const expires24h = new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString();

export const DEMO_BUSINESSES: DemoBusinessProfile[] = [
  {
    id: 'biz-gab-001',
    user_id: 'guest-prototype-user',
    owner_id: 'guest-prototype-user',
    business_name: "Saveurs de l'Estuaire",
    business_category: 'restaurant',
    description:
      'Restaurant gastronomique gabonais à Louis : poissons braisés, poulet nyembwe, feuilles de manioc et jus locaux frais servis midi et soir.',
    address: 'Rue de la Mairie, Quartier Louis',
    city: 'Libreville',
    province: 'Estuaire',
    country: 'Gabon',
    quartier: 'Louis',
    phone: '+241 01 74 12 30',
    whatsapp: '+241 06 12 34 56',
    email: 'contact@saveurs-estuaire.ga',
    website: 'https://consogab.ga/saveurs-estuaire',
    logo_url: '/placeholder.svg?height=160&width=160&text=Saveurs',
    cover_image_url: '/placeholder.svg?height=400&width=800&text=Saveurs+de+l+Estuaire',
    carousel_images: [
      '/placeholder.svg?height=400&width=600&text=Salle+Louis',
      '/placeholder.svg?height=400&width=600&text=Nyembwe+Maison',
      '/placeholder.svg?height=400&width=600&text=Grillades',
    ],
    latitude: 0.4048,
    longitude: 9.4392,
    is_verified: true,
    is_active: true,
    is_sleeping: false,
    is_primary: true,
    created_at: now,
    updated_at: now,
    slug: 'saveurs-de-lestuaire',
  },
  {
    id: 'biz-gab-002',
    user_id: 'guest-prototype-user',
    owner_id: 'guest-prototype-user',
    business_name: 'Gabon Tech & Mobile',
    business_category: 'technology',
    description:
      'Boutique spécialisée en smartphones, ordinateurs portables, accessoires originaux et réparation express garantie à Libreville.',
    address: 'Boulevard de l’Indépendance, Centre-Ville',
    city: 'Libreville',
    province: 'Estuaire',
    country: 'Gabon',
    quartier: 'Centre-Ville',
    phone: '+241 01 76 45 89',
    whatsapp: '+241 07 88 45 12',
    email: 'atelier@gabontech.ga',
    website: 'https://consogab.ga/gabon-tech',
    logo_url: '/placeholder.svg?height=160&width=160&text=GabonTech',
    cover_image_url: '/placeholder.svg?height=400&width=800&text=Gabon+Tech+%26+Mobile',
    carousel_images: [
      '/placeholder.svg?height=400&width=600&text=Smartphones',
      '/placeholder.svg?height=400&width=600&text=SAV+Express',
    ],
    latitude: 0.3924,
    longitude: 9.4536,
    is_verified: true,
    is_active: true,
    is_sleeping: false,
    is_primary: false,
    created_at: now,
    updated_at: now,
    slug: 'gabon-tech-mobile',
  },
  {
    id: 'biz-gab-003',
    user_id: 'demo-owner-003',
    owner_id: 'demo-owner-003',
    business_name: 'Pharmacie de Glass',
    business_category: 'healthcare',
    description:
      'Officine ouverte 7j/7 avec conseil pharmaceutique, parapharmacie, tension artérielle gratuite et livraison urgente sur Libreville.',
    address: 'Avenue Félix Éboué, Glass',
    city: 'Libreville',
    province: 'Estuaire',
    country: 'Gabon',
    quartier: 'Glass',
    phone: '+241 01 72 33 10',
    whatsapp: '+241 06 55 21 90',
    email: 'garde@pharmacie-glass.ga',
    website: '',
    logo_url: '/placeholder.svg?height=160&width=160&text=Pharmacie',
    cover_image_url: '/placeholder.svg?height=400&width=800&text=Pharmacie+de+Glass',
    carousel_images: [],
    latitude: 0.3765,
    longitude: 9.4612,
    is_verified: true,
    is_active: true,
    is_sleeping: false,
    is_primary: false,
    created_at: now,
    updated_at: now,
    slug: 'pharmacie-de-glass',
  },
  {
    id: 'biz-gab-004',
    user_id: 'demo-owner-004',
    owner_id: 'demo-owner-004',
    business_name: 'Institut Ébène Beauté & Spa',
    business_category: 'beauty',
    description:
      'Soins capillaires naturels, coiffure afro-moderne, manucure et massages relaxants sur rendez-vous à Angondjé.',
    address: 'Carrefour Château, Angondjé',
    city: 'Akanda',
    province: 'Estuaire',
    country: 'Gabon',
    quartier: 'Angondjé',
    phone: '+241 06 23 89 44',
    whatsapp: '+241 06 23 89 44',
    email: 'rdv@ebene-spa.ga',
    website: '',
    logo_url: '/placeholder.svg?height=160&width=160&text=Ebene+Spa',
    cover_image_url: '/placeholder.svg?height=400&width=800&text=Institut+Ebene+Beaute',
    carousel_images: ['/placeholder.svg?height=400&width=600&text=Soins+Spa'],
    latitude: 0.4912,
    longitude: 9.3941,
    is_verified: true,
    is_active: true,
    is_sleeping: false,
    is_primary: false,
    created_at: now,
    updated_at: now,
    slug: 'institut-ebene-beaute',
  },
  {
    id: 'biz-gab-005',
    user_id: 'demo-owner-005',
    owner_id: 'demo-owner-005',
    business_name: 'Marché Bio Nzeng-Ayong',
    business_category: 'retail',
    description:
      'Paniers de produits agricoles gabonais en circuit court : bananes plantains, manioc, safou, miel de la Ngounié et épices.',
    address: 'Rond-point Nzeng-Ayong',
    city: 'Libreville',
    province: 'Estuaire',
    country: 'Gabon',
    quartier: 'Nzeng-Ayong',
    phone: '+241 07 40 19 82',
    whatsapp: '+241 07 40 19 82',
    email: 'paniers@marchebio.ga',
    website: '',
    logo_url: '/placeholder.svg?height=160&width=160&text=MarcheBio',
    cover_image_url: '/placeholder.svg?height=400&width=800&text=Marche+Bio+Nzeng-Ayong',
    carousel_images: [],
    latitude: 0.4163,
    longitude: 9.4882,
    is_verified: false,
    is_active: true,
    is_sleeping: false,
    is_primary: false,
    created_at: now,
    updated_at: now,
    slug: 'marche-bio-nzeng-ayong',
  },
  {
    id: 'biz-gab-006',
    user_id: 'demo-owner-006',
    owner_id: 'demo-owner-006',
    business_name: 'Garage Auto Ogooué Express',
    business_category: 'automotive',
    description:
      'Entretien automobile multimarques, diagnostic électronique, vidange, climatisation et pneumatiques à Port-Gentil.',
    address: 'Avenue Savorgnan de Brazza, Grand Village',
    city: 'Port-Gentil',
    province: 'Ogooué-Maritime',
    country: 'Gabon',
    quartier: 'Grand Village',
    phone: '+241 01 55 81 02',
    whatsapp: '+241 06 81 90 11',
    email: 'atelier@ogooue-auto.ga',
    website: '',
    logo_url: '/placeholder.svg?height=160&width=160&text=OgooueAuto',
    cover_image_url: '/placeholder.svg?height=400&width=800&text=Garage+Ogooue+Express',
    carousel_images: [],
    latitude: -0.7193,
    longitude: 8.7815,
    is_verified: true,
    is_active: true,
    is_sleeping: false,
    is_primary: false,
    created_at: now,
    updated_at: now,
    slug: 'garage-ogooue-express',
  },
];

export interface DemoCatalogWithBusiness extends Catalog {
  business_profiles: {
    business_name: string;
    business_category: string;
    address: string;
    phone: string;
    city: string;
    slug: string;
  };
}

export const DEMO_CATALOGS: DemoCatalogWithBusiness[] = [
  {
    id: 'cat-gab-001',
    business_id: 'biz-gab-001',
    name: 'Carte & Plats Gabonais du Jour',
    description: 'Sélection de grillades au feu de bois, poissons capitaine et plats traditionnels préparés à la commande.',
    price: 7500,
    price_currency: 'XAF',
    category: 'Restauration',
    subcategory: 'Cuisine locale',
    catalog_type: 'products',
    cover_url: '/placeholder.svg?height=300&width=400&text=Menu+Nyembwe',
    images: ['/placeholder.svg?height=300&width=400&text=Menu+Nyembwe'],
    keywords: ['nyembwe', 'poisson', 'braise', 'restaurant', 'libreville'],
    is_public: true,
    is_active: true,
    visibility: 'published',
    seo_score: 92,
    delivery_available: true,
    delivery_cost: 1500,
    delivery_zones: ['Louis', 'Centre-Ville', 'Glass', 'Batterie IV'],
    on_sale: true,
    sale_percentage: 15,
    contact_whatsapp: '+241 06 12 34 56',
    contact_phone: '+241 01 74 12 30',
    contact_email: 'contact@saveurs-estuaire.ga',
    geo_city: 'Libreville',
    geo_district: 'Louis',
    created_at: now,
    updated_at: now,
    business_name: "Saveurs de l'Estuaire",
    likes_count: 42,
    comments_count: 8,
    business_profiles: {
      business_name: "Saveurs de l'Estuaire",
      business_category: 'restaurant',
      address: 'Rue de la Mairie, Quartier Louis',
      phone: '+241 01 74 12 30',
      city: 'Libreville',
      slug: 'saveurs-de-lestuaire',
    },
  },
  {
    id: 'cat-gab-002',
    business_id: 'biz-gab-002',
    name: 'Smartphones, PC & Réparations Express',
    description: 'Téléphones neufs garantis 12 mois, chargeurs rapides USB-C et remplacement d’écran en 45 minutes.',
    price: 185000,
    price_currency: 'XAF',
    category: 'Technologie',
    subcategory: 'Informatique & Mobile',
    catalog_type: 'products',
    cover_url: '/placeholder.svg?height=300&width=400&text=Smartphones+Pro',
    images: ['/placeholder.svg?height=300&width=400&text=Smartphones+Pro'],
    keywords: ['smartphone', 'iphone', 'samsung', 'reparation', 'ordinateur'],
    is_public: true,
    is_active: true,
    visibility: 'published',
    seo_score: 88,
    delivery_available: true,
    delivery_cost: 2000,
    delivery_zones: ['Libreville', 'Akanda', 'Owendo'],
    on_sale: false,
    sale_percentage: null,
    contact_whatsapp: '+241 07 88 45 12',
    contact_phone: '+241 01 76 45 89',
    contact_email: 'atelier@gabontech.ga',
    geo_city: 'Libreville',
    geo_district: 'Centre-Ville',
    created_at: now,
    updated_at: now,
    business_name: 'Gabon Tech & Mobile',
    likes_count: 31,
    comments_count: 5,
    business_profiles: {
      business_name: 'Gabon Tech & Mobile',
      business_category: 'technology',
      address: 'Boulevard de l’Indépendance, Centre-Ville',
      phone: '+241 01 76 45 89',
      city: 'Libreville',
      slug: 'gabon-tech-mobile',
    },
  },
  {
    id: 'cat-gab-003',
    business_id: 'biz-gab-004',
    name: 'Rituels Beauté & Soins Capillaires',
    description: 'Prestations institut : tresses protectrices, soins kératine, hammam aromatique et manucure gel.',
    price: 15000,
    price_currency: 'XAF',
    category: 'Beauté & Bien-être',
    subcategory: 'Coiffure & Spa',
    catalog_type: 'services',
    cover_url: '/placeholder.svg?height=300&width=400&text=Soins+Spa+Ebene',
    images: ['/placeholder.svg?height=300&width=400&text=Soins+Spa+Ebene'],
    keywords: ['coiffure', 'spa', 'massage', 'manucure', 'akanda'],
    is_public: true,
    is_active: true,
    visibility: 'published',
    seo_score: 90,
    delivery_available: false,
    delivery_cost: null,
    delivery_zones: ['Akanda'],
    on_sale: true,
    sale_percentage: 20,
    contact_whatsapp: '+241 06 23 89 44',
    contact_phone: '+241 06 23 89 44',
    contact_email: 'rdv@ebene-spa.ga',
    geo_city: 'Akanda',
    geo_district: 'Angondjé',
    created_at: now,
    updated_at: now,
    business_name: 'Institut Ébène Beauté & Spa',
    likes_count: 54,
    comments_count: 11,
    business_profiles: {
      business_name: 'Institut Ébène Beauté & Spa',
      business_category: 'beauty',
      address: 'Carrefour Château, Angondjé',
      phone: '+241 06 23 89 44',
      city: 'Akanda',
      slug: 'institut-ebene-beaute',
    },
  },
  {
    id: 'cat-gab-004',
    business_id: 'biz-gab-005',
    name: 'Paniers Fermiers Hebdomadaires',
    description: 'Paniers garnis 100 % locaux : bananes mûres, tomates du Haut-Ogooué, piment doux et miel pur.',
    price: 12000,
    price_currency: 'XAF',
    category: 'Alimentation',
    subcategory: 'Produits bio locaux',
    catalog_type: 'products',
    cover_url: '/placeholder.svg?height=300&width=400&text=Panier+Bio+Gabon',
    images: ['/placeholder.svg?height=300&width=400&text=Panier+Bio+Gabon'],
    keywords: ['bio', 'manioc', 'plantain', 'miel', 'marche'],
    is_public: true,
    is_active: true,
    visibility: 'published',
    seo_score: 85,
    delivery_available: true,
    delivery_cost: 1000,
    delivery_zones: ['Nzeng-Ayong', 'Pk5-Pk12', 'Libreville'],
    on_sale: false,
    sale_percentage: null,
    contact_whatsapp: '+241 07 40 19 82',
    contact_phone: '+241 07 40 19 82',
    contact_email: 'paniers@marchebio.ga',
    geo_city: 'Libreville',
    geo_district: 'Nzeng-Ayong',
    created_at: now,
    updated_at: now,
    business_name: 'Marché Bio Nzeng-Ayong',
    likes_count: 27,
    comments_count: 4,
    business_profiles: {
      business_name: 'Marché Bio Nzeng-Ayong',
      business_category: 'retail',
      address: 'Rond-point Nzeng-Ayong',
      phone: '+241 07 40 19 82',
      city: 'Libreville',
      slug: 'marche-bio-nzeng-ayong',
    },
  },
];

export const DEMO_PRODUCTS: ProductWithDetails[] = [
  {
    id: 'prod-gab-001',
    business_id: 'biz-gab-001',
    catalog_id: 'cat-gab-001',
    name: 'Poulet Nyembwe Traditionnel + Bâtons de Manioc',
    description:
      'Poulet fermier mijoté dans une sauce aux noix de palme maison, servi chaud avec deux bâtons de manioc ou du riz parfumé.',
    price: 8500,
    sale_price: 7200,
    is_on_sale: true,
    is_active: true,
    is_available: true,
    category: 'Restauration',
    subcategory: 'Plats gabonais',
    images: ['/placeholder.svg?height=600&width=600&text=Poulet+Nyembwe'],
    sku: 'SAV-NYE-01',
    barcode: null,
    stock_quantity: 18,
    weight: 0.65,
    dimensions: null,
    tags: ['nyembwe', 'fait-maison', 'livraison'],
    created_at: now,
    updated_at: now,
    business: DEMO_BUSINESSES[0],
  },
  {
    id: 'prod-gab-002',
    business_id: 'biz-gab-002',
    name: 'Chargeur Rapide USB-C GaN 65W + Câble Renforcé',
    description:
      'Adaptateur secteur haute puissance compatible ordinateurs portables et smartphones (iPhone, Samsung, Xiaomi), protection contre les surtensions.',
    price: 22000,
    sale_price: 18500,
    is_on_sale: true,
    is_active: true,
    is_available: true,
    category: 'Technologie',
    subcategory: 'Accessoires',
    catalog_id: 'cat-gab-002',
    images: ['/placeholder.svg?height=600&width=600&text=Chargeur+65W'],
    sku: 'TECH-USB-65',
    barcode: null,
    stock_quantity: 12,
    weight: 0.22,
    dimensions: null,
    tags: ['usb-c', 'rapide', 'garantie-1-an'],
    created_at: now,
    updated_at: now,
    business: DEMO_BUSINESSES[1],
  },
  {
    id: 'prod-gab-003',
    business_id: 'biz-gab-005',
    catalog_id: 'cat-gab-004',
    name: 'Panier Fermier Complet de la Semaine (8 kg)',
    description:
      'Assortiment frais récolté le matin : 1 régime de bananes plantains, 2 kg de tubercules de manioc, tomates, aubergines locales et 250g de miel pur.',
    price: 12000,
    sale_price: null,
    is_on_sale: false,
    is_active: true,
    is_available: true,
    category: 'Alimentation',
    subcategory: 'Bio & Local',
    images: ['/placeholder.svg?height=600&width=600&text=Panier+Fermier'],
    sku: 'BIO-PAN-08',
    barcode: null,
    stock_quantity: 25,
    weight: 8,
    dimensions: null,
    tags: ['bio', 'local', 'estuaire'],
    created_at: now,
    updated_at: now,
    business: DEMO_BUSINESSES[4],
  },
];

export const DEMO_STORIES: BusinessStory[] = [
  {
    id: 'story-gab-001',
    business_id: 'biz-gab-001',
    title: 'Menu Nyembwe -15 % ce midi !',
    description: 'Livraison offerte dès 2 menus commandés sur Libreville (Louis, Centre-Ville, Glass).',
    images: ['/placeholder.svg?height=500&width=400&text=Menu+Nyembwe+-15%25'],
    cover_url: '/placeholder.svg?height=500&width=400&text=Menu+Nyembwe+-15%25',
    story_type: 'promo',
    original_price: 8500,
    promo_price: 7200,
    discount_percentage: 15,
    promo_code: 'ESTUAIRE15',
    latitude: 0.4048,
    longitude: 9.4392,
    geo_city: 'Libreville',
    geo_district: 'Louis',
    catalog_id: 'cat-gab-001',
    product_id: 'prod-gab-001',
    is_active: true,
    view_count: 148,
    created_at: now,
    expires_at: expires24h,
    updated_at: now,
    business_profiles: {
      id: 'biz-gab-001',
      business_name: "Saveurs de l'Estuaire",
      logo_url: '/placeholder.svg?height=160&width=160&text=Saveurs',
      business_category: 'restaurant',
      city: 'Libreville',
      quartier: 'Louis',
    },
  },
  {
    id: 'story-gab-002',
    business_id: 'biz-gab-002',
    title: 'Vente Flash Chargeur 65W GaN',
    description: 'Stock limité en boutique Centre-Ville. Protection anti-foudre intégrée.',
    images: ['/placeholder.svg?height=500&width=400&text=Flash+Tech+65W'],
    cover_url: '/placeholder.svg?height=500&width=400&text=Flash+Tech+65W',
    story_type: 'flash_sale',
    original_price: 22000,
    promo_price: 18500,
    discount_percentage: 16,
    promo_code: 'TECH16',
    latitude: 0.3924,
    longitude: 9.4536,
    geo_city: 'Libreville',
    geo_district: 'Centre-Ville',
    catalog_id: 'cat-gab-002',
    product_id: 'prod-gab-002',
    is_active: true,
    view_count: 93,
    created_at: now,
    expires_at: expires24h,
    updated_at: now,
    business_profiles: {
      id: 'biz-gab-002',
      business_name: 'Gabon Tech & Mobile',
      logo_url: '/placeholder.svg?height=160&width=160&text=GabonTech',
      business_category: 'technology',
      city: 'Libreville',
      quartier: 'Centre-Ville',
    },
  },
  {
    id: 'story-gab-003',
    business_id: 'biz-gab-004',
    title: 'Soin Spa & Coiffure -20 %',
    description: 'Offre découverte week-end sur présentation du profil ConsoGab à Angondjé.',
    images: ['/placeholder.svg?height=500&width=400&text=Ebene+Spa+-20%25'],
    cover_url: '/placeholder.svg?height=500&width=400&text=Ebene+Spa+-20%25',
    story_type: 'discount',
    original_price: 18000,
    promo_price: 14400,
    discount_percentage: 20,
    promo_code: 'EBENE20',
    latitude: 0.4912,
    longitude: 9.3941,
    geo_city: 'Akanda',
    geo_district: 'Angondjé',
    catalog_id: 'cat-gab-003',
    product_id: null,
    is_active: true,
    view_count: 76,
    created_at: now,
    expires_at: expires24h,
    updated_at: now,
    business_profiles: {
      id: 'biz-gab-004',
      business_name: 'Institut Ébène Beauté & Spa',
      logo_url: '/placeholder.svg?height=160&width=160&text=Ebene+Spa',
      business_category: 'beauty',
      city: 'Akanda',
      quartier: 'Angondjé',
    },
  },
];

export function getDemoBusinesses(): DemoBusinessProfile[] {
  return DEMO_BUSINESSES;
}

export function getDemoBusinessById(businessId: string): DemoBusinessProfile | undefined {
  return DEMO_BUSINESSES.find((b) => b.id === businessId);
}

export function getDemoCatalogs(businessId?: string): DemoCatalogWithBusiness[] {
  if (!businessId) return DEMO_CATALOGS;
  return DEMO_CATALOGS.filter((c) => c.business_id === businessId);
}

export function getDemoCatalogById(catalogId: string): DemoCatalogWithBusiness | undefined {
  return DEMO_CATALOGS.find((c) => c.id === catalogId);
}

export function getDemoProducts(): ProductWithDetails[] {
  return DEMO_PRODUCTS;
}

export function getDemoProductById(productId: string): ProductWithDetails | undefined {
  return DEMO_PRODUCTS.find((p) => p.id === productId);
}

export function getDemoStories(businessId?: string): BusinessStory[] {
  if (!businessId) return DEMO_STORIES;
  return DEMO_STORIES.filter((s) => s.business_id === businessId);
}

// =========================================================
// Messagerie locale persistante pour le mode sans authentification
// =========================================================

const DEMO_CHAT_STORAGE_KEY = 'consogab_demo_chat_v1';

interface DemoChatStore {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
}

function createInitialChatStore(userId: string): DemoChatStore {
  const biz = DEMO_BUSINESSES[0];
  const convId = 'conv-demo-estuaire';
  const welcomeMsg: Message = {
    id: 'msg-demo-1',
    conversation_id: convId,
    sender_id: 'owner-biz-gab-001',
    content: `Bonjour ! Bienvenue chez ${biz.business_name}. Souhaitez-vous commander notre plat du jour ou réserver une table à Louis ?`,
    message_type: 'text',
    status: 'read',
    created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    sender_profile: {
      id: 'owner-biz-gab-001',
      display_name: biz.business_name,
      avatar_url: biz.logo_url,
    },
  };

  const conv: Conversation = {
    id: convId,
    title: biz.business_name,
    type: 'business',
    created_at: welcomeMsg.created_at,
    updated_at: welcomeMsg.created_at,
    last_message_at: welcomeMsg.created_at,
    unread_count: 1,
    origin_type: 'business',
    origin_id: biz.id,
    business_context: {
      business_id: biz.id,
      business_name: biz.business_name,
      logo_url: biz.logo_url,
      category: biz.business_category,
    },
    last_message: welcomeMsg,
    participants: [
      {
        user_id: userId,
        role: 'consumer',
        joined_at: welcomeMsg.created_at,
        profile: { id: userId, display_name: 'Invité ConsoGab' },
      },
      {
        user_id: 'owner-biz-gab-001',
        role: 'business',
        joined_at: welcomeMsg.created_at,
        profile: {
          id: 'owner-biz-gab-001',
          display_name: biz.business_name,
          avatar_url: biz.logo_url,
        },
      },
    ],
  };

  return {
    conversations: [conv],
    messagesByConversation: {
      [convId]: [welcomeMsg],
    },
  };
}

function readChatStore(userId: string): DemoChatStore {
  try {
    const raw = localStorage.getItem(DEMO_CHAT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoChatStore;
      if (Array.isArray(parsed.conversations) && parsed.messagesByConversation) {
        return parsed;
      }
    }
  } catch {
    // Fallback to initial store
  }
  const initial = createInitialChatStore(userId);
  writeChatStore(initial);
  return initial;
}

function writeChatStore(store: DemoChatStore): void {
  try {
    localStorage.setItem(DEMO_CHAT_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Ignore storage quota errors
  }
}

export function getDemoConversations(userId: string): Conversation[] {
  const store = readChatStore(userId);
  return [...store.conversations].sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function getDemoMessages(conversationId: string, userId = 'guest-prototype-user'): Message[] {
  const store = readChatStore(userId);
  const msgs = store.messagesByConversation[conversationId] || [];
  return [...msgs].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function sendDemoMessage(dto: CreateMessageDTO, userId = 'guest-prototype-user'): Message {
  const store = readChatStore(userId);
  const newMsg: Message = {
    id: `msg-local-${Date.now()}`,
    conversation_id: dto.conversation_id,
    sender_id: userId,
    content: dto.content,
    message_type: dto.message_type || 'text',
    status: 'sent',
    created_at: new Date().toISOString(),
    attachment_url: dto.attachment_url,
    sender_profile: {
      id: userId,
      display_name: 'Invité ConsoGab',
    },
  };

  const existing = store.messagesByConversation[dto.conversation_id] || [];
  store.messagesByConversation[dto.conversation_id] = [newMsg, ...existing];

  store.conversations = store.conversations.map((c) =>
    c.id === dto.conversation_id
      ? {
          ...c,
          updated_at: newMsg.created_at,
          last_message_at: newMsg.created_at,
          last_message: newMsg,
        }
      : c
  );

  writeChatStore(store);
  return newMsg;
}

export function markDemoConversationRead(conversationId: string, userId = 'guest-prototype-user'): void {
  const store = readChatStore(userId);
  store.conversations = store.conversations.map((c) =>
    c.id === conversationId ? { ...c, unread_count: 0 } : c
  );
  writeChatStore(store);
}

export function getOrCreateDemoBusinessConversation(
  businessId: string,
  userId = 'guest-prototype-user'
): Conversation {
  const store = readChatStore(userId);
  const existing = store.conversations.find(
    (c) => c.origin_id === businessId || c.business_context?.business_id === businessId
  );
  if (existing) return existing;

  const business = getDemoBusinessById(businessId) || {
    id: businessId,
    business_name: 'Commerce ConsoGab',
    business_category: 'services',
    logo_url: '/placeholder.svg',
  };

  const convId = `conv-demo-${businessId}`;
  const createdAt = new Date().toISOString();
  const greeting: Message = {
    id: `msg-greet-${Date.now()}`,
    conversation_id: convId,
    sender_id: `owner-${businessId}`,
    content: `Bonjour ! Vous êtes en relation avec ${business.business_name}. Comment pouvons-nous vous aider ?`,
    message_type: 'text',
    status: 'read',
    created_at: createdAt,
    sender_profile: {
      id: `owner-${businessId}`,
      display_name: business.business_name,
      avatar_url: business.logo_url,
    },
  };

  const newConv: Conversation = {
    id: convId,
    title: business.business_name,
    type: 'business',
    created_at: createdAt,
    updated_at: createdAt,
    last_message_at: createdAt,
    unread_count: 0,
    origin_type: 'business',
    origin_id: businessId,
    business_context: {
      business_id: businessId,
      business_name: business.business_name,
      logo_url: business.logo_url,
      category: business.business_category,
    },
    last_message: greeting,
    participants: [
      {
        user_id: userId,
        role: 'consumer',
        joined_at: createdAt,
        profile: { id: userId, display_name: 'Invité ConsoGab' },
      },
      {
        user_id: `owner-${businessId}`,
        role: 'business',
        joined_at: createdAt,
        profile: {
          id: `owner-${businessId}`,
          display_name: business.business_name,
          avatar_url: business.logo_url,
        },
      },
    ],
  };

  store.conversations = [newConv, ...store.conversations];
  store.messagesByConversation[convId] = [greeting];
  writeChatStore(store);
  return newConv;
}

export function getDemoConversationById(
  conversationId: string,
  userId = 'guest-prototype-user'
): Conversation {
  const store = readChatStore(userId);
  return (
    store.conversations.find((c) => c.id === conversationId) ||
    store.conversations[0]
  );
}
