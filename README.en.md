[简体中文](./README.md) | English

# IKunCode Cloud - React Landing Page

A modern landing page project built with React + TypeScript + Vite + Tailwind CSS + Framer Motion.

## Features

- ⚡️ **Blazing-Fast Development** - Powered by Vite for a smooth development experience
- 🎨 **Modern Design** - Built with Tailwind CSS, with dark mode support
- 🎭 **Smooth Animations** - Integrated with Framer Motion for silky page interactions
- 📱 **Fully Responsive** - Adapts to all screen sizes
- 🔒 **Type-Safe** - Uses TypeScript to ensure code quality
- 🎯 **SEO-Optimized** - Preconfigured meta tags

## Tech Stack

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.6.3
- **Build Tool**: Vite 6.0.3
- **Styling**: Tailwind CSS 3.4.16
- **Animation**: Framer Motion 11.11.17
- **Icons**: Lucide React 0.468.0

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The project will start at `http://localhost:5173` with hot module replacement enabled.

### Production Build

```bash
npm run build
```

Build artifacts will be output to the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run type-check
```

## Project Structure

```
ikuncode/
├── src/
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry
│   └── styles/
│       └── globals.css      # Global styles
├── index.html               # HTML template
├── package.json             # Project configuration
├── tsconfig.json            # TypeScript configuration
├── tsconfig.node.json       # Node TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── README.md               # Project documentation
```

## Feature Details

### Pricing Strategy

**Exchange Rate Standard**: 1 CNY = 1 USD (no exchange rate difference)

#### 🔹 Codex Model
- **Fixed Multiplier**: 0.2x
- Available to all users, with no recharge threshold required

#### 🔹 CC Model (Claude/Chat)
Divided into four tiers, automatically unlocked based on cumulative recharge amount:

| Tier | Recharge Threshold | Multiplier | Description |
|------|---------|------|------|
| **C0** | < ¥25 | 1.1x | Initial tier |
| **C1** | ≥ ¥25 | 1.0x | Official pricing once threshold is met |
| **C2** | ≥ ¥500 | 0.95x | 5% discount |
| **C3** | ≥ ¥1000 | 0.90x | 10% discount |

**Notes**:
- ✅ No peak/off-peak distinction; the multiplier is unified across all hours
- ✅ Cumulative recharge amount accumulates automatically, and tiers are upgraded automatically
- ✅ Multipliers take effect in real time, with no manual application required

### Dark Mode

The project supports switching between dark and light modes, and remembers the user's preference:

- Automatically selects based on system theme on first visit
- Saves to localStorage after manual switching
- Synchronously loads theme on first render to avoid flashing (FOUC)

### Responsive Design

- **Mobile**: Single-column layout, optimized for touch interactions
- **Tablet**: Adapted for medium-sized screens
- **Desktop**: Multi-column layout that takes full advantage of large screens

### Animation Effects

- **Viewport Entry Animations**: Using Framer Motion's `whileInView`
- **Interactive Animations**: Button hover, navigation expansion, etc.
- **Background Effects**: Subtle flowing light effects

## Performance Optimizations

- ✅ Code splitting (React and animation libraries bundled separately)
- ✅ On-demand icon loading
- ✅ Automatic CSS Tree Shaking
- ✅ gzip compression
- ✅ Type checking

## Browser Support

Supports all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development Notes

1. **Type Safety**: All components have complete TypeScript type definitions
2. **Code Standards**: Follows React best practices
3. **Maintainability**: Clear code structure and comments

## Future Improvement Suggestions

- [ ] Modular component splitting (Header, Hero, Features, etc.)
- [ ] Add ESLint + Prettier
- [ ] Integrate unit testing (Vitest)
- [ ] Add E2E testing (Playwright)
- [x] Configure CI/CD (Vercel auto-deployment enabled)
- [ ] Add more SEO optimizations (OpenGraph, Twitter Cards)

## License

MIT

## Authors

IKunCode Team
