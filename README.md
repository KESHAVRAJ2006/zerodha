# Zerodha Clone

A full stack clone of Zerodha built with the MERN stack.

The project has 3 parts:

| Folder      | What it is                                   | Port |
| ----------- | -------------------------------------------- | ---- |
| `frontend`  | Landing website (home, about, pricing, signup) | 3000 |
| `dashboard` | Kite style trading dashboard                 | 3001 |
| `backend`   | Express + MongoDB API                        | 3002 |

## Features

- Landing pages - Home, About, Products, Pricing, Support
- Signup / Login (passwords are hashed using `passport-local-mongoose`)
- Dashboard with watchlist, holdings, positions, orders and funds
- Buy and sell stocks from the watchlist - holdings get updated automatically
- Charts for watchlist and holdings using Chart.js
- Sample holdings and positions are added to the database on the first run

## Tech used

- React, React Router, Bootstrap, Material UI, Chart.js, Axios
- Node.js, Express, MongoDB, Mongoose

## How to run

You need Node.js and MongoDB installed (or a MongoDB Atlas URL).

**1. Backend**

```bash
cd backend
npm install
npm start
```

Create a `.env` file inside `backend` if it's not there:

```
MONGO_URL=mongodb://127.0.0.1:27017/zerodha
PORT=3002
```

**2. Frontend**

```bash
cd frontend
npm install
npm start
```

**3. Dashboard**

```bash
cd dashboard
npm install
npm start
```

Open http://localhost:3000, create an account from the Signup page and you will be taken to the dashboard.

## API routes

| Method | Route           | Description                 |
| ------ | --------------- | --------------------------- |
| POST   | `/signup`       | create a new user           |
| POST   | `/login`        | login an existing user      |
| GET    | `/allHoldings`  | get all holdings            |
| GET    | `/allPositions` | get all positions           |
| GET    | `/allOrders`    | get all orders              |
| POST   | `/newOrder`     | place a buy / sell order    |
