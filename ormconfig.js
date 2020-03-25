module.exports = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: ["dist/**/*.entity.js"],
    ssl: true,
    logging: true,
    migrations: ["migrations/dist/*.js"],
    cli: {
        migrationsDir: "migrations"
    }
}