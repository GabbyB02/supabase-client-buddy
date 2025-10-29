# Mini CRM - Sistema de Gestión de Clientes

Sistema interno de gestión de clientes (CRM) desarrollado con React, TypeScript, Tailwind CSS y Supabase.

## 🚀 Características

- ✅ **CRUD Completo**: Crear, leer, actualizar y eliminar clientes
- ✅ **Gestión de Estados**: Activar/desactivar clientes con un solo clic
- ✅ **Búsqueda y Filtros**: Buscar por nombre/email y filtrar por estado
- ✅ **Paginación**: Navegación eficiente para grandes volúmenes de datos
- ✅ **Validaciones**: Validación de formularios con Zod
- ✅ **Feedback Visual**: Estados de carga, mensajes de éxito/error
- ✅ **Confirmaciones**: Diálogos de confirmación antes de acciones críticas
- ✅ **Diseño Responsive**: Interfaz adaptada a móviles y escritorio

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase (o usar Lovable Cloud - ya configurado)

## 🛠️ Instalación Local

1. **Clonar el repositorio**

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

El proyecto ya está configurado con Lovable Cloud (Supabase integrado). Si deseas usar tu propia instancia de Supabase, crea un archivo `.env` basándote en `.env.example`:

```bash
cp .env.example .env
```

Luego edita `.env` con tus credenciales de Supabase.

4. **Ejecutar las migraciones de base de datos**

La tabla `clients` se crea automáticamente en Lovable Cloud. Si usas tu propia base de datos Supabase, ejecuta el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Ver sección "Estructura de la Base de Datos" más abajo
```

5. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 🗄️ Estructura de la Base de Datos

### Tabla `clients`

```sql
-- Create clients table
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (internal team tool)
CREATE POLICY "Anyone can view clients"
ON public.clients
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create clients"
ON public.clients
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update clients"
ON public.clients
FOR UPDATE
USING (true);

CREATE POLICY "Anyone can delete clients"
ON public.clients
FOR DELETE
USING (true);

-- Create index for email lookups
CREATE INDEX idx_clients_email ON public.clients(email);

