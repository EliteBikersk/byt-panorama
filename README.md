# Byt A1.2 na prenájom, novostavba Panoráma, Považská Bystrica

Statická stránka prenájmu 2-izbového bytu (86,47 m²) v novostavbe Panoráma v Považskej Bystrici.

- `index.html`: slovenská verzia
- `en/index.html`: anglická verzia
- `img/`: fotografie (plná veľkosť a mobilné verzie `-800.jpg`) a pôdorys
- `consent.js`: lišta cookies (Consent Mode v2, základný režim). Google Analytics (Google tag `GTM-55SXMRX3`, GA4 `G-XSFMBY86GQ`) sa načíta až po „Prijať“, mapa Google Maps až po „Zobraziť mapu“ (mapa je v HTML ako `<figure class="map" data-map-src>`, nie iframe). Meria kliknutia na telefón a SMS, tlačidlá, fotky, zobrazenie a čas v sekciách. Pri zmene súboru zvýšiť `?v=` v odkazoch.
- `cookies/`, `en/cookies/`: cookies a ochrana súkromia (informácie podľa GDPR, SK a EN), generuje ich `cookies_body.py` mimo repozitára
- `sitemap.xml`, `robots.txt`: pre vyhľadávače
- `email/`: fotky, ktoré sa načítavajú v e-mailoch firmám a agentúram. Pri novom nasadení webu tento priečinok nemazať, inak sa v už odoslaných e-mailoch fotka prestane zobrazovať.

Zverejnené cez GitHub Pages (vetva `main`, priečinok `/`) na doméne https://prenajombytupb.sk/ (súbor `CNAME`, DNS vo Websupporte).
