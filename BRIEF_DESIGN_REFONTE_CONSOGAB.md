# CAHIER DES CHARGES DESIGN & BRIEF PRODUIT — REFONTE TOTALE DE CONSOGAB (GABOMA)

> **Objet du document :** Description fonctionnelle, structurelle et ergonomique exhaustive de l'application **ConsoGab** destinée à l'équipe Product Design (UX/UI) pour une refonte visuelle et expérientielle complète de l'application.

---

## 1. VISION PRODUIT & PROPOSITION DE VALEUR

### 1.1. Qu'est-ce que ConsoGab ?
**ConsoGab** (historiquement nommée *Gaboma* dans certains actifs graphiques) est une **super-application mobile-first de commerce local, d'annuaire géolocalisé et de messagerie commerciale B2C/B2B dédiée au Gabon** (*« Achetons, vendons et consommons 100 % Gaboma »*).

Elle connecte en temps réel :
1. **Les consommateurs gabonais** qui cherchent des commerces, services, restaurants, artisans, catalogues et produits autour d'eux (Libreville, Akanda, Owendo, Port-Gentil, Franceville, Oyem, etc.), souhaitent consulter les prix en **FCFA**, vérifier les horaires, discuter directement avec le vendeur (chat intégré ou WhatsApp) et s'y rendre via une carte interactive.
2. **Les commerçants, TPE/PME et prestataires locaux** qui gèrent une ou plusieurs entreprises depuis le même compte : vitrine publique, catalogues de produits/services, annonces éphémères 24h (*Stories*), messagerie client et paramètres propriétaires.

### 1.2. Particularités du marché cible (Gabon)
Le design doit impérativement intégrer les réalités d'usage locales :
- **Usage Mobile-First (90 %+ sur smartphone)** : écrans de 360px à 430px de large, utilisation fréquente d'une seule main, luminosité extérieure forte (besoin de contrastes francs).
- **Géolocalisation adaptative & adresses hybrides** : au Gabon, une adresse combine des découpages administratifs (*Province → Département → Arrondissement → Quartier*) et des repères urbains (*« Carrefour SNI », « Bord de mer », « Louis »*). Le rayon de recherche s'adapte dynamiquement de **2 km à 50 km**.
- **Monnaie & tarification** : montants en **FCFA (XAF)** sans décimales (ex. `15 000 FCFA`), avec mention *« Sur devis »* pour les prestations de service.
- **Culture conversationnelle** : l'acte d'achat passe presque toujours par un contact direct (messagerie interne ou bascule **WhatsApp** / appel téléphonique).
- **Double casquette Utilisateur / Commerçant** : un même utilisateur est à la fois client au quotidien et gérant d'un ou plusieurs commerces (bascule fluide entre **Mode Consommateur** et **Mode Business**).

---

## 2. DIAGNOSTIC CRITIQUE DU DESIGN ACTUEL (POURQUOI IL Faut TOUT REFAIRE)

L'audit du code CSS/UI actuel (`src/index.css`, `tailwind.config.ts` et composants) révèle **7 problèmes majeurs** que la refonte doit éliminer :

1. **Usage littéral et criard des couleurs du drapeau gabonais** :
   - Le système actuel juxtapose sans nuance le vert `#009e60`, le jaune `#fcd116` (`#ffd014` en fond de bannière dans `HomePage.tsx`) et le bleu `#3a75c4`, en plus de dégradés multicolores sur les boutons de catégories (`from-orange-500 to-red-600`, `from-pink-500 to-rose-600`, etc.).
   - **Résultat :** cacophonie chromatique, absence de hiérarchie visuelle, aspect « amateur / administratif » au lieu d'une application tech moderne.
2. **Trois systèmes de design contradictoires empilés** :
   - Des tokens *Material Design 3* (`text-display-large`, `text-headline-medium`, police `Roboto` + `Lalezar`), des tokens *MIMO Chat* (`mimo-green`, `mimo-incoming`, `rounded-bubble`), et des composants *Shadcn/UI* par défaut se mélangent sur les mêmes écrans.
3. **Surcharge de l'écran d'accueil (`HomePage.tsx`)** :
   - Empilement vertical sans respiration : bannière d'alerte GPS + barre de recherche + carrousel de Stories + pilules de catégories colorées + bannière jaune vif « Catalogues publics » + carrousel publicitaire + cartes d'entreprises géantes avec logo circulaire de `128×128px` (`w-32 h-32`) qui déforment la grille mobile.
