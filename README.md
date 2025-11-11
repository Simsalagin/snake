# Classic Snake Game - ctrl QS Edition

A pure web browser implementation of the classic snake game using vanilla HTML, CSS, and JavaScript, styled with [ctrl-qs.com](https://ctrl-qs.com) branding.

**✨ Play instantly in any modern browser - no installation required!**

## How to Run

**Option 1: Open locally**
Simply open `index.html` in your web browser. No server or installation needed.

**Option 2: Play online**
Visit the GitHub Pages deployment - see [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## How to Play

- **Controls**: Use arrow keys or WASD to move the snake
- **Objective**: Eat the light blue food to grow longer and increase your score
- **Game Over**: Hitting walls or yourself ends the game
- **Restart**: Press SPACE after game over
- **Quit**: Press ESC to exit

## Game Rules

- Snake starts at length 3 in the center
- Each food eaten adds 10 points and grows the snake by 1 segment
- Game runs at 10 FPS
- Grid size: 32x24 (640x480 pixels, 20px per cell)

## Branding

The game features **ctrl QS** brand identity:

- **Color Palette**:
  - Deep Purple (#2A0229) - Background
  - Primary Yellow (#CBF831) - Snake, score, accents
  - Light Blue (#CDE4F6) - Food, secondary text
  - White (#FFF) - Text highlights

- **Design**: Modern rounded corners, clean typography (Nunito), minimalist aesthetic

## Technology Stack

- **HTML5 Canvas** - Game rendering
- **Vanilla JavaScript** - Game logic (no frameworks or dependencies)
- **CSS3** - Styling and layout
- **No build tools required** - Pure client-side implementation

## File Structure

```
/snake/
├── index.html       # Main game page
├── styles.css       # ctrl-qs branding and layout
├── game.js          # Complete game logic
├── README.md        # This file
└── DEPLOYMENT.md    # GitHub Pages deployment guide
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions on deploying to GitHub Pages or any static hosting service.
