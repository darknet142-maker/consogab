# ConsoGab — L'économie gabonaise à portée de main

Application web et mobile-first dédiée à la découverte, à la promotion et à la mise en relation avec les commerces, artisans et prestataires du Gabon.

## Fonctionnalités principales

- **Espace Consommateur** :
  - Recherche unifiée (entreprises, catalogues, produits) et filtrage par les 15 secteurs d'activité
  - Carte interactive MapLibre GL et géolocalisation adaptative (rayon de 2 km à 50 km)
  - Consultation des catalogues publics, fiches produits en FCFA et panier local
  - Annonces éphémères 24h (*Stories*) et classements des entreprises
  - Mode d'exploration immédiate (*« Se connecter sans authentification »*) avec données de démonstration résilientes
- **Espace Commerçant (Mode Business)** :
  - Gestion multi-entreprises depuis un compte unique
  - Création et publication de catalogues produits/services et de stories 24h
  - Messagerie directe B2C/B2B et intégration WhatsApp

## Stack technique

- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS, Radix UI / Shadcn UI, TanStack Query
- **Cartographie** : MapLibre GL
- **Backend & Base de données** : Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Tests** : Vitest & Testing Library

## Installation et démarrage local

```sh
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env

# 3. Lancer le serveur de développement (http://localhost:8080)
npm run dev
```

## Scripts disponibles

- `npm run dev` : Serveur de développement Vite
- `npm run build` : Build de production
- `npm run test:run` : Exécution de la suite de tests unitaires Vitest
- `npm run type-check` : Vérification statique TypeScript (`tsc --noEmit`)
- `npm run lint` : Analyse statique ESLint
