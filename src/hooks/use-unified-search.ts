import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserLocation } from './use-user-location';
import { getDemoBusinesses, getDemoCatalogs, getDemoProducts } from "@/mocks/consoGabDemoData";

// Fonction pour calculer la distance entre deux points (Haversine)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance en mètres
};

export interface SearchResult {
  id: string;
  name: string;
  type: 'business' | 'catalog' | 'product';
  title: string;
  description?: string;
  category?: string;
  address?: string;
  rating?: number;
  verified?: boolean;
  distance?: string;
  score: number;
  businessId?: string;
  catalogId?: string;
  latitude?: number;
  longitude?: number;
  distance_meters?: number;
}

export interface UnifiedSearchFilters {
  location?: string;
  category?: string;
  verified?: boolean;
  minRating?: number;
  businessType?: string;
  subcategory?: string;
}

export const useUnifiedSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { location: userLocation } = useUserLocation();

  const searchBusinesses = useCallback(async (query: string, filters?: UnifiedSearchFilters): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    try {
      const searchTerm = query.toLowerCase().trim();
      
      // Recherche dans business_profiles
      let businessQuery = supabase
        .from('business_profiles')
        .select('*')
        .eq('is_active', true)
        .eq('is_sleeping', false)
        .eq('is_deactivated', false);

      if (filters?.verified) {
        businessQuery = businessQuery.eq('is_verified', true);
      }

      if (filters?.category) {
        businessQuery = businessQuery.eq('business_category', filters.category as any);
      }

      if (filters?.location) {
        businessQuery = businessQuery.or(`city.ilike.%${filters.location}%,quartier.ilike.%${filters.location}%,department.ilike.%${filters.location}%`);
      }

      const { data: allBusinesses, error: bizError } = await businessQuery;
      if (bizError) throw bizError;

      const sourceBusinesses =
        allBusinesses && allBusinesses.length > 0
          ? allBusinesses
          : getDemoBusinesses().filter((b) => {
              if (filters?.verified && !b.is_verified) return false;
              if (filters?.category && b.business_category !== filters.category) return false;
              if (
                filters?.location &&
                !`${b.city} ${b.quartier}`.toLowerCase().includes(filters.location.toLowerCase())
              ) {
                return false;
              }
              return true;
            });

      const businessResults: SearchResult[] = [];
      
      sourceBusinesses.forEach((business: any) => {
        let score = 0;
        
        // Recherche dans le nom de l'entreprise
        if (business.business_name?.toLowerCase().includes(searchTerm)) {
          score += 100;
        }
        
        // Recherche dans la description
        if (business.description?.toLowerCase().includes(searchTerm)) {
          score += 60;
        }
        
        // Recherche dans l'adresse et localisation
        if (business.address?.toLowerCase().includes(searchTerm)) {
          score += 40;
        }
        
        if (business.quartier?.toLowerCase().includes(searchTerm)) {
          score += 30;
        }

        if (business.city?.toLowerCase().includes(searchTerm)) {
          score += 25;
        }

        // Recherche floue
        const businessWords = (business.business_name || '').toLowerCase().split(' ');
        const queryWords = searchTerm.split(' ');
        
        queryWords.forEach(queryWord => {
          businessWords.forEach(businessWord => {
            if (businessWord.startsWith(queryWord) && queryWord.length >= 2) {
              score += 10;
            }
          });
        });
        
        if (business.is_verified) score += 15;
        
        if (score > 0) {
          businessResults.push({
            id: business.id,
            name: business.business_name,
            type: 'business' as const,
            title: business.business_name,
            description: business.description,
            category: business.business_category,
            address: `${business.address || ''} ${business.quartier || ''} ${business.city || ''}`.trim(),
            verified: business.is_verified,
            score,
            businessId: business.id,
            latitude: business.latitude ? Number(business.latitude) : undefined,
            longitude: business.longitude ? Number(business.longitude) : undefined
          });
        }
      });
      
      return businessResults.filter(item => item.score > 0);
      
    } catch (error) {
      console.error('Error searching businesses, using demo fallback:', error);
      const searchTerm = query.toLowerCase().trim();
      return getDemoBusinesses()
        .filter((b) => {
          if (filters?.verified && !b.is_verified) return false;
          if (filters?.category && b.business_category !== filters.category) return false;
          return (
            b.business_name.toLowerCase().includes(searchTerm) ||
            b.description.toLowerCase().includes(searchTerm) ||
            b.address.toLowerCase().includes(searchTerm) ||
            b.city.toLowerCase().includes(searchTerm)
          );
        })
        .map((b) => ({
          id: b.id,
          name: b.business_name,
          type: 'business' as const,
          title: b.business_name,
          description: b.description,
          category: b.business_category,
          address: `${b.address}, ${b.city}`,
          verified: b.is_verified,
          score: 80,
          businessId: b.id,
          latitude: b.latitude,
          longitude: b.longitude,
        }));
    }
  }, []);

  const searchCatalogs = useCallback(async (query: string, filters?: UnifiedSearchFilters): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    try {
      const searchTerm = query.toLowerCase().trim();
      
      const { data: catalogs, error: catalogError } = await (supabase as any)
        .from('catalogs')
        .select(`
          *,
          business_profiles (
            business_name,
            is_verified,
            city,
            quartier,
            latitude,
            longitude
          )
        `)
        .eq('is_active', true);

      if (catalogError) throw catalogError;

      const sourceCatalogs =
        catalogs && catalogs.length > 0 ? catalogs : getDemoCatalogs();

      return sourceCatalogs.map((catalog: any) => {
        let score = 0;
        
        if (catalog.name?.toLowerCase().includes(searchTerm)) {
          score += 90;
        }
        
        if (catalog.description?.toLowerCase().includes(searchTerm)) {
          score += 40;
        }
        
        if (catalog.keywords && Array.isArray(catalog.keywords)) {
          catalog.keywords.forEach((keyword: string) => {
            if (keyword?.toLowerCase().includes(searchTerm)) {
              score += 30;
            }
          });
        }
        
        if (catalog.synonyms && Array.isArray(catalog.synonyms)) {
          catalog.synonyms.forEach((synonym: string) => {
            if (synonym?.toLowerCase().includes(searchTerm)) {
              score += 25;
            }
          });
        }
        
        return {
          id: catalog.id,
          name: catalog.name,
          type: 'catalog' as const,
          title: catalog.name,
          description: catalog.description,
          category: catalog.category,
          verified: catalog.business_profiles?.is_verified,
          score,
          businessId: catalog.business_id,
          catalogId: catalog.id,
          latitude: catalog.business_profiles?.latitude ? Number(catalog.business_profiles.latitude) : undefined,
          longitude: catalog.business_profiles?.longitude ? Number(catalog.business_profiles.longitude) : undefined
        } as SearchResult;
      }).filter((item: SearchResult) => item.score > 0) || [];
      
    } catch (error) {
      console.error('Error searching catalogs, using demo fallback:', error);
      const searchTerm = query.toLowerCase().trim();
      return getDemoCatalogs()
        .filter(
          (c) =>
            c.name.toLowerCase().includes(searchTerm) ||
            (c.description || '').toLowerCase().includes(searchTerm) ||
            (c.keywords || []).some((k) => k.toLowerCase().includes(searchTerm))
        )
        .map((c) => ({
          id: c.id,
          name: c.name,
          type: 'catalog' as const,
          title: c.name,
          description: c.description || undefined,
          category: c.category || undefined,
          verified: true,
          score: 70,
          businessId: c.business_id,
          catalogId: c.id,
        }));
    }
  }, []);

  const searchProducts = useCallback(async (query: string, filters?: UnifiedSearchFilters): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    try {
      const searchTerm = query.toLowerCase().trim();
      
      const { data: products, error: productError } = await (supabase as any)
        .from('products')
        .select(`
          *,
          business_profiles (
            business_name,
            is_verified,
            latitude,
            longitude
          )
        `)
        .eq('is_available', true);

      if (productError) throw productError;

      const sourceProducts =
        products && products.length > 0 ? products : getDemoProducts();

      return sourceProducts.map((product: any) => {
        let score = 0;
        
        if (product.name?.toLowerCase().includes(searchTerm)) {
          score += 80;
        }
        
        if (product.description?.toLowerCase().includes(searchTerm)) {
          score += 30;
        }
        
        if (product.tags && Array.isArray(product.tags)) {
          product.tags.forEach((tag: string) => {
            if (tag?.toLowerCase().includes(searchTerm)) {
              score += 20;
            }
          });
        }
        
        return {
          id: product.id,
          name: product.name,
          type: 'product' as const,
          title: product.name,
          description: product.description,
          category: product.category,
          verified: product.business_profiles?.is_verified,
          score,
          businessId: product.business_id,
          catalogId: product.catalog_id,
          latitude: product.business_profiles?.latitude ? Number(product.business_profiles.latitude) : undefined,
          longitude: product.business_profiles?.longitude ? Number(product.business_profiles.longitude) : undefined
        } as SearchResult;
      }).filter((item: SearchResult) => item.score > 0) || [];
      
    } catch (error) {
      console.error('Error searching products, using demo fallback:', error);
      const searchTerm = query.toLowerCase().trim();
      return getDemoProducts()
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            (p.description || '').toLowerCase().includes(searchTerm) ||
            (p.tags || []).some((t) => t.toLowerCase().includes(searchTerm))
        )
        .map((p) => ({
          id: p.id,
          name: p.name,
          type: 'product' as const,
          title: p.name,
          description: p.description || undefined,
          category: p.category || undefined,
          verified: p.business?.is_verified,
          score: 75,
          businessId: p.business_id,
          catalogId: p.catalog_id || undefined,
          latitude: p.business?.latitude,
          longitude: p.business?.longitude,
        }));
    }
  }, []);

  const search = useCallback(async (query: string, filters?: UnifiedSearchFilters) => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Recherche parallèle dans toutes les tables
      const [businessResults, catalogResults, productResults] = await Promise.all([
        searchBusinesses(query, filters),
        searchCatalogs(query, filters),
        searchProducts(query, filters)
      ]);

      // Calculer la distance pour chaque résultat
      const resultsWithDistance = [...businessResults, ...catalogResults, ...productResults].map(result => {
        if (result.latitude && result.longitude && userLocation?.latitude && userLocation?.longitude) {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            result.latitude,
            result.longitude
          );
          return {
            ...result,
            distance_meters: distance,
            distance: distance < 1000 
              ? `${Math.round(distance)}m`
              : `${(distance / 1000).toFixed(1)}km`
          };
        }
        return result;
      });
      
      // Trier par distance (du plus proche au plus éloigné)
      resultsWithDistance.sort((a, b) => {
        const distA = a.distance_meters || Infinity;
        const distB = b.distance_meters || Infinity;
        return distA - distB;
      });
      
      // Limiter à 20 résultats
      setResults(resultsWithDistance.slice(0, 20));
    } catch (error) {
      console.error('Search error:', error);
      setError('Erreur lors de la recherche');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchBusinesses, searchCatalogs, searchProducts, userLocation]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    search,
    results,
    loading,
    error,
    clearResults
  };
};
