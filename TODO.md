# TODO - UI “Utilisateur” (Produits) + amélioration design

- [x] Confirmer le style actuel et modifier `frontend/src/styles/custom.css` pour une UI plus moderne (cards, background, badges, spacing).

- [x] Adapter la page `frontend/src/pages/ProductsPage.js` pour un mode **utilisateur** :

  - [x] Masquer formulaires (ProductForm, StockMovementForm) et boutons Modifier/Supprimer si `user.role` correspond à utilisateur.
  - [x] Afficher une grille de cards produits plus belle avec prix si disponible (`prix`).

  - [x] Ajouter recherche + tri (nom/stock/prix) côté client.

- [ ] Mettre en place un petit composant optionnel (si nécessaire) pour card produit (sinon intégré dans ProductsPage).
- [ ] Vérifier que l’UI admin reste inchangée (ProductsPage actuelle).
- [ ] Tester : lancer frontend, vérifier navigation `/produits` avec rôle utilisateur et admin.

