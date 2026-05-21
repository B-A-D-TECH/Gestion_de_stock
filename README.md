# Gestion de Stock

Application de gestion de stock pour PME avec backend Node.js/Express et frontend React/Bootstrap.

## Installation

1. Positionne-toi à la racine du projet :
   ```powershell
   cd C:\Users\Fatoumata\Desktop\CoursMiage2\Git\Gestion_de_stock
   ```
2. Installe toutes les dépendances :
   ```powershell
   npm install
   ```

## Démarrage

- Backend :
  ```powershell
  npm run start:backend
  ```

- Frontend :
  ```powershell
  npm run start:frontend
  ```

## Base de données

- Exécute `schema.sql` dans MySQL pour créer la base `gestion_stock`.
- Configure `backend/.env` avec tes identifiants MySQL.

## Structure

- `backend/` : API Express, routes, controllers, modèles, middlewares
- `frontend/` : application React avec Bootstrap
- `schema.sql` : création des tables MySQL
