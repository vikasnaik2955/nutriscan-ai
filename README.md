# NutriScan AI — Smart Food Health Analyzer

Scan a packaged food's barcode or nutrition label, get a 0–10 health score with plain-language
reasons, and track your choices over time. Built for the Indian market.

> **Status:** the React Native app is fully built across all screens and currently runs against
> an in-app **mock backend** (toggle `MOCK_AUTH`). The Spring Boot backend is scaffolded
> (entities, repositories, MySQL config, error envelope) with auth and scan/score endpoints in
> progress. Flip `EXPO_PUBLIC_MOCK_AUTH=false` to point the app at the real API once it's live.

## Monorepo layout

```
.
├── app/        Expo + React Native + TypeScript mobile app (Expo Router, TanStack Query, Zustand)
├── backend/    Spring Boot REST API (Spring Data JPA, MySQL) — JWT auth + scan/score (WIP)
├── design/     Design tokens + reference (palette, type, spacing) the app's theme is built from
└── docker-compose.yml   Local MySQL for the backend
```

## Tech stack

- **App:** Expo SDK 55, React Native 0.83, TypeScript, Expo Router, TanStack Query, Zustand,
  expo-camera (barcode), Plus Jakarta Sans, Lucide icons.
- **Backend:** Spring Boot 3.3 (Java 17), Spring Web / Data JPA / Validation, MySQL 8, JWT.
- **External:** Open Food Facts (barcode → nutrition, cached server-side).

## Running the app

```bash
cd app
npm install
npx expo start        # press a (Android) / i (iOS) / w (web)
```
Mock auth is on in dev: any email + an 8-character password signs you in (no backend needed).
Use an email containing "admin" to access the admin module.

## Running the backend

```bash
docker compose up -d          # MySQL on :3306
cd backend
mvn spring-boot:run           # API on :8080  (or run NutriScanApplication in your IDE)
curl http://localhost:8080/api/ping
```

## Health score

0–10, heuristic (not medical advice): **8–10 Healthy · 5–7 Moderate · 0–4 Unhealthy**, with
human-readable reasons. The app ships a preview scorer; the backend engine is the authoritative,
config-driven version.
