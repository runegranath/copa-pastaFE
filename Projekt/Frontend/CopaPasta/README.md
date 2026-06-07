# Veckomeny & Beställningssystem - Frontend

Detta är frontenden för en fiktiv lunchrestaurang med dess veckomeny- och beställningssystem. Gränssnittet är uppdelat i en publik del där kunder kan se veckans meny och lägga beställningar, samt en skyddad administrationsdel för restaurangens personal där de kan hantera menyer/ordrar och registrera användare.

livelänk finns här: https://bbw-fe.onrender.com Observera att förinlagda menyer kan ta upp till 30 sekunder att ladda.

---

## Features

* **Publik Veckomeny:** Visar aktuella maträtter sorterade efter veckodag för ett valt år och veckonummer, börjar på nuvarande vecka.
* **Beställningsformulär:** Tillåter kunder att välja en maträtt, ange namn, telefonnummer, önskad upphämtningstid samt antal portioner.
* **Administratörsinloggning:** Ett säkert formulär för personalen att logga in med e-post och lösenord för att erhålla en JWT-token.
* **Administratörsregistrering:** Ett validerande formulär för befintlig inloggad personal att kunna skapa nya användare med. 
* **Orderhantering (Admin):** En skyddad vy där personalen kan se inkomna beställningar, uppdatera orderstatus (t.ex. från "pending" till "klar") samt radera gamla ordrar.
* **Menyhantering (Admin):** Möjlighet för inloggade administratörer att skapa och publicera en helt ny veckomeny med rätter för hela veckan, samt radera/uppdatera befintliga menyer.

---

## Översikt av vyer

Applikationen är uppbyggd kring följande huvudsidor:
* `home.html` – Den publika startsidan som välkomnar användaren och bjuder in till att se menyn.
* `login.html` – Inloggningssidan för administratörer.
* `orders.html` – Instrumentpanelen för personalen där ordrar hanteras (kräver giltig token).
* `addmenu.html` – Verktyget för att skapa och publicera nya veckomenyer (kräver giltig token).
* `register.html` - Sidan där inloggade kan skapa nya konton (kräver giltig token).

---


### Hantera API-anslutningen
Applikationen kommunicerar med backenden via HTTP-anrop (`fetch`). Standardadressen i skripten är inställd mot backend-servern på Render-URL:en `https://bbw-be.onrender.com` .          

---

## Säkerhet och state-hantering

* **Sessionshantering:** Vid lyckad inloggning sparas administratörens JWT-token i webbläsarens `localStorage`.
* **Auktorisering:** Skripten på de skyddade sidorna kontrollerar automatiskt om en token finns sparad. Saknas den, skickas användaren direkt tillbaka till inloggningssidan.
* **API-säkerhet:** Alla skyddade anrop (`POST /api/addmenu`, `GET /api/orders` osv.) skickar med denna token i HTTP-headern som en `Bearer`-token för att valideras av backenden.

---

