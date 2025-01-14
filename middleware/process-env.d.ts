//Process.env always contains strings even for numeric values -Anthony
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      NAIROBI_URL: string;
      MARIADB_HOST: string;
      MARIADB_PORT: string;
      MARIADB_USER: string;
      MARIADB_PASSWORD: string;
      MARIADB_CONNECTION_LIMIT: string;
      MYSQL_HOST: string;
      MYSQL_USER: string;
      MYSQL_DATABASE: string;
      MYSQL_PORT: string;
      MYSQL_PASSWORD: string;
    }
  }
}

export { };
