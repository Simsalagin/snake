import pygame
import random
import sys
import asyncio
from enum import Enum

# Initialize pygame
pygame.init()

# Constants
WINDOW_WIDTH = 640
WINDOW_HEIGHT = 480
GRID_SIZE = 20
GRID_WIDTH = WINDOW_WIDTH // GRID_SIZE
GRID_HEIGHT = WINDOW_HEIGHT // GRID_SIZE

# Colors - ctrl-qs Branding
DEEP_PURPLE = (42, 2, 41)        # #2A0229 - Background
PRIMARY_YELLOW = (203, 248, 49)   # #CBF831 - Snake, accents
LIGHT_BLUE = (205, 228, 246)      # #CDE4F6 - Food, secondary text
WHITE = (255, 255, 255)           # #FFF - Primary text
YELLOW_DARK = (163, 198, 39)      # Darker yellow for snake body

# Game settings
FPS = 10


class Direction(Enum):
    UP = (0, -1)
    DOWN = (0, 1)
    LEFT = (-1, 0)
    RIGHT = (1, 0)


class Snake:
    def __init__(self):
        # Start in the middle with 3 segments
        start_x = GRID_WIDTH // 2
        start_y = GRID_HEIGHT // 2
        self.body = [
            (start_x, start_y),
            (start_x - 1, start_y),
            (start_x - 2, start_y)
        ]
        self.direction = Direction.RIGHT
        self.grow_pending = False

    def move(self):
        head_x, head_y = self.body[0]
        dx, dy = self.direction.value
        new_head = (head_x + dx, head_y + dy)

        self.body.insert(0, new_head)

        if not self.grow_pending:
            self.body.pop()
        else:
            self.grow_pending = False

    def grow(self):
        self.grow_pending = True

    def change_direction(self, new_direction):
        # Prevent reversing into itself
        opposite = {
            Direction.UP: Direction.DOWN,
            Direction.DOWN: Direction.UP,
            Direction.LEFT: Direction.RIGHT,
            Direction.RIGHT: Direction.LEFT
        }
        if new_direction != opposite[self.direction]:
            self.direction = new_direction

    def check_collision(self):
        head_x, head_y = self.body[0]

        # Wall collision
        if head_x < 0 or head_x >= GRID_WIDTH or head_y < 0 or head_y >= GRID_HEIGHT:
            return True

        # Self collision
        if self.body[0] in self.body[1:]:
            return True

        return False

    def draw(self, surface):
        for i, (x, y) in enumerate(self.body):
            color = PRIMARY_YELLOW if i == 0 else YELLOW_DARK
            rect = pygame.Rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
            # Rounded corners for modern aesthetic
            pygame.draw.rect(surface, color, rect, border_radius=6)
            # Subtle shadow effect
            pygame.draw.rect(surface, DEEP_PURPLE, rect, 2, border_radius=6)


class Food:
    def __init__(self, snake_body):
        self.position = self.spawn(snake_body)

    def spawn(self, snake_body):
        while True:
            x = random.randint(0, GRID_WIDTH - 1)
            y = random.randint(0, GRID_HEIGHT - 1)
            if (x, y) not in snake_body:
                return (x, y)

    def draw(self, surface):
        x, y = self.position
        rect = pygame.Rect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        # Rounded food with ctrl-qs light blue
        pygame.draw.rect(surface, LIGHT_BLUE, rect, border_radius=8)
        pygame.draw.rect(surface, WHITE, rect, 2, border_radius=8)


class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption("Snake Game - ctrl QS")
        self.clock = pygame.time.Clock()
        # Use pygame default font (browser-compatible)
        self.font = pygame.font.Font(None, 36)
        self.font_small = pygame.font.Font(None, 24)
        self.reset()

    def reset(self):
        self.snake = Snake()
        self.food = Food(self.snake.body)
        self.score = 0
        self.game_over = False

    def handle_input(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return False

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    return False

                if self.game_over and event.key == pygame.K_SPACE:
                    self.reset()

                if not self.game_over:
                    if event.key in (pygame.K_UP, pygame.K_w):
                        self.snake.change_direction(Direction.UP)
                    elif event.key in (pygame.K_DOWN, pygame.K_s):
                        self.snake.change_direction(Direction.DOWN)
                    elif event.key in (pygame.K_LEFT, pygame.K_a):
                        self.snake.change_direction(Direction.LEFT)
                    elif event.key in (pygame.K_RIGHT, pygame.K_d):
                        self.snake.change_direction(Direction.RIGHT)

        return True

    def update(self):
        if not self.game_over:
            self.snake.move()

            # Check food collision
            if self.snake.body[0] == self.food.position:
                self.snake.grow()
                self.score += 10
                self.food = Food(self.snake.body)

            # Check game over
            if self.snake.check_collision():
                self.game_over = True

    def draw(self):
        # ctrl-qs deep purple background
        self.screen.fill(DEEP_PURPLE)

        if not self.game_over:
            self.snake.draw(self.screen)
            self.food.draw(self.screen)

            # Draw score with ctrl-qs branding
            score_text = self.font.render(f"Score: {self.score}", True, PRIMARY_YELLOW)
            self.screen.blit(score_text, (10, 10))
        else:
            # Game over screen with ctrl-qs colors
            game_over_text = self.font.render("GAME OVER", True, PRIMARY_YELLOW)
            score_text = self.font.render(f"Final Score: {self.score}", True, WHITE)
            restart_text = self.font_small.render("Press SPACE to restart", True, LIGHT_BLUE)

            self.screen.blit(game_over_text,
                           (WINDOW_WIDTH // 2 - game_over_text.get_width() // 2,
                            WINDOW_HEIGHT // 2 - 60))
            self.screen.blit(score_text,
                           (WINDOW_WIDTH // 2 - score_text.get_width() // 2,
                            WINDOW_HEIGHT // 2))
            self.screen.blit(restart_text,
                           (WINDOW_WIDTH // 2 - restart_text.get_width() // 2,
                            WINDOW_HEIGHT // 2 + 60))

        pygame.display.flip()

    async def run(self):
        running = True
        while running:
            running = self.handle_input()
            self.update()
            self.draw()
            self.clock.tick(FPS)

            # Yield control to browser (essential for pygbag)
            await asyncio.sleep(0)

        pygame.quit()


if __name__ == "__main__":
    game = Game()
    asyncio.run(game.run())
