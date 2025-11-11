# Classic Snake Game - ctrl QS Edition

A Python implementation of the classic snake game using pygame, styled with [ctrl-qs.com](https://ctrl-qs.com) branding.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the game:
```bash
python snake_game.py
```

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

## Requirements

- Python 3.7+
- pygame 2.5.2
