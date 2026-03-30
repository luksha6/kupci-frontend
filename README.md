# kupci-frontend

> **Advanced Model Benchmark:** This project specifically tests complex state-to-URL synchronization and performance optimization using high-reasoning paid models (Claude 3.5 Sonnet / GPT-4o).

## Product Discovery Engine

A marketplace-style **faceted search** UI with full **URL query synchronization** (`?category=tech&minPrice=100&sort=newest`), **browser back/forward** support, **virtualized grid** rendering, **infinite-style loading** via `IntersectionObserver`, and polished UX: **Framer Motion** filter sidebar, **skeleton** loading states, **toasts** for comparison actions, and **search highlight** in titles.

### Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [React Router](https://reactrouter.com/) for routing and `useSearchParams`
- [@tanstack/react-virtual](https://tanstack.com/virtual) for row virtualization
- [Framer Motion](https://www.framer.com/motion/) for sidebar animation

### Run locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

### Project layout

| Path | Role |
|------|------|
| `src/hooks/` | URL filter hook, debounced search, infinite chunk + intersection, media query |
| `src/context/` | Comparison list + toast queue |
| `src/components/` | Discovery page, virtual grid, sidebar, cards, skeletons, toasts, highlight |
| `src/utils/` | Mock catalog (128 items), URL encoding, filtering/sorting |

### URL parameters

| Param | Meaning |
|-------|---------|
| `q` | Free-text search |
| `category` | Comma-separated categories (`tech,home`, …) |
| `minPrice`, `maxPrice` | Numeric bounds (primary tier price) |
| `minRating` | Minimum star rating |
| `sort` | `newest` · `price_asc` · `price_desc` · `rating` |

All filters are derived from `URLSearchParams`, so **history navigation** restores the exact same view.

### Performance notes

- `useMemo` for filtered/sorted lists; `React.memo` on product cards and heavy child components.
- Virtualizer renders only visible rows; paired with chunked slicing for very large result sets.
