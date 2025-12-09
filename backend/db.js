import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host: "localhost",
    user: "vivexalapa_user",
    password: "12345",
    database: "vivexalapa_db"
});