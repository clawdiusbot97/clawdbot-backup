# Buenos Aires Trip Research (Feb 26 - Mar 2, 2026)

## 🏡 Best Airbnb Options (Palermo Focus)

**Method used (important):** Airbnb search page data was extracted directly from Airbnb’s embedded search JSON for `checkin=2026-02-26`, `checkout=2026-03-02`, `2 guests`, `entire home`, `2+ bedrooms`, Palermo area. Airbnb currently displays **“prices include all fees”** in this result view, but **cleaning/service/tax line-by-line fee split is not exposed** in the extracted payload.

**Currency note:** Airbnb prices were returned in **BRL (R$)** in this session.

### 1) Palermo, 3 ambiances. Boulevard charcas
- **Title:** Palermo, 3 ambiances. Boulevard charcas
- **Direct link:** https://www.airbnb.com/rooms/819461983723393314?check_in=2026-02-26&check_out=2026-03-02&adults=2
- **Total price with fees:** **R$1,130** (4 nights, as shown)
- **Price/night:** ~R$282.5
- **Bedrooms:** 2 bedrooms
- **Amenities:** Entire place (filter), 2 beds shown; specific WiFi/pool/gym split not exposed in extracted card
- **Pros:** In Palermo, lowest-price tier among Palermo-labeled 2BR options, good rating
- **Cons:** Detailed fee split not visible; amenity granularity uncertain
- **Value score (1-10):** 9.0

### 2) Salguero Apartment - Palermo
- **Title:** Salguero Apartment - Palermo
- **Direct link:** https://www.airbnb.com/rooms/690410806614792604?check_in=2026-02-26&check_out=2026-03-02&adults=2
- **Total price with fees:** **R$1,264** (4 nights, as shown)
- **Price/night:** ~R$316
- **Bedrooms:** 2 bedrooms
- **Amenities:** Entire place (filter), free cancellation badge shown
- **Pros:** Palermo location, free cancellation tag shown, reasonable total
- **Cons:** Lower review score than top picks
- **Value score (1-10):** 8.7

### 3) Palermo Soho
- **Title:** Palermo Soho
- **Direct link:** https://www.airbnb.com/rooms/973301242292060356?check_in=2026-02-26&check_out=2026-03-02&adults=2
- **Total price with fees:** **R$1,356** (4 nights, as shown)
- **Price/night:** ~R$339
- **Bedrooms:** 2 bedrooms
- **Amenities:** Entire place (filter), Guest Favorite badge shown
- **Pros:** Strong location fit (Palermo Soho), high review score (4.91)
- **Cons:** More expensive than other Palermo options listed here
- **Value score (1-10):** 8.4

### 4) Palermo / Barrio Norte, everything nearby, subway, buses
- **Title:** Palermo / Barrio Norte, everything nearby, subway, buses
- **Direct link:** https://www.airbnb.com/rooms/1528907527314111356?check_in=2026-02-26&check_out=2026-03-02&adults=2
- **Total price with fees:** **R$1,179** (4 nights, as shown)
- **Price/night:** ~R$294.8
- **Bedrooms:** 2 bedrooms
- **Amenities:** Entire place (filter), free cancellation badge shown
- **Pros:** Excellent rating (5.0), below many comparable 2BR options
- **Cons:** Not explicitly tagged as Soho/Hollywood in subtitle
- **Value score (1-10):** 9.1

### 5) Palermo, excellent apartment Solar de la Abadía
- **Title:** Palermo, excellent apartment Solar de la Abadía
- **Direct link:** https://www.airbnb.com/rooms/38073118?check_in=2026-02-26&check_out=2026-03-02&adults=2
- **Total price with fees:** **R$1,331** (4 nights, as shown)
- **Price/night:** ~R$332.8
- **Bedrooms:** 2 bedrooms
- **Amenities:** Entire place (filter), Guest Favorite badge shown
- **Pros:** Palermo-specific listing name, strong rating (4.81), established listing
- **Cons:** Price not among cheapest Palermo options
- **Value score (1-10):** 8.3

**Other strong alternates cross-checked from same Airbnb dataset:**
- Palermo Hollywood option: https://www.airbnb.com/rooms/943566697672904317 (subtitle: “(SFE) Spacious 2 bedroom in Palermo Hollywood”, R$1,300, 4 nights)
- Palermo area listing with large balcony: https://www.airbnb.com/rooms/1457161501535745499 (R$1,319, 4 nights)

