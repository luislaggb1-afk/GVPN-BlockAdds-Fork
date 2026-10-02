# GVPN — Sistema de Diseño & Arquitectura Visual

Documentación integral del lenguaje visual, componentes, tokens de color, tipografía y reglas de interfaz de usuario de **GVPN Bloqueador & Cortafuegos**.

---

## 1. Identidad Visual & Emblema Oficial (`GVPN.svg`)

- **Emblema Central de la Aplicación (`GvpnLogo`)**:
  - Escudo protector con borde perimetral en blanco sobre el cual rota la inscripción tipográfica en negrita **`GVPN GVPN GVPN...`**.
  - Superficie interior en azul lavanda claro (`#a8bff8`) seccionada en 4 cuadrantes por una cruz simétrica central en azul profundo (`#000e1f`).
  - Acentos orbitales curvos con marcadores cuadrados superior derecho e inferior izquierdo.
  - Implementado en:
    - **Barra Flotante Superior** (`Header.tsx` junto al título `GVPN`).
    - **Botón de Encendido / Activación Central** (`PowerButton.tsx` en estado **ACTIVO** con micro-escalado interactivo).
    - **Favicon y manifiesto PWA** (`/public/GVPN.svg`).

---

## 2. Filosofía de Diseño

- **Enfoque Android Moderno (Material You / Expressive Dark)**: Barras y píldoras flotantes (*floating pills*) con desenfoque de fondo (*backdrop blur*), bordes sutiles y sombras de elevación profunda.
- **Efecto de Desenfoque Sutil (*Backdrop Blur 5px*)**: Todas las tarjetas y módulos aplican un efecto de desenfoque refinado (`backdrop-blur-[5px]`) con opacidad calculada (`bg-[#a8bff8]/88`) sobre el fondo oscuro envolvente (`#0B1120`).
- **Iconografía con Detalles Internos Contrastantes**:
  - **Ajustes (`DetailedSettingsIcon`)**: Engranaje sólido con anillo concéntrico interior, 4 rayos estructurales y orificio de eje en contraste.
  - **Registros (`LogFileIcon`)**: Hoja de papel con pliegue de esquina y líneas oscuras de registro.
  - **Módulos de Estadísticas**: Iconos 100% personalizados con cuadrículas, exclamaciones, manecillas y selectores.
- **Animaciones y Transiciones Fluídas**:
  - Transición de pantalla tipo disolución suave (*soft dissolve fade-in/out* - `animate-tab-enter`).
  - Animación elástica del bloque activo en la barra de navegación inferior (*navbar*).

---

## 3. Paleta de Colores & Tokens

| Token | Hex | Uso en la Aplicación |
| :--- | :--- | :--- |
| **Canvas Background** | `#0B1120` | Fondo general de la aplicación y pantallas modales. |
| **Pill Background** | `#203457` / `rgba(32,52,87,0.95)` | Barras flotantes de encabezado superior e inferior (*navbar*). |
| **Card Surface (Primario)** | `#a8bff8` / `rgba(168,191,248,0.88)` | Superficie de todos los módulos de estadísticas, tarjetas de ajuste y filtros (con `backdrop-blur-[5px]`). |
| **Card Foreground (Texto/Iconos)** | `#000e1f` | Tipografía principal, títulos, contadores e iconos dentro de las tarjetas. |
| **Card Secondary Text** | `#000e1f/80` (80% opacidad) | Subtítulos, descripciones secundarias y etiquetas de estado. |
| **Accent Text / Highlights** | `#F8FAFC` | Texto en la barra flotante de encabezado y títulos de vista principal. |
| **Muted Text** | `#94A3B8` | Elementos inactivos en barra de navegación y campos secundarios. |
| **Input Surface** | `#4a6195` / `rgba(74,97,149,0.88)` | Cajas de búsqueda en Firewall, Filtros y Registros DNS con `backdrop-blur-[5px]`. |

---

## 4. Barras de Navegación Flotantes (*Pills*)

### 4.1. Encabezado Superior (`Header.tsx` & `App.tsx` overlay)
- **Contenedor**: Píldora redondeada (`rounded-full`) centrada con `max-w-lg`.
- **Efectos**: `bg-[#203457]/95 border border-[#203457] backdrop-blur-2xl shadow-2xl min-h-[44px]`.
- **Alineación Vertical & Centrado**: Padding simétrico `px-3.5 py-1.5` con alineación vertical `items-center`. En modales y pantallas superpuestas (como *Modos de Operación*), el título queda exactamente centrado en la píldora.
- **Separación Superior**: Espaciado generoso y armónico entre la barra y el contenido inferior.

### 4.2. Barra de Navegación Inferior (`BottomPillNav.tsx`)
- **Contenedor**: Flotante inferior con elevación `bottom-3`.
- **Orden de las 5 Pestañas**:
  1. **Inicio** (`Shield`): Potencia, 6 métricas, gráfica de actividad, ranking y bloqueados recientes.
  2. **Filtros** (`Filter`): Listas públicas y personalizadas con control de reglas.
  3. **Firewall** (`Flame`): Control por aplicación de Wi-Fi, Datos Móviles y horarios.
  4. **Registros** (`LogFileIcon`): Hoja de papel rellena con líneas oscuras simulando texto.
  5. **Ajustes** (`DetailedSettingsIcon`): Engranaje detallado con rayos y anillo interior.

---

## 5. Módulos de la Pantalla Principal (`HomeScreen.tsx`)

### 5.1. Botón de Potencia Central (`PowerButton.tsx`)
- En estado activo muestra el emblema vectorial **`GvpnLogo`** con la etiqueta **ACTIVO** y anillo con animación de respiración.

### 5.2. Bloque de Estadísticas en Cuadrícula (6 Módulos con Iconos Únicos - `StatCards.tsx`)
1. **Tasa de Bloqueo**: `DetailedBarChartIcon` (Gráfica de barras de 3 niveles con base).
2. **Bloqueos**: `DetailedShieldAlertIcon` (Escudo sólido con exclamación interior en `#a8bff8`).
3. **Anuncios Bloqueados**: `DetailedAdBlockIcon` (Pantalla de anuncios con aspa diagonal 'X').
4. **Reglas de Filtro**: `DetailedFilterRulesIcon` (Regulador de listas con guías y selectores).
5. **Datos Ahorrados**: `DetailedHardDriveIcon` (Unidad de almacenamiento con bahía y luces de actividad).
6. **Tiempo Protegido**: `DetailedClockIcon` (Reloj detallado con manecillas en contraste).
