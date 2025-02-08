# Steps to Start the Project

## 1. Install Prerequisites

    Make sure you have the following installed:

    - [Node.js](https://nodejs.org/)
    - [PostgreSQL](https://www.postgresql.org/) (or use an online PostgreSQL service)
    - [Git](https://git-scm.com/)

## 2. Clone the Repository

```bash
    git clone https://github.com/dev-satri/map.git
    cd beautiful map
```

## 3.Install Project dependencies

    `npm install`

## 4. Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

````env
DATABASE_URL="postgresql://postgres:yourdbpass@localhost:5432/mydb?schema=public"
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here ```





````

## 5.Run prisma migration

    npx prisma migrate dev --name init

## 6.Start development server

    npm run dev
