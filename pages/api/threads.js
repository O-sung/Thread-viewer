import mysql from 'mysql2/promise';

export default async function handler(req, res) {
    try {
        // Connect to database
        const connection = await mysql.createConnection(process.env.DATABASE_URL);

        // Fetch threads
        const [rows] = await connection.execute(
            `SELECT 
        author_username,
        summary,
        eli5_content,
        generated_thread,
        confidence_score,
        created_at
      FROM processed_tweets 
      WHERE validation_passed = 1
      ORDER BY created_at DESC
      LIMIT 20`
        );

        await connection.end();

        res.status(200).json({ threads: rows });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch threads' });
    }
}
