# Logistics Backend — API REST

API REST para gestión de logística terrestre y marítima.

## Stack
- **Node.js** + **Express**
- **Sequelize** ORM + **PostgreSQL**
- **JWT** para autenticación
- **bcryptjs** para hasheo de contraseñas

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de PostgreSQL

# 3. Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE logistics_db;"

# 4. Correr el script SQL para crear las tablas
psql -U postgres -d logistics_db -f ../init.sql

# 5. Iniciar el servidor en modo desarrollo
npm run dev
```

## Endpoints principales

### Auth
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/registro | Crear usuario |
| POST | /api/auth/login | Obtener token JWT |

### Recursos (requieren Bearer token)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/clientes | Listar clientes |
| POST | /api/clientes | Crear cliente |
| GET | /api/envios/terrestres | Listar envíos terrestres |
| POST | /api/envios/terrestres | Crear envío terrestre |
| GET | /api/envios/maritimos | Listar envíos marítimos |
| POST | /api/envios/maritimos | Crear envío marítimo |

> Los DELETE solo los puede ejecutar un usuario con rol `ADMIN`.

## Reglas de negocio implementadas

- Descuento 5% en envíos terrestres con más de 10 unidades
- Descuento 3% en envíos marítimos con más de 10 unidades
- Placa de vehículo: formato `AAA123`
- Número de flota: formato `AAA1234A`
- Número de guía: 10 caracteres alfanuméricos, único
- Cantidad de producto siempre mayor a 0

## Ejemplo de petición — crear envío terrestre

```bash
curl -X POST http://localhost:3000/api/envios/terrestres \
  -H "Authorization: Bearer <tu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "cliente_id": 1,
    "producto_id": 1,
    "bodega_id": 1,
    "cantidad_producto": 15,
    "precio_base": 100000,
    "placa_vehiculo": "ABC123",
    "numero_guia": "GUIA123456",
    "fecha_entrega": "2025-06-01"
  }'
```

El campo `precio_final` se calcula automáticamente:
- 15 unidades > 10 → `precio_final = 100000 * 0.95 = 95000`
