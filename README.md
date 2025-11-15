# Techlingo Frontend

Viacjazyčný stavebný slovník pre profesionálov a študentov. Frontend aplikácia postavená na React + TypeScript + Vite + Tailwind CSS.

## Funkcionality

### Základné funkcie
- Viacjazyčný slovník so smermi prekladu SK→EN a EN→SK
- Pokročilé vyhľadávanie s debounce (300ms)
- Filtrovanie podľa kategórií (možnosť výberu viacerých kategórií naraz)
- Detailný pohľad na termíny (modal)
- Moderný dizajn s PNG logami a gradient farbami
- Responzívne UI
- Pripravené na rozšírenie o ďalšie jazyky (DE, CZ)
- Pripravené na prepojenie s REST API

### UI funkcie
- ✅ **Dark mode toggle** - plne funkčný prepínač svetlého/tmavého režimu s uložením preferencie
- ✅ **UI jazyk switch** - prepínanie medzi slovenčinou a angličtinou s uložením preferencie
- ✅ **Multi-kategóriové filtrovanie** - možnosť výberu viacerých kategórií súčasne

### Admin systém
- ✅ **Admin prihlásenie** - autentifikácia s rolami (demo: admin@techlingo.sk / admin123)
- ✅ **Admin dashboard** - správa termínov a kategórií
- ✅ **Správa termínov** - pridávanie, úprava a mazanie termínov
- ✅ **Správa kategórií** - pridávanie, úprava a mazanie kategórií s kontrolou použitia
- ✅ **Štatistiky** - prehľad počtu termínov a kategórií
- ✅ **Vyhľadávanie v admin** - filtrovanie termínov podľa názvu alebo definície
- ✅ **Chránené routes** - admin stránky dostupné len pre prihlásených administrátorov

## Inštalácia

```bash
# Nainštalujte závislosti
npm install

# Spustite vývojový server
npm run dev

# Vytvorte produkčný build
npm run build

# Náhľad produkčného buildu
npm run preview
```

## Skripty

