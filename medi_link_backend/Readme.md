# Anime App Backend

## Description

The **Anime App Backend** is a Node.js-based RESTful API designed to support a full-featured anime streaming and management platform. This backend provides endpoints for managing users, anime catalog, genres, reviews, and episodes. It includes robust user authentication and role-based access control (RBAC), allowing superadmins and admins to manage the platform effectively.

---

## Features

- **User Management**:

  - User registration, login, and authentication.
  - Role-based access control: `user`, `admin`, and `superadmin`.
  - Watchlist management for users.

- **Anime Catalog**:

  - Add, update, delete, and view anime.
  - Associate anime with genres and episodes.
  - Average ratings calculated from user reviews.

- **Genres**:

  - Categorize anime by genre (e.g., Action, Comedy, Drama).

- **Episodes**:

  - Manage individual anime episodes with details like title, description, duration, and release date.

- **Reviews and Ratings**:

  - Users can leave ratings and comments on anime.

- **Role-Based Access**:
  - Only admins/superadmins can add or modify anime, genres, or episodes.

---