4. **Incohérence de la navigation** :
   - Certaines pages ont le `Header` + `BottomNavigation` (`/consumer/*`), d'autres ont un header custom en dégradé (`/business/:id/settings`), d'autres un header translucide (`/business/:id/profile`), et d'autres une simple flèche retour. L'utilisateur perd ses repères spatiaux.
5. **Bascule Consommateur ↔ Business confuse** :
   - Le changement de rôle (passer de client à gérant d'une de ses entreprises) manque d'une matérialisation visuelle claire (type *Workspace Switcher* moderne).
6. **Règles CSS hostiles à l'expérience utilisateur** :
   - `user-select: none` global sur toute l'application (empêchant de copier une adresse ou un numéro), `.auth-page` en `position: fixed; overflow: hidden; height: 100vh` (bloquant le défilement sur petits écrans lorsque le clavier virtuel s'ouvre), et suppression brutale des transitions d'interface.
7. **Fiches entreprises et catalogues trop chargés** :
   - La fiche entreprise (`BusinessDetailPage.tsx`) mélange les actions publiques (appeler, discuter, itinéraire, favoris) et les outils d'administration du propriétaire (éditer les images, ajouter un catalogue) dans la même vue à 5 onglets.

---

## 3. ARCHITECTURE DES RÔLES & MODES DE NAVIGATION

L'application repose sur un **compte unique** capable d'opérer dans **2 modes** :

