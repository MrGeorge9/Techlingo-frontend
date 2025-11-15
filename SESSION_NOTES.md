# Session Notes - Tech Lingo Development

## Dátum: 2025-11-08

## Zhrnutie vykonaných zmien

### 1. Bilinguálna podpora pre definície a príklady
**Problém:** Keď používateľ prepne smer prekladu z SK→EN na EN→SK, definícia a príklad boli stále v slovenčine.

**Riešenie:**
- Aktualizované `Term` interface v `src/lib/types.ts`:
  - `definitionSk` a `definitionEn` (namiesto jedného `definition`)
  - `exampleUsageSk` a `exampleUsageEn` (namiesto jedného `exampleUsage`)

- Upravené komponenty:
  - `src/components/TermDetail.tsx` - zobrazuje správnu jazykovú verziu podľa `direction`
  - `src/components/TermCard.tsx` - zobrazuje náhľad v správnom jazyku
  - `src/components/TermForm.tsx` - 4 oddelené polia pre SK a EN verzie
  - `src/pages/Home.tsx` - prideľuje `direction` prop komponentom
  - `src/pages/AdminDashboard.tsx` - vyhľadávanie v oboch jazykoch

- Aktualizované dáta:
  - `src/data/terms.sk-en.json` - všetkých 12 termínov má teraz obe jazykové verzie

### 2. Oprava chýb "Cannot read properties of undefined (reading 'toLowerCase')"
**Problém:** Vyhľadávanie havarovalo pri zadaní textu.

**Riešenie:**
- Pridané optional chaining (`?.`) vo všetkých filter funkciách:
  - `src/lib/api.ts:32-35`
  - `src/pages/AdminDashboard.tsx:65-68`

### 3. Tolerancia diakritiky vo vyhľadávaní
**Problém:** Keď používateľ zadal "zelezo" namiesto "železo", nič sa nenašlo.

**Riešenie:**
- Vytvorená utility funkcia `removeDiacritics()` v `src/lib/utils.ts:75-80`
  - Používa Unicode normalizáciu (NFD) na odstránenie diakritických znamienok
  - Príklad: "železo" → "zelezo", "čaj" → "caj"

- Implementované v:
  - `src/lib/api.ts:28-38` - hlavné vyhľadávanie
  - `src/pages/AdminDashboard.tsx:63-71` - admin vyhľadávanie

### 4. Úprava správania "Clear filters"
**Problém:** Tlačidlo "Zrušiť filtre" sa zobrazovalo aj pri bežnom vyhľadávaní.

**Riešenie:**
- `src/pages/Home.tsx:37` - `hasFilters` kontroluje len `categories.length > 0`
- `src/features/dictionary/useDictionary.ts:135-142` - `clearFilters()` maže len kategórie, zachováva query a direction

## Štruktúra kľúčových súborov

### Typy (src/lib/types.ts)
```typescript
interface Term {
  id: string
  slug: string
  source: string        // SK text
  target: string        // EN text
  definitionSk: string  // SK definícia
  definitionEn: string  // EN definícia
  category: Category[]
  exampleUsageSk: string   // SK príklad
  exampleUsageEn: string   // EN príklad
}

type TranslationDirection = 'sk-en' | 'en-sk'
```

### Vyhľadávanie (src/lib/api.ts)
- Funkcia `getTerms()` podporuje:
  - Vyhľadávanie bez diakritiky
  - Filtrovanie podľa kategórií
  - Prepínanie smeru prekladu (SK→EN, EN→SK)
  - Pagináciu

### Utility funkcie (src/lib/utils.ts)
- `removeDiacritics(text: string)` - odstráni diakritiku z textu
- `debounce()` - oneskorí vykonanie funkcie
- `cn()` - kombinuje class names

## Aktuálny stav projektu

### ✅ Funguje:
- Bilinguálne definície a príklady
- Vyhľadávanie tolerantné na diakritiku
- Optional chaining pre bezpečné vyhľadávanie
- Admin konzola s úpravami v oboch jazykoch
- Filter správanie (Clear filters len pre kategórie)

### ⚠️ Možné problémy:
- Cache v prehliadači - môže byť potrebné Ctrl+F5 na hard refresh
- HMR updates prebehli úspešne, ale zmeny sa nemusia okamžite prejaviť

## Ďalšie kroky (možné rozšírenia)
1. Fuzzy search - tolerancia preklepov (napr. "zelzo" → "železo")
2. Zvýraznenie vyhľadaných výrazov vo výsledkoch
3. História vyhľadávania s odstránením duplicít
4. Export/import slovníka
5. Backend API integrácia (momentálne mock data)

## Technické poznámky
- Vite dev server beží na `http://localhost:5173`
- HMR (Hot Module Replacement) funguje správne
- Používame TypeScript + React 18 + Tailwind CSS
- Mock data v JSON súbore, pripravené na REST API integráciu

## Príkazy
```bash
# Spustenie dev servera
npm run dev

# Build
npm run build

# Preview produkčného buildu
npm run preview
```

## Kontakt súborov upravených v tejto session
1. `src/lib/types.ts` - rozšírené Term interface
2. `src/lib/api.ts` - pridané removeDiacritics
3. `src/lib/utils.ts` - nová funkcia removeDiacritics
4. `src/components/TermDetail.tsx` - direction-aware zobrazenie
5. `src/components/TermCard.tsx` - direction-aware náhľad
6. `src/components/TermForm.tsx` - 4 polia pre SK/EN verzie
7. `src/pages/Home.tsx` - úprava hasFilters logiky
8. `src/pages/AdminDashboard.tsx` - bilinguálne vyhľadávanie
9. `src/features/dictionary/useDictionary.ts` - úprava clearFilters
10. `src/data/terms.sk-en.json` - pridané EN verzie všetkým termínom
