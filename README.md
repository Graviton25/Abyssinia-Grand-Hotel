# Abyssinia Grand Hotel

A polished full-stack hotel reservation website built with HTML, CSS, JavaScript, Node.js and Express.

## Included

- Premium responsive hotel landing page
- Room catalogue with category filters
- Consistent image sizing and polished room descriptions
- Guest registration and login with bcrypt + JWT
- Reservation creation with date-overlap protection
- Guest reservation dashboard
- Contact/inquiry storage
- Admin statistics and booking/message API endpoints
- JSON persistence with no native database dependency
- Termux/Android-friendly setup

## Run locally

```bash
npm install
npm start
```

Open `http://127.0.0.1:3000`.

## Structure

```text
backend/server.js
frontend/index.html
frontend/css/style.css
frontend/js/app.js
data/db.json
package.json
README.md
```

## GitHub / deployment

The repository is GitHub-ready. GitHub Pages can host the static frontend, but it cannot execute the Express API. For the complete reservation system, deploy the Node API to a Node-compatible host and configure the frontend API base accordingly.

## Security note

Set `JWT_SECRET` to a strong private value before production deployment. The included JSON database is intended for a lightweight portfolio/demo deployment; production use should move persistence to a managed database.
