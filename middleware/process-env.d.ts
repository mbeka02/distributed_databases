declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string,
            NAIROBI_URL: string,
            MARIADB_HOST: string,
            MARIADB_PORT: number,
            MARIADB_USER: string,
            MARIADB_PASSWORD: string,
            MARIADB_CONNECTION_LIMIT: number,
            MYSQL_HOST: string,
            MYSQL_USER: string,
            MYSQL_DATABASE: string,
            MYSQL_PORT: number,
            MYSQL_PASSWORD: string
        }
    }
}

export {}