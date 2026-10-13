# YoungFinners

Student startup incubation and micro-crowdfunding platform: matchmaking, escrowed micro-funding, a Rep-Score accountability engine and **Zaro AI** (idea validator, roadmap generator, financial auditor, matchmaker). Theme: "Monochrome Precision" (Next.js, Tailwind).

## Run
```
npm install
cp .env.example .env.local   # set ZARO_API_KEY (never commit it)
npm run dev
npm test
```
Zaro logic runs locally in `lib/zaro.ts`; the key is read server-side only (`app/api/zaro/route.ts`). Rep-Score lives in `lib/rep.ts`. All controls (theme, density, animation, persona, strictness, funding cap, Rep weighting, matching filters) are on `/settings`.