| Mode | Cible | Objectif principal | Couleur / Ambiance suggérée |
| :--- | :--- | :--- | :--- |
| **Mode Consommateur** (`/consumer/*`) | Grand public / Client | Explorer, rechercher, comparer les catalogues/produits, localiser sur la carte, contacter les commerces | Interface claire, chaleureuse, éditoriale, orientée découverte |
| **Mode Business / Pro** (`/business/:businessId/*`) | Commerçant / Propriétaire (jusqu'à plusieurs entreprises par compte) | Gérer sa vitrine, publier ses catalogues/produits & stories, répondre aux messages clients, suivre ses statistiques | Interface professionnelle, structurée, dense et orientée productivité |

---

## 4. INVENTAIRE EXHAUSTIF DES ÉCRANS & FONCTIONNALITÉS À DESIGNER

### MODULE A — Onboarding & Authentification

#### Écran A1 : Splash Screen (`/splash`)
- **Rôle :** Écran d'accueil initial de marque.
- **Éléments :** Identité visuelle ConsoGab, proposition de valeur courte (*« Achetons, vendons et consommons 100 % Gaboma »*), CTA principal **« Commencer »**.

#### Écran A2 : Portail d'Authentification (`/auth` — étape `welcome` & `login`)
- **Rôle :** Point d'entrée de connexion.
- **Éléments :**
  - Choix entre **« Se connecter »**, **« Créer un compte »**, et **« Se connecter sans authentification »** (mode Invité / Exploration immédiate).
  - Formulaire de connexion : Email, Mot de passe (avec affichage/masquage), lien *Mot de passe oublié* (`/reset-password`), connexion sociale (Google / GitHub).

#### Écran A3 : Inscription Guidée en 3 étapes (`GuidedSignupFlow`)
- **Barre de progression** (Étape 1/3 → 3/3) :
  1. **Informations de base :** Choix du profil initial (*Consommateur* ou *Commerçant*), Pseudo, Prénom, Nom.
  2. **Contact & Sécurité :** Email, Téléphone (+241), Mot de passe.
  3. **Localisation au Gabon (`LocationStep`) :** Détection GPS en un clic **ou** sélection hiérarchique : *Province → Département → Arrondissement → Quartier → Adresse / Point de repère*.

---

### MODULE B — Espace Consommateur (Shell principal avec Header + Bottom Navigation)

#### Composants transverses du Shell Consommateur
- **Header supérieur (`Header.tsx`) :**
  - Logo / Titre de la vue courante.
  - **Sélecteur de localisation actif** (ex. `📍 Libreville` — cliquable pour ouvrir la carte ou changer de zone).
  - **Bouton Scanner QR Code** (accès rapide au scanner de commerce/catalogue).
  - **Bouton Messagerie** avec badge de messages non lus.
  - **Indicateur / Switcher de Mode** (Consommateur ↔ Entreprise active).
- **Barre de navigation inférieure (`BottomNavigation.tsx`) — 4 onglets principaux :**
  1. **Accueil** (`/consumer/home`)
  2. **Carte** (`/consumer/map`)
  3. **Classement / Tendances** (`/consumer/rankings`)
  4. **Profil** (`/consumer/profile`)

---

#### Écran B1 : Accueil Consommateur (`/consumer/home` — `HomePage.tsx`)
C'est l'écran le plus stratégique de l'application. Il contient 7 blocs fonctionnels qu'il faut hiérarchiser avec élégance :
1. **Bannière contextuelle de géolocalisation** (uniquement si le GPS est désactivé) : invite discrète à activer la position pour trier les commerces par distance réelle.
2. **Barre de recherche unifiée (`UnifiedSearchBar`)** :
   - Recherche instantanée multi-entités : **Entreprises**, **Catalogues**, **Produits**.
   - Filtres rapides par type de résultat et affichage d'un panneau de suggestions/résultats enrichis (miniature, catégorie, prix ou distance).
3. **Carrousel des Stories / Annonces du jour (`StoriesCarousel` — 24h)** :
   - Format inspiré d'Instagram/WhatsApp Status : bulles ou cartes verticales présentant les promotions éphémères, arrivages du jour ou plats du jour publiés par les commerces.
   - Visionneuse plein écran au clic avec barre de progression, texte, image/vidéo et bouton **« Voir le commerce »**.
4. **Explorateur de Catégories (`businessCategories.ts` — 15 catégories officielles)** :
   - *Restaurant & Hôtellerie, Commerce & Distribution, Services de proximité, Technologie & Numérique, Santé & Bien-être, Éducation & Formation, Finance & Banque, Immobilier & BTP, Automobile & Transport, Beauté & Coiffure, Sport & Fitness, Culture & Loisirs, Agriculture & Pêche, Artisanat & Production, Autre.*
   - **Note aux designers :** Remplacer les gros pavés à dégradés criards par une iconographie sur-mesure cohérente et sobre.
5. **Accès aux Catalogues Publics** :
   - Section ou bandeau éditorial menant à la bibliothèque de tous les catalogues (`/catalogs`).
6. **Carrousel Partenaires / Mises en avant (`AdCarousel`)** :
   - Bannière promotionnelle native et élégante (non intrusive) pour les entreprises sponsorisées de la ville de l'utilisateur.
7. **Flux des « Entreprises actives à proximité » (`InteractiveBusinessCard`)** :
   - Cartes commerces présentant : Photo de couverture / carrousel d'images, Logo, Nom du commerce, Badge **Vérifié**, Catégorie, Note moyenne (`★ 4.7`), Distance (`1.2 km`), Statut d'ouverture, Adresse/Quartier, et 3 actions rapides : **Catalogue**, **Message**, **Appeler / WhatsApp**.
- **Modale Scanner QR (`QRScanner`) :** accessible depuis l'accueil pour scanner le QR code d'une boutique physique et ouvrir sa fiche instantanément.

---

#### Écran B2 : Carte Interactive & Exploration Géographique (`/consumer/map` — `MapPage.tsx`)
- **Double vue ou Bottom Sheet glissant :**
  1. **Vue Carte plein écran (MapLibre GL)** :
     - Marqueurs personnalisés par catégorie de commerce et statut (ouvert/vérifié).
     - Marqueur de la position de l'utilisateur + contrôle de recentrage GPS.
     - Recherche dans la zone affichée (`fetchBusinessesInBounds`).
     - Aperçu rapide (mini-carte en bas d'écran) au clic sur un marqueur, avec bouton vers la fiche complète (`/business/:id`).
  2. **Vue Liste des commerces à proximité (`CommerceListTab`)** :
     - Tri par distance, filtre par catégorie et par statut « Ouvert maintenant ».

---

#### Écran B3 : Page Catégorie (`/category/:categoryId` — `CategoryPage.tsx`)
- **Rôle :** Lister tous les commerces appartenant à l'une des 15 catégories.
- **Éléments :**
  - En-tête de catégorie avec filtres (sous-catégories, tri par proximité ou note, recherche locale).
  - Grille ou liste de cartes commerces avec distance calculée en temps réel.

---

#### Écran B4 : Explorateur des Catalogues Publics (`/catalogs` — `PublicCatalogsPage.tsx`)
- **Rôle :** Permettre aux consommateurs de feuilleter les catalogues de produits et grilles tarifaires de tous les commerces du Gabon.
- **Éléments :**
  - Barre de recherche (par titre de catalogue, catégorie ou nom d'entreprise).
  - Filtres rapides : **Tous**, **En vedette**, **Promotions**.
  - Grille de cartes catalogues : Image de couverture, Badge promotion (`-20%`), Badge « En vedette », Titre du catalogue, Catégorie,Prix ou fourchette de prix en FCFA, Type (*Produits* ou *Services*), Nom + Logo du commerce émetteur et Ville.

---

#### Écran B5 : Fiche Publique d'une Entreprise (`/business/:businessId` — `BusinessDetailPage.tsx`)
- **Hero / En-tête de vitrine :**
  - Carrousel ou photo de couverture grand format, Logo de l'entreprise, Nom, Badge Vérifié, Catégorie, Note & nombre d'avis, Distance (`km`) et Ville/Quartier.
  - **Barre d'actions primaires :**
    1. **Message** (ouvre une conversation directe dans ConsoGab)
    2. **WhatsApp / Appeler**
    3. **Itinéraire / Carte**
    4. **Favoris (Cœur)** & **Partager**
- **Navigation par onglets sur la fiche commerce :**
  1. **Catalogues & Produits :** Grille des catalogues publiés par ce commerce et leurs articles.
  2. **À propos / Informations :** Description complète, horaires d'ouverture jour par jour, adresse précise, téléphone, email, site web, localisation sur mini-carte.
  3. **Annonces / Stories :** Stories actives de l'entreprise.
  4. **Avis clients :** Note globale, distribution des étoiles et liste des commentaires clients.
  *(Note UX : l'onglet « Pro » actuellement présent sur cette page pour le propriétaire doit être séparé proprement dans un bouton flottant ou une barre d'administration « Gérer mon commerce » afin de ne pas polluer la vue publique).*

---

#### Écran B6 : Fiche Détail Produit / Service (`/product/:productId` — `ProductDetailPage.tsx`)
- **Éléments :**
  - Galerie photos du produit (image principale + vignettes).
  - Fil d'ariane / Catégorie + Badge de disponibilité (*En stock*, *Sur commande*).
  - Titre du produit, Note & avis, Prix en **FCFA** (et prix barré si promotion).
  - Sélecteur de quantité + bouton **« Ajouter au panier »** (persisté) + bouton Favori / Partage.
  - **Carte du Vendeur** : Logo, nom du commerce, ville, bouton **« Voir la boutique »** (`/business/:id`), bouton **« Contacter le vendeur »** (chat) et **« Où trouver ? »** (localisation).
  - Onglets d'informations : **Description détaillée**, **Caractéristiques**, **Avis**.

---

#### Écran B7 : Classements & Tendances (`/consumer/rankings` — `RankingsPage.tsx`)
- **Rôle :** Mettre en avant les commerces et produits les mieux notés et les plus populaires du Gabon.
- **Éléments :**
  - Filtres par période (*Cette semaine*, *Ce mois*, *Toujours*) et par catégorie.
  - Podium visuel (Top 1, 2, 3) + liste classée avec évolution, note moyenne, nombre d'avis et accès direct à la fiche.

---

#### Écran B8 : Profil Consommateur (`/consumer/profile` — `ProfilePage.tsx`)
- **En-tête profil :** Avatar, Nom/Pseudo, Email/Téléphone, localisation enregistrée, badge de rôle.
- **Bascule vers le Mode Business / Gestion des Entreprises** :
  - Section dédiée permettant de basculer en un clic sur l'une de ses entreprises ou d'en créer une nouvelle (`/entreprises`).
- **Sections du profil :**
  - **Mes Favoris (`FavoritesSection`)** : commerces, catalogues et produits sauvegardés.
  - **Mes Informations personnelles & Localisation** : édition du profil et du quartier de référence.
  - **Paramètres de l'application** : thème Clair / Sombre, notifications, sécurité, déconnexion.

---

### MODULE C — Messagerie Unifiée B2C / B2B (`/messaging` & `/messaging/:conversationId`)

La messagerie (`ChatLayout.tsx`) fonctionne à la fois pour le **Consommateur** (qui écrit à plusieurs boutiques) et pour le **Commerçant** (qui répond à ses clients depuis son profil Business) :
- **Vue Liste des conversations :**
  - Recherche de conversation, filtre Non lus / Archivés.
  - Entrée de liste : Avatar du commerce ou du client, Nom, aperçu du dernier message, horodatage relatif, compteur de messages non lus.
- **Vue Conversation active :**
  - En-tête : interlocuteur, statut, bouton d'accès à la fiche commerce ou d'appel.
  - Fil de messages : bulles entrantes/sortantes, support des **pièces jointes images**, **messages vocaux (`VoiceRecorder`)**, et partage de fiches produits/catalogues.
  - Zone de saisie : champ texte extensible, bouton photo/fichier, bouton mémo vocal, bouton d'envoi.

---

### MODULE D — Espace Commerçant / Mode Business

#### Écran D1 : Portail « Mes Entreprises » (`/entreprises` — `EntreprisesPage.tsx`)
- **Rôle :** Hub de gestion multi-entreprises d'un utilisateur.
- **Éléments :**
  - Liste des entreprises possédées par l'utilisateur (avec statut *Actif*, *Vérifié*, catégorie, ville, et indicateur « Entreprise actuellement active »).
  - Actions par entreprise : **« Activer & Gérer »** (bascule en Mode Business vers `/business/:id/profile`), **« Voir la fiche publique »** (`/business/:id`).
  - CTA principal : **« Créer une nouvelle entreprise »** (`/entreprises/create`).

#### Écran D2 : Assistant de Création d'Entreprise (`/entreprises/create` — `NewBusinessCreationWizard.tsx`)
- **Parcours guidé en 3 étapes (`StepIndicator`) :**
  1. **Informations de base (`StepBasicInfo`)** : Nom de l'entreprise, sélection de la catégorie parmi les 15 secteurs, description de l'activité.
  2. **Localisation (`StepLocation`)** : Province, Département, Arrondissement, Quartier, Adresse précise et positionnement GPS sur la carte.
  3. **Contacts & Réseaux (`StepContact`)** : Téléphone, numéro WhatsApp dédié, Email professionnel, Site web.

#### Écran D3 : Tableau de Bord & Gestion d'Entreprise (`/business/:businessId/profile` & `/dashboard`)
- **En-tête Pro :** Nom de l'entreprise active, badge de mode Business, bouton **« Paramètres Pro »** (`/business/:id/settings`), bouton de retour vers la liste des entreprises.
- **3 Onglets de gestion quotidienne :**
  1. **Mes Catalogues & Inventaire (`CatalogInventoryIntegration`)** :
     - Liste des catalogues de l'entreprise (publiés / brouillons / en promotion).
     - Bouton **« Créer un catalogue »** (`/business/:id/catalogues` — formulaire de création de catalogue avec couverture, catégorie, type Produit/Service, remise promotionnelle, et ajout d'articles avec photos et prix en FCFA).
     - Publication de **Stories 24h** (`CreateStoryModal`).
  2. **Messagerie Clients (`BusinessChatLoader`)** :
     - Boîte de réception dédiée aux messages des clients pour cette entreprise spécifique.
  3. **Tableau de Bord Pro / Statistiques** :
     - Indicateurs clés (vues de la fiche, clics WhatsApp, consultations de catalogues, messages reçus) — *actuellement à l'état d'ébauche dans le code, à concevoir pleinement dans la maquette Figma*.

#### Écran D4 : Paramètres Propriétaire / « Onglet Pro » (`/business/:businessId/settings` — `BusinessSettingsPage.tsx`)
- **Rôle :** Édition avancée et sécurisée de l'entreprise.
- **Éléments :**
  - Éditeur complet du profil entreprise (`BusinessProfileEditor` : logo, image de couverture, coordonnées, horaires d'ouverture).
  - Gestionnaire des photos du carrousel de vitrine (`CarouselImagesManager`).
  - Gestion de la visibilité (entreprise active / en pause) et suppression sécurisée.

---

## 5. DIRECTIVES ARTISTIQUES & RECOMMANDATIONS POUR LES DESIGNERS

### 5.1. Nouvelle Direction Artistique recommandée
- **Sortir du « piège du drapeau littéral »** :
  - Ne plus jamais utiliser simultanément le vert, le jaune et le bleu saturés en aplats sur un même écran.
  - S'inspirer de la richesse naturelle et urbaine du Gabon avec une **palette contemporaine, chaleureuse et haut de gamme** :
    - **Couleur Primaire (Marque & Confiance)** : un **Vert Émeraude / Forêt profonde** sophistiqué (ex. `#065F46` → `#059669`) évoquant la vitalité et l'ancrage local, ou un **Bleu Nuit / Océan profond** très lisible.
    - **Couleur d'Accent (Énergie & Conversion)** : un **Ambre / Or chaud** maîtrisé (ex. `#D97706` / `#F59E0B`) utilisé avec parcimonie (badges vérifiés, étoiles, promotions), jamais en fond de texte blanc illisible.
    - **Surfaces & Neutres** : fonds très doux blanc cassé / pierre chaude (`#F8FAFC` ou `#FAF9F6`) en mode clair, et ardoise profonde (`#0B0F17`) en mode sombre, avec des bordures subtiles (`1px solid`).
- **Typographie moderne et lisible** :
  - Remplacer `Roboto` + `Lalezar` par un duo contemporain à forte lisibilité mobile :
    - **Titres / Display :** *Plus Jakarta Sans*, *Outfit* ou *Cabinet Grotesk* (chaleureux, géométrique, moderne).
    - **Corps & UI :** *Inter* ou *DM Sans* avec `tabular-nums` obligatoire pour tous les prix en **FCFA**, distances en **km** et notes.

### 5.2. Principes UX/UI stricts à respecter dans les maquettes Figma
1. **Un seul système de cartes unifié** :
   - Abandonner les cartes commerces à logo géant circulaire de `128px`. Créer une **Carte Commerce Standard** (format horizontal compact en liste, format vertical visuel en découverte) avec : ratio photo `16:9` ou `4:3`, logo `40×40px` superposé en coin, titre sur 1 ligne, badge catégorie + distance + note sur une ligne secondaire, et actions claires.
2. **Séparation franche entre Mode Consommateur et Mode Business** :
   - En **Mode Consommateur**, la barre de navigation basse comporte : *Accueil, Carte, Catalogues, Messages, Profil*.
   - En **Mode Business**, l'interface adopte un en-tête distinctif (ex. barre supérieure sombre ou émeraude avec sélecteur d'entreprise) et une navigation dédiée au commerçant : *Aperçu/Stats, Catalogues & Stories, Messages Clients, Ma Boutique*.
3. **Ergonomie Mobile & Accessibilité (WCAG 2.2 AA)** :
   - Zones tactiles minimales de `44×44px` sur tous les boutons et icônes.
   - Contraste minimal de `4.5:1` sur les textes (attention particulière aux badges jaunes/or qui doivent toujours avoir un texte sombre).
   - Tous les écrans d'authentification et formulaires doivent être **scrollables** lorsque le clavier virtuel est ouvert.

---

## 6. LIVRABLES ATTENDUS DE L'ÉQUIPE DESIGN (FIGMA)

1. **Design System complet (Tokens & Foundations)** :
   - Palette Light & Dark mode, échelle typographique, grille d'espacement (`4px`/`8px`), rayons de bordure, élévations, système d'icônes unifié (notamment pour les 15 catégories d'entreprises).
2. **Bibliothèque de Composants (UI Kit)** :
   - `AppHeader` (Consommateur vs Business), `BottomNavigation`, `UnifiedSearchBar` (états repos, focus, filtres, résultats), `StoryBubble` & `StoryViewer`, `CategoryChip`, `BusinessCard` (compacte, étendue, aperçu carte), `CatalogCard`, `ProductCard`, `ChatBubble` (texte, image, audio, produit).
3. **Écrans Haute-Fidélité (Mobile 390×844 & Desktop 1440×900)** couvrant les **4 Modules (A, B, C, D)** détaillés ci-dessus, incluant systématiquement :
   - Les **états vides** (*Empty states* : aucun commerce dans le rayon, panier vide, aucune conversation),
   - Les **états de chargement** (*Skeletons* cohérents avec les vraies cartes),
   - Les **états d'erreur / hors-ligne** (réseau faible ou GPS désactivé).
