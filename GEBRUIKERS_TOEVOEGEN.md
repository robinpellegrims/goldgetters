# Gebruikers Toevoegen

Omdat de magic link authenticatie alleen werkt voor bestaande gebruikers, moet je eerst gebruikers toevoegen aan het systeem.

## Development Mode

### Via cURL of Postman

Maak een POST request naar het admin endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"email": "jouw@email.com", "name": "Jouw Naam"}'
```

Of met alleen een email:

```bash
curl -X POST http://localhost:3000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"email": "jouw@email.com"}'
```

### Via Browser Console

Open je browser console op http://localhost:3000 en voer uit:

```javascript
fetch('/api/admin/create-user', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'jouw@email.com', name: 'Jouw Naam' }),
})
  .then((res) => res.json())
  .then(console.log);
```

### Meerdere gebruikers toevoegen

```bash
# Gebruiker 1
curl -X POST http://localhost:3000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"email": "speler1@email.com", "name": "Speler Één"}'

# Gebruiker 2
curl -X POST http://localhost:3000/api/admin/create-user \
  -H "Content-Type: application/json" \
  -d '{"email": "speler2@email.com", "name": "Speler Twee"}'

# Etc...
```

## Testen van Magic Link Login

1. Voeg eerst een gebruiker toe met een van de bovenstaande methoden
2. Klik op de login knop in de header (subtiele icoon rechtsboven)
3. Vul het e-mailadres in van de gebruiker die je hebt toegevoegd
4. In development mode wordt de magic link gelogd naar de console
5. Kopieer de URL uit de console en plak deze in je browser
6. Je bent nu ingelogd!

## Production Setup

⚠️ **BELANGRIJK**: De `/api/admin/create-user` endpoint is NIET beveiligd en moet:

1. **Beveiligd worden** met authenticatie voordat je naar productie gaat
2. **Verwijderd worden** na het aanmaken van initiële gebruikers
3. **Vervangen worden** door een database-based systeem

### Productie Aanpak

Voor productie heb je twee opties:

1. **Database Integration** (Aanbevolen)
   - Implementeer Prisma met PostgreSQL/MySQL
   - Voeg gebruikers toe via database migrations of admin panel
   - Zie `AUTH_SETUP.md` voor volledige instructies

2. **Handmatig via Database**
   - Maak gebruikers direct aan in je database
   - De auth code zal automatisch gebruikers ophalen uit de database

## Huidige Beperkingen (In-Memory Storage)

⚠️ De huidige implementatie gebruikt **in-memory storage**:

- Gebruikers verdwijnen wanneer de server herstart
- Werkt niet met meerdere server instances
- Niet geschikt voor productie

Voor productie moet je migreren naar een database. Zie `AUTH_SETUP.md` voor instructies.
