# Spanish Scrabble Game - Design Guidelines

## Design Approach

**Hybrid Approach:** Blend classic Scrabble board game aesthetics with modern web interface design. Draw inspiration from premium board game platforms (Chess.com, Board Game Arena) while maintaining the warmth and familiarity of physical Scrabble.

**Key Principle:** Create an educational gaming experience that feels both nostalgic and contemporary, where language learning feels natural and rewarding.

## Core Design Elements

### A. Color Palette

**Light Mode (Primary):**
- Board Base: 25 45% 85% (warm beige, classic Scrabble board color)
- Board Grid Lines: 25 35% 70% (subtle tan borders)
- Premium Tiles: 45 15% 95% (cream-colored letter tiles)
- Tile Text: 25 20% 25% (dark brown for excellent readability)
- Special Squares - Double Letter: 200 75% 85% (soft blue)
- Special Squares - Triple Letter: 210 70% 60% (deep blue)
- Special Squares - Double Word: 350 60% 85% (soft pink)
- Special Squares - Triple Word: 0 70% 60% (vibrant red)
- Primary Action: 150 50% 45% (forest green for "Play Word")
- Background: 30 25% 98% (warm off-white)
- Translation Popup: 0 0% 100% (crisp white with subtle shadow)

**Dark Mode:**
- Board Base: 25 20% 18% (rich dark wood tone)
- Premium Tiles: 40 15% 88% (cream tiles maintain visibility)
- Tile Text: 25 15% 20% (keep dark for contrast on light tiles)
- Background: 25 15% 12% (deep warm dark)
- Translation Popup: 25 12% 15% (elevated dark surface)

### B. Typography

**Primary Font:** Inter (via Google Fonts CDN) - excellent readability for UI
**Display Font:** Merriweather (via Google Fonts CDN) - elegant serif for game title and translations

**Scale:**
- Game Title: text-4xl font-bold (Merriweather)
- Tile Letters: text-2xl font-bold (Inter, uppercase)
- Tile Points: text-xs (Inter, subscript style)
- Translation Header: text-xl font-semibold (Merriweather)
- Definition Text: text-base (Inter)
- UI Labels: text-sm font-medium (Inter)
- Scores: text-3xl font-bold (Inter)

### C. Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, 12, and 16
- Tile gaps: gap-1 (tight grid)
- Component padding: p-4 or p-6
- Section margins: mb-8 or mb-12
- Modal padding: p-6

**Grid System:**
- Game board: 15×15 CSS Grid with equal cells
- Tile rack: flex layout with gap-2
- Responsive breakpoints: Stack vertically on mobile (< 768px), side-by-side on tablet+

### D. Component Library

**Game Board:**
- 15×15 grid with rounded corners (rounded-lg)
- Subtle box-shadow for depth
- Special squares marked with colored backgrounds and centered labels
- Border around board (border-4 with warm brown color)

**Letter Tiles:**
- Rounded squares (rounded-md)
- Strong box-shadow for 3D effect
- Large letter (centered, uppercase)
- Small point value in bottom-right corner
- Draggable with cursor-grab, active state with cursor-grabbing
- Subtle hover lift effect (translate-y-1)

**Tile Rack:**
- Horizontal flex container
- Holds 7 tiles with even spacing
- Subtle recessed appearance (inset shadow)
- Located below board on desktop, overlay on mobile

**Translation Popup:**
- Modal overlay with semi-transparent backdrop (bg-black/60)
- Centered card with generous padding (p-8)
- Spanish word as header (large, Merriweather)
- English translation (medium weight)
- Definition in smaller text with good line-height
- Pronunciation guide in italics
- Close button (X icon, top-right)
- Smooth fade-in animation (200ms)

**Score Display:**
- Player names with current scores
- Turn indicator (highlighted player with subtle border/background)
- Remaining tiles counter
- Positioned prominently above/beside board

**Action Buttons:**
- "Play Word" - Primary green button
- "Shuffle Tiles" - Secondary outline button
- "Pass Turn" - Subtle ghost button
- All buttons: rounded-lg, font-medium, px-6 py-3

**Game Controls:**
- "New Game" and "Share Link" buttons
- Placed in header area
- Distinct but not distracting

### E. Interactions & States

**Minimal Animations:**
- Tile placement: Quick snap-to-grid (100ms)
- Translation popup: Fade in/out (200ms)
- Button hovers: Subtle scale or color shift
- Turn transition: Brief highlight flash on active player

**Drag-and-Drop:**
- Visual feedback during drag (slight opacity, lifted shadow)
- Valid drop zones highlight subtly
- Invalid drops return tile with smooth animation

**Game States:**
- Loading: Simple spinner with "Cargando..." text
- Invalid word: Brief red border flash on board + error message
- Valid word: Success animation + translation popup trigger
- Game over: Modal with final scores and play again option

## Images

**No Images Required** - This is a functional game interface. All visual elements are UI components (board, tiles, buttons). Optionally, use a subtle wood texture as board background for enhanced realism.

## Special Considerations

**Accessibility:**
- High contrast between tiles and board
- Clear focus states for keyboard navigation
- Screen reader labels for all interactive elements
- ARIA labels for drag-and-drop actions

**Responsive Design:**
- Desktop: Side-by-side layout (board + scores/controls)
- Tablet: Stacked with board taking priority
- Mobile: Compact board with overlay controls and rack

**Performance:**
- Lightweight design with minimal decorative elements
- Efficient grid rendering
- Lazy-load translation data
- Smooth 60fps animations

This design balances the warmth of classic board games with the clarity and functionality required for online multiplayer gameplay and language learning.