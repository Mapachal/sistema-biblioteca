/**
 * ═══════════════════════════════════════════════════════════════
 * SCRIPT DE DATOS DE PRUEBA - SISTEMA DE BIBLIOTECA
 * ═══════════════════════════════════════════════════════════════
 * 
 * Ejecutar: node scripts/seed.js
 * 
 * Este script puebla la base de datos con:
 * - 2 administradores
 * - 5 usuarios normales
 * - 10 libros en diferentes categorías
 * - 3 préstamos de ejemplo en diferentes estados
 */

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const conexion = require('../config/database');
const Usuario = require('../models/Usuario');
const Libro = require('../models/Libro');
const Prestamo = require('../models/Prestamo');

async function seed() {
  try {
    console.log('🌱 Iniciando seed de datos...');
    
    // Sincronizar modelos
    await conexion.sync({ force: true });
    console.log('✅ Tablas sincronizadas');

    // ────── CREAR USUARIOS ──────
    console.log('\n📝 Creando usuarios...');
    const usuarios = await Promise.all([
      // Admins
      Usuario.create({
        nombre: 'Admin Principal',
        correo: 'admin@biblioteca.com',
        contraseña: await bcrypt.hash('admin123', 10),
        rol: 'admin'
      }),
      Usuario.create({
        nombre: 'Gerente Biblioteca',
        correo: 'gerente@biblioteca.com',
        contraseña: await bcrypt.hash('gerente123', 10),
        rol: 'admin'
      }),
      // Usuarios normales
      Usuario.create({
        nombre: 'Juan Pérez',
        correo: 'juan@example.com',
        contraseña: await bcrypt.hash('juan123', 10),
        rol: 'usuario'
      }),
      Usuario.create({
        nombre: 'María García',
        correo: 'maria@example.com',
        contraseña: await bcrypt.hash('maria123', 10),
        rol: 'usuario'
      }),
      Usuario.create({
        nombre: 'Carlos López',
        correo: 'carlos@example.com',
        contraseña: await bcrypt.hash('carlos123', 10),
        rol: 'usuario'
      }),
      Usuario.create({
        nombre: 'Ana Rodríguez',
        correo: 'ana@example.com',
        contraseña: await bcrypt.hash('ana123', 10),
        rol: 'usuario'
      }),
      Usuario.create({
        nombre: 'Pedro Martínez',
        correo: 'pedro@example.com',
        contraseña: await bcrypt.hash('pedro123', 10),
        rol: 'usuario'
      })
    ]);
    console.log(`✅ ${usuarios.length} usuarios creados`);

    // ────── CREAR LIBROS ──────
    console.log('\n📚 Creando libros...');
    const libros = await Promise.all([
      Libro.create({
        titulo: 'Cien años de soledad',
        autor: 'Gabriel García Márquez',
        categoria: 'Novela',
        cantidad: 3
      }),
      Libro.create({
        titulo: 'Don Quijote',
        autor: 'Miguel de Cervantes',
        categoria: 'Aventura',
        cantidad: 2
      }),
      Libro.create({
        titulo: '1984',
        autor: 'George Orwell',
        categoria: 'Ciencia Ficción',
        cantidad: 1
      }),
      Libro.create({
        titulo: 'El Quiebre',
        autor: 'Fernando Vallejo',
        categoria: 'Novela Negra',
        cantidad: 4
      }),
      Libro.create({
        titulo: 'La Casa de Espíritus',
        autor: 'Isabel Allende',
        categoria: 'Novela',
        cantidad: 2
      }),
      Libro.create({
        titulo: 'Harry Potter',
        autor: 'J.K. Rowling',
        categoria: 'Fantasía',
        cantidad: 5
      }),
      Libro.create({
        titulo: 'El Código Da Vinci',
        autor: 'Dan Brown',
        categoria: 'Misterio',
        cantidad: 3
      }),
      Libro.create({
        titulo: 'La Historia del Tiempo',
        autor: 'Stephen Hawking',
        categoria: 'Ciencia',
        cantidad: 2
      }),
      Libro.create({
        titulo: 'El Principito',
        autor: 'Antoine de Saint-Exupéry',
        categoria: 'Fantasía',
        cantidad: 6
      }),
      Libro.create({
        titulo: 'Orgullo y Prejuicio',
        autor: 'Jane Austen',
        categoria: 'Romance',
        cantidad: 2
      })
    ]);
    console.log(`✅ ${libros.length} libros creados`);

    // ────── CREAR PRÉSTAMOS DE EJEMPLO ──────
    console.log('\n📋 Creando préstamos de ejemplo...');
    
    // Préstamo 1: PENDIENTE (esperando aprobación)
    const prestamo1 = await Prestamo.create({
      usuarioId: usuarios[2].id, // Juan Pérez
      libroId: libros[0].id,     // Cien años de soledad
      estado: 'pendiente',
      codigoPrestamo: crypto.randomBytes(8).toString('hex').toUpperCase()
    });

    // Préstamo 2: PRESTADO (aprobado)
    const prestamo2 = await Prestamo.create({
      usuarioId: usuarios[3].id, // María García
      libroId: libros[1].id,     // Don Quijote
      estado: 'prestado',
      codigoPrestamo: crypto.randomBytes(8).toString('hex').toUpperCase(),
      fechaAprobacion: new Date(),
      fechaLimite: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 días
    });

    // Préstamo 3: DEVUELTO (completado)
    const fechaSolicitud = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fechaAprobacion = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
    const fechaDevolucion = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    
    const prestamo3 = await Prestamo.create({
      usuarioId: usuarios[4].id, // Carlos López
      libroId: libros[5].id,     // Harry Potter
      estado: 'devuelto',
      codigoPrestamo: crypto.randomBytes(8).toString('hex').toUpperCase(),
      fechaSolicitud,
      fechaAprobacion,
      fechaLimite: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
      fechaDevolucion
    });

    console.log(`✅ 3 préstamos de ejemplo creados`);

    // ────── RESUMEN ──────
    console.log('\n' + '═'.repeat(60));
    console.log('🎉 DATOS DE PRUEBA CARGADOS EXITOSAMENTE');
    console.log('═'.repeat(60));
    console.log('\n📊 RESUMEN:');
    console.log(`   • ${usuarios.length} usuarios creados`);
    console.log(`   • ${libros.length} libros agregados al catálogo`);
    console.log(`   • 3 préstamos de ejemplo en diferentes estados\n`);

    console.log('👤 CUENTAS DE PRUEBA:');
    console.log('\n   ADMINISTRADORES:');
    console.log('   • Email: admin@biblioteca.com | Contraseña: admin123');
    console.log('   • Email: gerente@biblioteca.com | Contraseña: gerente123');
    console.log('\n   USUARIOS:');
    usuarios.slice(2).forEach(u => {
      const pass = u.correo.split('@')[0] + '123';
      console.log(`   • Email: ${u.correo} | Contraseña: ${pass}`);
    });

    console.log('\n📋 PRÉSTAMOS CREADOS:');
    console.log(`\n   1. PENDIENTE (Juan Pérez solicitó "Cien años de soledad")`);
    console.log(`      Código: ${prestamo1.codigoPrestamo}`);
    console.log(`      Estado: Esperando aprobación del administrador`);
    console.log(`\n   2. PRESTADO (María García tiene "Don Quijote")`);
    console.log(`      Código: ${prestamo2.codigoPrestamo}`);
    console.log(`      Estado: Aprobado, debe devolver en 14 días`);
    console.log(`\n   3. DEVUELTO (Carlos López devolvió "Harry Potter")`);
    console.log(`      Código: ${prestamo3.codigoPrestamo}`);
    console.log(`      Estado: Completado y devuelto`);

    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('   1. Inicia el servidor: npm start');
    console.log('   2. Accede a http://localhost:3000');
    console.log('   3. Prueba con las credenciales anteriores');
    console.log('   4. Usa test.http para probar la API');

    console.log('\n' + '═'.repeat(60) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    process.exit(1);
  }
}

seed();
