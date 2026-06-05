const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    console.log('🔧 Creando base de datos...');
    
    // Conectar a MySQL sin especificar BD
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Crear BD
    await connection.query('CREATE DATABASE IF NOT EXISTS biblioteca');
    console.log('✅ Base de datos "biblioteca" creada');
    
    // Cerrar conexión
    await connection.end();
    
    console.log('✅ Listo para ejecutar npm start');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createDatabase();
