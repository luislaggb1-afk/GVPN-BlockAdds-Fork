# GVPN - Bloqueador de Anuncios y VPN Seguro

**GVPN** es una aplicación moderna de bloqueo de anuncios, rastreadores y cortafuegos para Android y entornos multiplataforma, reescrita en React con TypeScript y Tailwind CSS.

## 🚀 Características Principales

- **3 Modos de Operación**:
  - **Básico (VPN Local)**: Filtrado DNS completo mediante la interfaz local `VpnService` de Android sin requerir permisos especiales.
  - **Shizuku (API Elevada ADB)**: Integración con el framework Shizuku para aplicar directivas de red del sistema y DNS privado sin Root, manteniendo la ranura de VPN libre para conexiones externas (WireGuard, Tailscale).
  - **Root (Proxy iptables)**: Redirección nativa de paquetes en el kernel mediante iptables con mínimo consumo de batería.

- **Diseño Navy Blue & Navbar Estilo Pill**:
  - Paleta base en azul marino profundo (*Navy Blue*), con acabados mate de alta gama y sin efectos de neón invasivos.
  - Barra de navegación inferior flotante con formato *pill* (cápsula) para un acceso rápido con una sola mano.

- **Filtrado Avanzado**:
  - Soporte integrado de listas de filtros populares (StevenBlack Unified, AdGuard DNS, EasyList, EasyPrivacy, OISD, URLhaus Malware, Phishing Army).
  - Gestor de reglas personalizadas con sintaxis compatible con AdGuard y uBlock Origin (`||dominio.com^`, `@@||permitido.org^`, `*.subdominio.com`, comentarios).
  - Gestión completa de dominios en Lista Blanca y Lista de Bloqueo.

- **Cortafuegos por Aplicación**:
  - Bloqueo selectivo de conectividad por Wi-Fi y Datos Móviles.
  - Horarios de bloqueo programables por aplicación.

- **Túneles WireGuard**:
  - Importación y gestión de archivos `.conf` de WireGuard con soporte para Split DNS y exclusión de LAN.

- **Filtrado Cosmético HTTPS**:
  - Generación y descarga de certificados Root CA locales para ocultación de anuncios y banners residuales en navegadores compatibles.

- **Métricas y Registros en Tiempo Real**:
  - Gráficos interactivos de 24 horas y 7 días.
  - Visor detallado de consultas DNS en vivo con información de latencia, tipo de consulta (A, AAAA, HTTPS) e IP resuelta.
  - Cálculo de ahorro de ancho de banda y tiempo activo.

## 🛠️ Tecnologías

- **React 19 & TypeScript**
- **Vite & Tailwind CSS**
- **Lucide Icons**
- **Almacenamiento Local Reactivo**

## 📄 Licencia

Este proyecto está bajo la Licencia Pública General GNU v3.0 (GPL-3.0).
