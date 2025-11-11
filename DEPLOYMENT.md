# Deployment auf GitHub Pages

Dieses Spiel kann im Browser über GitHub Pages gespielt werden, dank **Pygbag** (Pygame zu WebAssembly).

## Schritt 1: Build für Browser

```bash
# Install pygbag (falls noch nicht installiert)
pip install pygbag

# Build das Spiel für den Browser
pygbag snake_game.py
```

Dies erstellt einen `build/web` Ordner mit allen nötigen Dateien.

## Schritt 2: GitHub Repository Setup

1. **Erstelle ein GitHub Repository** (falls noch nicht vorhanden):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Snake game with ctrl QS branding"
   git branch -M main
   git remote add origin https://github.com/DEIN_USERNAME/snake.git
   git push -u origin main
   ```

2. **Erstelle einen `gh-pages` Branch mit dem Build**:
   ```bash
   # Build das Spiel
   pygbag snake_game.py
   
   # Wechsel zum gh-pages Branch (erstellt ihn wenn nötig)
   git checkout -b gh-pages
   
   # Kopiere Build-Dateien ins Root
   cp -r build/web/* .
   
   # Commit und push
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages
   ```

## Schritt 3: GitHub Pages aktivieren

1. Gehe zu deinem Repository auf GitHub
2. **Settings** → **Pages**
3. Wähle **Source**: `gh-pages` branch
4. Wähle **Folder**: `/ (root)`
5. Klicke **Save**

Nach wenigen Minuten ist das Spiel verfügbar unter:
```
https://DEIN_USERNAME.github.io/snake/
```

## Alternative: Automatisches Deployment mit GitHub Actions

Erstelle `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: |
          pip install pygbag
      
      - name: Build with pygbag
        run: |
          pygbag snake_game.py
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build/web
```

Mit GitHub Actions deployed das Spiel automatisch bei jedem Push auf `main`.

## Updates deployen

Bei Änderungen am Spiel:

```bash
# Auf main branch entwickeln
git checkout main
# ... Änderungen machen ...
git commit -am "Update game"
git push

# Build und deploy
pygbag snake_game.py
git checkout gh-pages
cp -r build/web/* .
git add .
git commit -m "Update deployment"
git push origin gh-pages
```

Oder mit GitHub Actions: einfach auf `main` pushen, der Rest passiert automatisch!

## Lokales Testen

Vor dem Deployment lokal testen:

```bash
# Build
pygbag snake_game.py

# Test im Browser
# Öffne build/web/index.html in Chrome/Firefox
# Oder starte einen lokalen Server:
cd build/web
python -m http.server 8000
# Öffne http://localhost:8000
```

## Fehlerbehebung

**Problem**: Spiel lädt nicht im Browser
- **Lösung**: Prüfe Browser-Konsole (F12) auf Fehler
- Stelle sicher, dass `await asyncio.sleep(0)` in der Game Loop ist

**Problem**: GitHub Pages zeigt 404
- **Lösung**: Warte 5-10 Minuten nach dem ersten Deploy
- Prüfe ob `gh-pages` branch existiert und `index.html` enthält

**Problem**: Spiel läuft lokal, aber nicht im Browser
- **Lösung**: Async-Loop korrekt implementiert? (`async def run()`)
- Keine blocking Operations verwenden
