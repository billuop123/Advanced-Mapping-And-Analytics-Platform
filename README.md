
# Project Setup 



# Steps to Start the Project

#### Manual Run
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

## 3. Install Project dependencies

    npm install

## 4. Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

````env
DATABASE_URL="postgresql://postgres:yourdbpass@localhost:5432/mydb?schema=public"
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here ```

````

## 5. Run prisma migration

    npx prisma migrate dev --name init

## 6. Start development server

    npm run dev

## Getting Started with Docker

## Prerequisites
Make sure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)

1. **Clone the Repository:**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **Environment Variables:**
Update the `DATABASE_URL` and any other necessary environment variables in the `docker-compose.yml` file.

Example:
```yaml
environment:
  - DATABASE_URL=postgresql://postgres:mrcool10@postgres:5432/somedb?schema=public
```

3. **Run Docker Compose:**
```bash
docker-compose up --build
```
This will build and start both the Postgres and user app containers.

4. **Access the Services:**
- **Postgres:** Accessible at `localhost:5432` with the credentials:
  - Username: `postgres`
  - Password: `mrcool10`
  - Database: `somedb`
- **User App:** Accessible at `http://localhost:3001`

5. **Access Postgres CLI (Optional):**
```bash
docker exec -it <postgres-container-id> psql -U postgres -d somedb
```
To find the container ID:
```bash
docker ps
```

6. **Shut Down:**
```bash
docker-compose down
```
This stops and removes the containers but preserves data in the volume.

## Troubleshooting
- Ensure Docker is running.
- If ports are already in use, modify the `ports` section in `docker-compose.yml`.
- For connection errors, ensure the `DATABASE_URL` is correct.

---

Now you're ready to run the project with Docker! 🐳 Let me know if you'd like to add more details or handle environment files.