---

## 💰 Budget Analysis

### Accommodation target vs market reality
- **Target budget:** max **USD 300 total** for 4 nights.
- Extracted Airbnb Palermo 2BR options are in approximately **R$1,130–R$1,356 total**.
- Converting BRL→USD depends on live FX (not directly available in this environment), but this BRL range is typically near the requested budget band; **several options appear likely near/under USD 300 total** (FX-dependent, uncertain).

### Hidden fees / cleaning fees
- Airbnb search payload in this extraction shows totals as **“price includes all fees”** in the UI context.
- **Limitation:** line-item split (nightly + cleaning + service + taxes) was **not exposed** in the extracted search card payload.
- Therefore, each listing’s total is reported as **final displayed total for stay**, with fee components marked **uncertain/not separately visible**.

### Deal/discount signals found
- Multiple listings flagged as recently discounted (Airbnb explanatory text in payload).
- Several listings show “original” vs discounted totals (e.g., discounted from higher original total).
- Free cancellation badges visible on some entries (value/flexibility advantage).

---

## ⛴ Ferry Options (Montevideo ↔ Buenos Aires)

### 1) Colonia Express (directly queryable pricing)
- **Source used:** official endpoint data from Colonia Express (`/uy/api/partidas` and booking flow).
- **Route checked:** MVD ↔ BUE, dates 2026-02-26 / 2026-03-02, 2 adults.
- **Observed fare category references (one-way, per adult):**
  - Super Económica (TT3): **UYU 1,795**
  - Super Express (TT2): **UYU 1,975**
  - Super Flex (TT1): **UYU 2,272**
- **Estimated roundtrip transport floor (2 adults, TT3 both ways):**
  - `1,795 x 2 legs x 2 adults = UYU 7,180` (**best visible base**) 
- **Duration:** multiple departures observed; shown sailing legs mostly around **1h15–1h30 per ferry segment** (full door-to-door may vary).
- **Discount/promos observed on site:** banners for discounts/cuponeras/benefits, but promo eligibility is conditional and not automatically applicable.

### 2) Buquebus direct MVD ↔ BUE
- **Source used:** official endpoint `/api/searchSailingByPortAndDate`.
- **Observed direct sailings:**
  - MVD→BUE examples: 11:00→13:30, 20:00→22:00 (approx 2h–2h30 windows)
  - BUE→MVD examples: 07:30→10:00, 16:00→18:30
- **Pricing status:** **uncertain** in this run (public schedule endpoint returns sailings; price endpoint needs additional protected payload/session context).

### 3) Buquebus via Colonia (MVD→COL + COL→BUE pattern)
- **Observed in schedule data:** multiple MVD→COL and BUE→COL sailings the same days.
- This enables a **via Colonia strategy**, typically with wider schedule inventory.
- **Pricing status:** **uncertain** in this run for same reason above.

### Cheapest flexible departures (based on verifiable fare data)
- **Most defensible cheapest combination from live-queried prices:**
  - **Colonia Express TT3 (Super Económica) both directions**.
- Buquebus could be competitive on specific sailings/promos, but this session could only verify schedule, not final fare quotes.

---

## 🧠 Final Insight (NO DECISION)

### Top 3 value stays (from extracted Airbnb Palermo-focused set)
1. **Palermo / Barrio Norte, everything nearby, subway, buses** — strong rating + low total value signal.
2. **Palermo, 3 ambiances. Boulevard charcas** — best price among clearly Palermo options in extracted set.
3. **Salguero Apartment - Palermo** — good balance of Palermo location, cost, and flexibility (free cancellation shown).

### Cheapest transport combination (verifiable)
- **Colonia Express TT3 roundtrip for 2 adults (~UYU 7,180 base total)** appears cheapest from directly queryable fare data.

### Important uncertainty flags
- Buquebus fares (direct and via Colonia) were not fully extractable in final quoted form from public endpoint responses in this environment.
- Airbnb fee line-items (cleaning/service/taxes breakdown) were not separately exposed in extracted search cards; totals were taken from Airbnb’s “all fees included” display context.

**No booking made. No final decision made.**