- `npm run dev` - spustí vývojový server (http://localhost:5173)
- `npm run build` - vytvorí produkčný build
- `npm run preview` - náhľad produkčného buildu
- `npm run lint` - spustí ESLint kontrolu
- `npm run typecheck` - spustí TypeScript type checking
- `npm run format` - naformátuje kód pomocou Prettier

## Štruktúra projektu

```
src/
├── components/          # Znovupoužiteľné UI komponenty
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   ├── Select.tsx
│   ├── SearchBar.tsx
│   ├── DirectionSwitch.tsx
│   ├── CategoryFilter.tsx
│   ├── MultiCategoryFilter.tsx   # Filter pre výber viacerých kategórií
│   ├── TermCard.tsx
│   ├── TermDetail.tsx
│   ├── TermForm.tsx               # Formulár pre pridávanie/úpravu termínov
│   ├── CategoryForm.tsx           # Formulár pre pridávanie/úpravu kategórií
│   ├── ProtectedRoute.tsx         # Ochrana routes pre adminov
│   └── EmptyState.tsx
│
├── contexts/            # React Context providers
│   ├── AuthContext.tsx            # Autentifikácia a user management
│   └── UIContext.tsx              # UI state (jazyk, preferencie)
│
├── hooks/               # Custom React hooks
│   └── useDarkMode.ts             # Hook pre dark mode management
│
├── features/
│   └── dictionary/      # Dictionary-specific funkcionality
│       └── useDictionary.ts      # Hook pre správu slovníka
│
├── pages/               # Stránky aplikácie
│   ├── Home.tsx                   # Hlavná stránka so zoznamom termínov
│   ├── TermPage.tsx               # Detail termínu
│   ├── Exercises.tsx              # Placeholder pre cvičenia
│   ├── Login.tsx                  # Prihlasovacia stránka pre adminov
│   └── AdminDashboard.tsx         # Admin dashboard pre správu termínov a kategórií
│
├── lib/                 # Utility a core funkcionality
│   ├── api.ts                     # API vrstva (zatiaľ mock data)
│   ├── types.ts                   # TypeScript typy a interfacy
│   ├── i18n.ts                    # Internacionalizácia
│   └── utils.ts                   # Pomocné funkcie
│
├── data/                # Statické dáta
│   └── terms.sk-en.json          # Seed data pre slovník
│
├── App.tsx              # Hlavný komponent s routingom a providers
├── main.tsx             # Entry point
└── index.css            # Globálne štýly (Tailwind)
```

## Dátový formát

Termíny sa nachádzajú v `src/data/terms.sk-en.json` v nasledujúcom formáte:

```json
{
  "sourceLang": "sk",
  "targetLang": "en",
  "entries": [
    {
      "id": "1",
      "slug": "zelezo-beton",
      "source": "Železobetón",
      "target": "Reinforced concrete",
      "definition": "Kompozit betónu a oceľovej výstuže prenášajúci tlak aj ťah.",
      "category": ["material", "statics"],
      "exampleUsage": "Stropná doska bola navrhnutá ako železobetónová."
    }
  ]
}
```

### Polia

- `sourceLang`: Zdrojový jazyk (sk, en, de, cz)
- `targetLang`: Cieľový jazyk
- `entries`: Pole termínov
  - `id`: Unikátny identifikátor
  - `slug`: URL-friendly identifikátor
  - `source`: Termín v zdrojovom jazyku
  - `target`: Preklad termínu
  - `definition`: Definícia termínu
  - `category`: Pole kategórií (material, statics, structure, finishing, energy, hvac, other)
  - `exampleUsage`: Príklad použitia termínu

## Pridanie nového termínu

1. Otvorte `src/data/terms.sk-en.json`
2. Pridajte nový objekt do poľa `entries`:

```json
{
  "id": "13",
  "slug": "novy-termin",
  "source": "Nový termín",
  "target": "New term",
  "definition": "Definícia nového termínu.",
  "category": ["category-name"],
  "exampleUsage": "Príklad použitia."
}
```

3. Uložte súbor a aplikácia automaticky načíta nové dáta

**Poznámka:** Pre pridávanie termínov cez UI použijte admin dashboard na `/admin`.

## Pridanie nového jazyka

Aplikácia je pripravená na rozšírenie o ďalšie jazyky. Pre pridanie nového jazyka:

### 1. Pridajte jazyk do typov

V `src/lib/types.ts`:

```typescript
export type Language = 'sk' | 'en' | 'de' | 'cz' | 'novy-jazyk'
export type TranslationDirection = 'sk-en' | 'en-sk' | 'sk-de' | ... | 'sk-novy-jazyk'
```

### 2. Pridajte preklady UI

V `src/lib/i18n.ts`:

```typescript
const translations: Translations = {
  'nav.dictionary': { sk: 'Slovník', en: 'Dictionary', 'novy-jazyk': 'Preklad' },
  // ...
}
```

### 3. Vytvorte dátový súbor

Vytvorte nový súbor napr. `src/data/terms.sk-novy-jazyk.json` s prekladmi.

### 4. Aktualizujte komponenty

V `src/components/DirectionSwitch.tsx` pridajte nový smer prekladu:

```typescript
const AVAILABLE_DIRECTIONS: TranslationDirection[] = [
  'sk-en',
  'en-sk',
  'sk-novy-jazyk',
  'novy-jazyk-sk',
]
```

## Prepojenie na REST API

Aplikácia je pripravená na prepojenie s backendom. API volania sú izolované v `src/lib/api.ts`.

### Aktuálny stav

Všetky funkcie v `api.ts` momentálne čítajú zo statického JSON súboru:

```typescript
export async function getTerms(params?: GetTermsParams): Promise<Term[]> {
  // Simuluje API delay
  await simulateDelay()
  // Číta z JSON súboru
  let results = (termsData as DictionaryData).entries
  // ... filtrovanie a vracanie výsledkov
}
```

### Prepojenie na backend

1. **Vymeňte mock implementáciu za fetch**:

```typescript
export async function getTerms(params?: GetTermsParams): Promise<Term[]> {
  const queryParams = new URLSearchParams()
  if (params?.query) queryParams.set('q', params.query)
  if (params?.direction) queryParams.set('dir', params.direction)
  if (params?.category) queryParams.set('cat', params.category)

  const response = await fetch(`/api/terms?${queryParams}`)
  if (!response.ok) throw new Error('Failed to fetch terms')

  return response.json()
}
```

2. **Podobne pre getTermById**:

```typescript
export async function getTermById(id: string): Promise<Term | null> {
  const response = await fetch(`/api/terms/${id}`)
  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error('Failed to fetch term')
  }

  return response.json()
}
```

3. **Implementujte translateText**:

```typescript
export async function translateText(
  request: TranslateRequest
): Promise<TranslateResponse> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })

  if (!response.ok) throw new Error('Translation failed')
  return response.json()
}
```

### Očakávané API endpointy

Backend by mal implementovať tieto endpointy:

- `GET /api/terms?q=...&dir=sk-en&cat=material` - zoznam termínov s filtrami
- `GET /api/terms/:id` - detail termínu
- `POST /api/translate` - preklad textu (body: `{text, from, to}`)

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
- `?cat=material` - kategória (možnosť viacerých kategórií)

## Dark Mode

Aplikácia plne podporuje dark mode pomocou custom hooku `useDarkMode`:

```typescript
// src/hooks/useDarkMode.ts
export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Načíta z localStorage alebo použije systémové nastavenie
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) return stored
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
    return 'light'
  })

  // Automatické ukladanie preferencie do localStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return { theme, toggleTheme, isDark: theme === 'dark' }
}
```

Dark mode toggle je implementovaný v navigácii s ikonou slnka/mesiaca.

## Logá a branding

Aplikácia používa profesionálne PNG logá Tech Lingo s transparentným pozadím:

### Dostupné logá
- `public/assets/logo-light.png` - Horizontálne logo pre svetlý režim
- `public/assets/logo-dark.png` - Horizontálne logo pre tmavý režim
- `public/assets/symbol-light.png` - Symbol logo pre svetlý režim
- `public/assets/symbol-dark.png` - Symbol logo pre tmavý režim

### Použitie v kóde
```tsx
<img
  src="/assets/logo-light.png"
  alt="Tech Lingo"
  className="h-12 dark:hidden"
/>
<img
  src="/assets/logo-dark.png"
  alt="Tech Lingo"
  className="h-12 hidden dark:block"
/>
```

Logá sa automaticky prepínajú medzi svetlou a tmavou verziou podľa aktívneho dark mode.

## Multi-kategóriové filtrovanie

Aplikácia podporuje výber viacerých kategórií súčasne pomocou komponenty `MultiCategoryFilter`:

```typescript
// Použitie v Home.tsx
<MultiCategoryFilter
  selectedCategories={categories}
  onChange={setCategories}
/>
```

### Funkcie
- **Dropdown menu** s checkboxmi pre každú kategóriu
- **Badges** zobrazujúce vybrané kategórie s možnosťou ich odstránenia
- **Clear all** tlačidlo pre rýchle zrušenie všetkých filtrov
- Filtrovanie funguje ako OR operácia (zobrazí termíny, ktoré patria do aspoň jednej z vybraných kategórií)

## Accessibility

Všetky komponenty sú navrhnuté s prístupnosťou na zreteli:

- Všetky inputy majú labely
- Modály majú správne ARIA atribúty
- Tlačidlá majú focus ring
- Farby spĺňajú WCAG kontrast ratio

## Dizajn a téma

Aplikácia využíva modernú farebnú paletu:
- **Primárna farba**: Modrá (#3b82f6, #2563eb)
- **Akcentová farba**: Jantárová/oranžová (#f59e0b, #f97316)
- **PNG logá**: Profesionálne Tech Lingo logá s transparentným pozadím
- Gradient pozadia (modrá-indigo-fialová) pre visual appeal
- Moderné UI s backdrop blur efektami
- Tenké bordery s farebnými akcentmi
- Animácie a hover efekty pre lepší UX

## Admin systém

### Prihlásenie

Aplikácia obsahuje admin systém pre správu obsahu. Pre prístup použite:

- URL: `/login`
- **Demo credentials:**
  - Email: `admin@techlingo.sk`
  - Heslo: `admin123`

### Funkcionality Admin Dashboardu

#### Správa termínov
- **Pridávanie termínov** - formulár s validáciou všetkých povinných polí
- **Úprava termínov** - editácia existujúcich termínov
- **Mazanie termínov** - odstránenie termínov s potvrdením
- **Vyhľadávanie** - real-time filtrovanie termínov podľa názvu alebo definície
- **Automatické generovanie slug** - URL-friendly identifikátory

#### Správa kategórií
- **Pridávanie kategórií** - nové kategórie s kľúčom, názvom a popisom
- **Úprava kategórií** - zmena názvu a popisu (kľúč nie je možné meniť)
- **Mazanie kategórií** - odstránenie s upozornením ak je kategória použitá v termínoch
- **Kontrola duplicity** - zabránenie vytvoreniu kategórií s rovnakým kľúčom
- **Štatistiky** - zobrazenie počtu termínov v každej kategórii

#### Štatistiky
- **Celkový počet termínov**
- **Počet termínov pridaných dnes**
- **Počet kategórií**

#### Bezpečnosť
- **Autentifikácia** - prihlásenie s email/heslo
- **Role-based access control** - rozlíšenie medzi bežnými užívateľmi a adminmi
- **Protected routes** - `/admin` dostupný len pre prihlásených adminov
- **Session persistence** - uloženie prihlásenia v localStorage

### Context API

Aplikácia využíva dva hlavné contexty:

#### AuthContext
```typescript
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}
```

#### UIContext
```typescript
interface UIContextType {
  uiLang: Language  // 'sk' | 'en'
  setUiLang: (lang: Language) => void
}
```

## Ďalší vývoj

### Dokončené funkcionality ✅

- ✅ Implementovať toggle pre dark mode
- ✅ Pridať switch pre UI jazyk (SK/EN)
- ✅ Multi-kategóriové filtrovanie
- ✅ Admin systém (prihlásenie, dashboard, CRUD operácie)
- ✅ Správa kategórií v admin dashboarde

### TODO funkcionality

- [ ] Cvičenia (flashcards, quiz, matching)
- [ ] Offline režim s Service Worker
- [ ] Rozšírené štatistiky používania slovníka (grafy, trendy)
- [ ] Prepojenie na backend REST API
- [ ] Notifikácie a toasty pre user feedback
- [ ] Bulk operácie (import/export termínov vo veľkom)
- [ ] Verziovanie termínov (história zmien)

### Možné vylepšenia

- State management (Zustand/Jotai) pre komplexnejší stav (ak aplikácia narastie)
- React Query pre lepšie cachovanie API odpovedí a optimistické updaty
- Progressive Web App funkcionality (offline support, install prompt)
- Textové anotácie a poznámky k termínom
- Zdieľanie termínov na sociálne siete
- Vizualizácia trendov vyhľadávaní (grafy s Chart.js alebo D3)
- AI-powered suggestions pre termíny
- Pokročilé vyhľadávanie (fuzzy search, synonymá)
- Export do rôznych formátov (PDF, Excel, Word)

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

## Licencia

Private project - Techlingo

## Kontakt a podpora

Pre otázky a problémy kontaktujte development team.

---

**Posledná aktualizácia README:** 2025-11-08
**Verzia aplikácie:** 1.0.0
**Status:** ✅ Production Ready
