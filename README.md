# Techlingo Frontend

Viacjazyčný stavebný slovník pre profesionálov a študentov. Frontend aplikácia postavená na React + TypeScript + Vite + Tailwind CSS.

## Funkcionality

### Základné funkcie
- Pokročilé vyhľadávanie s debounce (300ms)
- Detailný pohľad na termíny (modal)
- Moderný dizajn s PNG logami a gradient farbami
- Responzívne UI

### UI funkcie
- ✅ **Dark mode toggle** - plne funkčný prepínač svetlého/tmavého režimu s uložením preferencie
- ✅ **UI jazyk switch** - prepínanie medzi slovenčinou a angličtinou s uložením preferencie

### Admin systém
- ✅ **Admin prihlásenie** - autentifikácia s rolami
- ✅ **Admin dashboard** - správa termínov a kategórií
- ✅ **Správa termínov** - pridávanie, úprava a mazanie termínov
- ✅ **Správa kategórií** - pridávanie, úprava a mazanie kategórií s kontrolou použitia
- ✅ **Štatistiky** - prehľad počtu termínov a kategórií
- ✅ **Vyhľadávanie v admin** - filtrovanie termínov podľa názvu alebo definície
- ✅ **Chránené routes** - admin stránky dostupné len pre prihlásených administrátorov

## Routing

Aplikácia používa `react-router-dom` s týmito routami:

### Verejné routes
- `/` - Hlavná stránka so zoznamom termínov
- `/term/:id` - Detail termínu
- `/exercises` - Placeholder pre cvičenia
- `/login` - Prihlasovacia stránka pre adminov

### Chránené routes (iba pre prihlásených adminov)
- `/admin` - Admin dashboard pre správu termínov a kategórií

Query parametre na hlavnej stránke:

- `?q=...` - vyhľadávací dotaz
- `?dir=sk-en` - smer prekladu

## Dark Mode

Aplikácia plne podporuje dark mode pomocou custom hooku `useDarkMode`:

## Accessibility

Všetky komponenty sú navrhnuté s prístupnosťou na zreteli:

- Všetky inputy majú labely
- Modály majú správne ARIA atribúty
- Tlačidlá majú focus ring
- Farby spĺňajú WCAG kontrast ratio

## Technológie a nástroje

### Frontend Stack
- **React 18** - UI knižnica
- **TypeScript** - Type safety
- **Vite** - Build tool a dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### State Management
- **React Context API** - Globálny state (Auth, UI)
- **Custom Hooks** - Lokálny state management
- **localStorage** - Perzistentné uloženie dát

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### Features
- Hot Module Replacement (HMR)
- Tree-shaking a code splitting
- Optimalizované produkčné buildy
- Source maps pre debugging