-- Create index for status filtering
CREATE INDEX idx_clients_status ON public.clients(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

### Esquema de la Tabla

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| `id` | UUID | Identificador único | Primary Key, auto-generado |
| `name` | TEXT | Nombre del cliente | NOT NULL |
| `email` | TEXT | Email del cliente | NOT NULL |
| `phone` | TEXT | Teléfono del cliente | Nullable |
| `status` | TEXT | Estado del cliente | 'active' o 'inactive', default: 'active' |
| `created_at` | TIMESTAMPTZ | Fecha de creación | NOT NULL, auto-generado |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización | NOT NULL, auto-actualizado |

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── clients/              # Componentes específicos de clientes
│   │   ├── ClientsTable.tsx
│   │   ├── CreateClientDialog.tsx
│   │   ├── EditClientDialog.tsx
│   │   ├── DeleteClientDialog.tsx
│   │   ├── ClientsFilters.tsx
│   │   └── ClientsPagination.tsx
│   └── ui/                   # Componentes UI reutilizables (shadcn)
├── hooks/
│   └── useClients.ts         # Hook personalizado para operaciones de clientes
├── lib/
│   ├── supabase/
│   │   └── clientsService.ts # Servicio para interactuar con Supabase
│   └── validations/
│       └── client.ts         # Esquemas de validación con Zod
├── pages/
│   └── Index.tsx             # Página principal del CRM
└── integrations/
    └── supabase/             # Configuración de Supabase (auto-generado)
```

## 🏗️ Decisiones Técnicas

### Arquitectura y Separación de Responsabilidades

1. **Capa de Servicios (`lib/supabase/clientsService.ts`)**
   - Encapsula todas las operaciones CRUD con Supabase
   - Proporciona funciones tipadas con interfaces TypeScript
   - Maneja paginación, filtros y búsqueda
   - Facilita testing y mantenimiento

2. **Hooks Personalizados (`hooks/useClients.ts`)**
   - Usa React Query para gestión de estado del servidor
   - Manejo automático de cache y revalidación
   - Estados de carga y error
   - Optimistic updates
   - Notificaciones toast integradas

3. **Componentes Pequeños y Focalizados**
   - Cada diálogo/modal en su propio archivo
   - Componentes UI reutilizables (shadcn)
   - Props bien tipadas con TypeScript
   - Responsabilidad única por componente

### Validaciones

- **Zod** para validación de esquemas con tipos inferidos
- Validación en tiempo real en formularios con `react-hook-form`
- Mensajes de error personalizados en español
- Validación de email con formato correcto
- Validación de teléfono: opcional, pero si se ingresa debe ser válido (min 7 dígitos)

### Gestión de Estado

- **React Query** (TanStack Query) para estado del servidor
- Cache automático y revalidación inteligente
- Mutaciones optimistas para mejor UX
- Estado local con `useState` para filtros y paginación

### UX/UI

- **Tailwind CSS** con sistema de diseño personalizado
- Componentes de **shadcn/ui** para consistencia
- Feedback inmediato en todas las acciones
- Confirmación antes de eliminar
- Estados de carga visibles
- Diseño responsive (mobile-first)

### Seguridad

- Row Level Security (RLS) habilitado en Supabase
- Políticas permisivas para herramienta interna (sin autenticación requerida)
- Validación client-side y server-side
- Índices en campos frecuentemente consultados

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Vista previa de build de producción

# Utilidades
npm run lint         # Ejecuta ESLint
```

## 📝 Uso de la Aplicación

### Crear Cliente
1. Clic en "Nuevo Cliente"
2. Completar formulario (nombre* y email* son obligatorios)
3. Clic en "Crear Cliente"

### Editar Cliente
1. Clic en el ícono de editar (lápiz) en la fila del cliente
2. Modificar campos necesarios
3. Clic en "Guardar Cambios"

### Cambiar Estado
- Clic en el ícono de power para alternar entre activo/inactivo

### Eliminar Cliente
1. Clic en el ícono de eliminar (papelera)
2. Confirmar eliminación en el diálogo

### Buscar y Filtrar
- Usar el campo de búsqueda para filtrar por nombre o email
- Usar el selector de estado para filtrar por activo/inactivo/todos

### Navegación
- Usar los botones "Anterior" y "Siguiente" para navegar entre páginas

## 🔐 Variables de Entorno

El proyecto usa las siguientes variables (ya configuradas en Lovable Cloud):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

## 🚀 Despliegue

### Con Lovable
1. Clic en "Publish" en la esquina superior derecha
2. Tu app estará en vivo automáticamente

### Otros Proveedores
El proyecto está optimizado para Vite y puede desplegarse en:
- Vercel
- Netlify
- Cloudflare Pages
- Cualquier hosting que soporte aplicaciones estáticas

## 🧪 Testing

El proyecto está estructurado para facilitar testing:

### Testing Manual
1. Crear varios clientes
2. Editar información
3. Cambiar estados
4. Eliminar clientes
5. Probar búsqueda y filtros
6. Verificar paginación

### Preparado para Tests Automatizados
- Hooks aislados y testeables
- Servicios desacoplados
- Componentes con responsabilidad única

## 📚 Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (via Lovable Cloud)
- **Database**: PostgreSQL (Supabase)
- **Routing**: React Router v6

## 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño basado en tokens CSS con paleta de colores profesional:

- **Primary**: Azul vibrante para acciones principales
- **Success**: Verde para estados activos
- **Warning**: Amarillo para alertas
- **Destructive**: Rojo para acciones destructivas
- **Muted**: Grises para contenido secundario

Todos los colores usan HSL para mejor control y están definidos en `src/index.css`.

## 🔄 Migraciones Futuras

Para añadir autenticación en el futuro:

1. Habilitar auth en Supabase
2. Actualizar políticas RLS para filtrar por `user_id`
3. Añadir columna `user_id` a tabla `clients`
4. Implementar login/logout en frontend
5. Proteger rutas con guards de autenticación

## 📞 Soporte

Para problemas o preguntas:
- Revisar la documentación de Lovable: https://docs.lovable.dev/
- Revisar la documentación de Supabase: https://supabase.com/docs

## 📄 Licencia

Este proyecto fue generado con [Lovable](https://lovable.dev)
