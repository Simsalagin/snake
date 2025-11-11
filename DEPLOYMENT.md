# Deployment to GitHub Pages

This game is a pure static web application that runs directly in any modern browser. No build process or dependencies required!

## Option 1: Deploy from Main Branch (Recommended)

**Step 1: Push to GitHub**
```bash
git add .
git commit -m "Snake game - pure web version"
git push origin master
```

**Step 2: Enable GitHub Pages**
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select: `master` branch
4. Select folder: `/ (root)`
5. Click **Save**

Your game will be live at:
```
https://YOUR_USERNAME.github.io/snake/
```

## Option 2: Deploy to a Separate gh-pages Branch

```bash
# Create orphan gh-pages branch
git checkout --orphan gh-pages

# Add only the necessary files
git add index.html styles.css game.js README.md
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Switch back to master
git checkout master
```

Then enable GitHub Pages from the `gh-pages` branch in repository settings.

## Alternative Hosting Options

### Netlify
1. Drag and drop your project folder to [netlify.com/drop](https://app.netlify.com/drop)
2. Done! Your game is live.

### Vercel
```bash
npm i -g vercel
vercel
```

### Any Static Host
Since this is pure HTML/CSS/JS, you can host it on:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- AWS S3
- Or any web server (just upload the files)

## Local Testing

Simply open `index.html` in your browser. No server needed!

If you prefer a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Updating Your Deployment

For GitHub Pages, just push changes:
```bash
git add .
git commit -m "Update game"
git push
```

GitHub Pages automatically redeploys within 1-2 minutes.

## Troubleshooting

**Game not loading?**
- Check browser console (F12) for errors
- Ensure all three files (index.html, styles.css, game.js) are in the same directory
- Try a different browser (Chrome, Firefox, Safari, Edge all supported)

**GitHub Pages shows 404?**
- Wait 2-5 minutes after first deployment
- Verify Settings → Pages shows the correct branch and folder
- Check that `index.html` is in the repository root (or selected folder)

**Controls not working?**
- Click on the game canvas to focus it
- Use arrow keys or WASD to control the snake
