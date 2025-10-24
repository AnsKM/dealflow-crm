# DealFlow - Schnellstart-Anleitung

## 🚀 In 5 Minuten loslegen

### Schritt 1: Services starten

```bash
cd /Users/anskhalid/CascadeProjects/CRM_software_MVP/technical
docker-compose up -d
```

**Warten Sie ~30 Sekunden**, bis alle Services healthy sind:

```bash
docker-compose ps
```

Sie sollten sehen:
```
NAME                   STATUS
dealflow_backend       Up (healthy)
dealflow_db            Up (healthy)
dealflow_frontend      Up
```

### Schritt 2: Demo-Daten laden

```bash
docker-compose exec backend python seed_data.py
```

**Ausgabe:**
```
🌱 Seeding Demo-Daten...
✅ Tenant erstellt: Demo Vertrieb GmbH
✅ User erstellt: demo@dealflow.de (Passwort: demo123)
✅ Deal erstellt: CRM-Software für Vertriebsteam (TechStart GmbH)
...
🎉 Demo-Daten erfolgreich erstellt!
```

### Schritt 3: Anwendung öffnen

**Browser öffnen:** http://localhost:5173

**Login:**
- **E-Mail:** `demo@dealflow.de`
- **Passwort:** `demo123`

### Schritt 4: DealFlow ausprobieren

1. **Dashboard:** Sie sehen 6 Demo-Deals mit verschiedenen Stages
2. **Deal öffnen:** Klicken Sie auf einen Deal → AI-Empfehlungen werden angezeigt
3. **Neuer Deal:** Button "Neuer Deal" → Formular ausfüllen → Deal wird erstellt
4. **Aktivität hinzufügen:** Auf Detail-Seite → "Aktivität hinzufügen" → Timeline wird aktualisiert
5. **Stage ändern:** Dropdown "Stage" ändern → Health Score aktualisiert sich

---

## 🛠️ Entwicklung

### Backend-Tests ausführen

```bash
docker-compose exec backend pytest
```

Oder lokal:
```bash
cd backend
source venv/bin/activate
pytest -v
```

### Logs ansehen

```bash
# Alle Logs
docker-compose logs -f

# Nur Backend
docker-compose logs -f backend

# Nur Frontend
docker-compose logs -f frontend
```

### API-Dokumentation

**Swagger UI:** http://localhost:8000/docs

Hier können Sie alle API-Endpoints testen:
1. POST `/api/auth/register` → Neuen User erstellen
2. POST `/api/auth/login` → Token erhalten
3. "Authorize" Button → Token eingeben
4. Jetzt können Sie geschützte Endpoints testen

---

## 🧹 Aufräumen

### Services stoppen

```bash
docker-compose down
```

### Inkl. Datenbank löschen

```bash
docker-compose down -v
```

---

## ❓ Probleme?

### Port bereits belegt

Wenn Port 5173, 8000 oder 5432 bereits verwendet wird:

```bash
# In docker-compose.yml ändern:
# Frontend: "5174:5173"
# Backend: "8001:8000"
# PostgreSQL: "5433:5432"
```

### Services starten nicht

```bash
# Container neu bauen
docker-compose build --no-cache
docker-compose up -d
```

### Gemini API Fehler

Falls AI-Empfehlungen nicht funktionieren:
- API-Key in `backend/.env` prüfen
- Fallback-Empfehlungen werden automatisch verwendet

---

## 📚 Nächste Schritte

1. **README.md lesen:** Vollständige Dokumentation mit Architektur, Trade-offs, etc.
2. **Code erkunden:** Backend in `backend/app/`, Frontend in `frontend/src/`
3. **Tests schreiben:** `backend/tests/` und `frontend/src/__tests__/`
4. **Deployen:** Render, Railway, oder AWS

Viel Erfolg! 🚀
