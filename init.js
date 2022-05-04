const { query } = require('./database');

async function run() {
    try {
        // Step 1: Create DB (if it doesn't exist already);
        const db = await query("CREATE DATABASE IF NOT EXISTS ghost");

        // Step 2: Create User table (if it doesn't exist already);
        const User = await query("" +
            "CREATE TABLE if not exists User" +
            "(" +
                "id INT UNSIGNED NOT NULL AUTO_INCREMENT," +
                "name VARCHAR(255) NOT NULL," +
                "photoUrl VARCHAR(255) NOT NULL," +
                "PRIMARY KEY (id)" +
            ");");

        // Step 3: Create User table (if it doesn't exist already);
        const Comment = await query("" +
            "CREATE TABLE if not exists Comment" +
            "(" +
            "id INT UNSIGNED NOT NULL AUTO_INCREMENT," +
            "userId INT UNSIGNED NOT NULL," +
            "voteCount INT UNSIGNED NOT NULL DEFAULT 0," +
            "parentCommentId INT UNSIGNED DEFAULT NULL," +
            "text VARCHAR(1000) NOT NULL," +
            "date TIMESTAMP NULL DEFAULT current_timestamp," +
            "PRIMARY KEY (id)," +
            "FOREIGN KEY (`parentCommentId`) REFERENCES `Comment` (`id`)," +
            "FOREIGN KEY (`userId`) REFERENCES `User` (`id`)" +
            ");");
    } catch (error) {
        throw error;
    }
}

run()
    .then(() => {
        console.log('DB initialized');
    })
    .catch((error) => {
        console.log('Error with DB initialization', error);
    })
