const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GVPN - Bloqueador de Anuncios y VPN Seguro</title>
  <meta name="description" content="Android Kotlin & Jetpack Compose secure ad blocker and VPN client with DNS filtering, WireGuard, firewall protection, and custom blocklists.">
  <meta property="og:title" content="GVPN - Bloqueador de Anuncios y VPN Seguro">
  <meta property="og:description" content="Android Kotlin & Jetpack Compose secure ad blocker and VPN client with DNS filtering, WireGuard, firewall protection, and custom blocklists.">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @keyframes pulse-ring {
      0% { transform: scale(0.95); opacity: 0.8; }
      50% { transform: scale(1.08); opacity: 0.4; }
      100% { transform: scale(0.95); opacity: 0.8; }
    }
    .pulse-glow {
      animation: pulse-ring 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    .custom-scroll::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #374151;
      border-radius: 4px;
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans select-none antialiased">

  <!-- Top App Bar Header -->
  <header class="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50 px-4 py-3">
    <div class="max-w-4xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/40">
          <i class="fa-solid fa-shield-halved text-white text-lg"></i>
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h1 class="font-bold text-base tracking-wide text-white">GVPN Shield</h1>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-400 border border-emerald-500/30">v6.5.2 (Kotlin)</span>
          </div>
          <p id="headerStatus" class="text-xs text-emerald-400 font-medium">● Activo • Cloudflare DNS Encrypted</p>
        </div>
      </div>
      
      <div class="flex items-center space-x-2">
        <a href="/download/app-debug.apk" download class="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition">
          <i class="fa-solid fa-download"></i>
          <span>Descargar APK (15.7 MB)</span>
        </a>
      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col items-center">

    <!-- Screen Tabs Content -->
    <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col mb-6">
      
      <!-- Android Frame Notch / Status Header -->
      <div class="px-5 pt-3 pb-2 flex justify-between items-center text-[11px] text-slate-400 border-b border-slate-800/60">
        <span id="currentTime" class="font-semibold text-slate-300">12:00</span>
        <div class="flex items-center space-x-2">
          <i id="vpnIcon" class="fa-solid fa-key text-emerald-400 text-[10px]"></i>
          <i class="fa-solid fa-wifi text-[10px]"></i>
          <i class="fa-solid fa-battery-full text-[10px]"></i>
        </div>
      </div>

      <!-- Tab View: Estado (Home) -->
      <div id="viewHome" class="p-5 flex flex-col items-center">
        <!-- Status Pill -->
        <div id="statusBadge" class="flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium mb-6">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span id="statusText">Protección y Filtrado Activos</span>
        </div>

        <!-- Big Interactive Power Switch Button -->
        <div class="relative my-2">
          <div id="glowRing" class="absolute -inset-2 rounded-full bg-emerald-500/20 pulse-glow"></div>
          <button id="powerBtn" onclick="toggleVPN()" class="relative w-40 h-40 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700 border-4 border-emerald-400/50 flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-950/80 transition-all transform active:scale-95 focus:outline-none">
            <i id="powerIcon" class="fa-solid fa-power-off text-5xl mb-2"></i>
            <span id="powerLabel" class="text-xs font-bold tracking-widest uppercase">CONECTADO</span>
          </button>
        </div>

        <!-- Connection IP info -->
        <div class="text-center my-4">
          <p id="tunnelSub" class="text-xs text-slate-400">Túnel WireGuard cifrado</p>
          <p id="ipDisplay" class="text-sm font-semibold text-slate-200">10.8.0.2 • DNS Seguro</p>
        </div>

        <!-- Stats Grid (4 Cards) -->
        <div class="grid grid-cols-2 gap-3 w-full my-2">
          <!-- Blocked Ads Card -->
          <div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3.5 flex flex-col justify-between">
            <div class="flex items-center space-x-2 text-emerald-400 mb-2">
              <div class="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <i class="fa-solid fa-ban text-xs"></i>
              </div>
              <span class="text-[11px] font-medium text-slate-400">Anuncios</span>
            </div>
            <div id="statBlocked" class="text-2xl font-bold text-white">1,489</div>
            <span class="text-[10px] text-emerald-400 font-medium">Bloqueados hoy</span>
          </div>

          <!-- Data Saved Card -->
          <div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3.5 flex flex-col justify-between">
            <div class="flex items-center space-x-2 text-blue-400 mb-2">
              <div class="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <i class="fa-solid fa-chart-pie text-xs"></i>
              </div>
              <span class="text-[11px] font-medium text-slate-400">Ahorro</span>
            </div>
            <div id="statData" class="text-2xl font-bold text-white">186.4 MB</div>
            <span class="text-[10px] text-blue-400 font-medium">Ancho de banda</span>
          </div>

          <!-- Active Requests -->
          <div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3.5 flex flex-col justify-between">
            <div class="flex items-center space-x-2 text-purple-400 mb-2">
              <div class="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <i class="fa-solid fa-network-wired text-xs"></i>
              </div>
              <span class="text-[11px] font-medium text-slate-400">Consultas</span>
            </div>
            <div id="statRequests" class="text-2xl font-bold text-white">2,840</div>
            <span class="text-[10px] text-purple-400 font-medium">DNS filtrados</span>
          </div>

          <!-- Latency -->
          <div class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3.5 flex flex-col justify-between">
            <div class="flex items-center space-x-2 text-amber-400 mb-2">
              <div class="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <i class="fa-solid fa-bolt text-xs"></i>
              </div>
              <span class="text-[11px] font-medium text-slate-400">Latencia</span>
            </div>
            <div id="statLatency" class="text-2xl font-bold text-white">12 ms</div>
            <span class="text-[10px] text-emerald-400 font-medium">Ultra rápido</span>
          </div>
        </div>

        <!-- Live Activity Feed -->
        <div class="w-full mt-4 bg-slate-950/60 border border-slate-800 rounded-2xl p-3">
          <div class="flex justify-between items-center mb-2.5 px-1">
            <h3 class="text-xs font-bold text-slate-300">Actividad de Bloqueo en Tiempo Real</h3>
            <span class="text-[10px] text-emerald-400 font-medium">En vivo</span>
          </div>
          <div id="activityLogs" class="space-y-2 max-h-36 overflow-y-auto custom-scroll text-xs">
            <div class="flex items-center justify-between py-1 border-b border-slate-800/60">
              <div class="flex items-center space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span class="font-mono text-slate-300 text-[11px]">googleads.g.doubleclick.net</span>
              </div>
              <span class="text-[10px] text-slate-500">hace 2s</span>
            </div>
            <div class="flex items-center justify-between py-1 border-b border-slate-800/60">
              <div class="flex items-center space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span class="font-mono text-slate-300 text-[11px]">analytics.tiktok.com</span>
              </div>
              <span class="text-[10px] text-slate-500">hace 5s</span>
            </div>
            <div class="flex items-center justify-between py-1">
              <div class="flex items-center space-x-2">
                <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span class="font-mono text-slate-300 text-[11px]">telemetry.sdk.unity.com</span>
              </div>
              <span class="text-[10px] text-slate-500">hace 11s</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab View: DNS -->
      <div id="viewDns" class="p-5 hidden flex-col">
        <h2 class="text-base font-bold text-white mb-1">Servidores DNS</h2>
        <p class="text-xs text-slate-400 mb-4">Selecciona el proveedor DNS para filtrado upstream y cifrado DNS-over-HTTPS (DoH).</p>
        
        <div class="space-y-2.5">
          <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/70 border border-emerald-500/60 cursor-pointer">
            <div class="flex items-center space-x-3">
              <input type="radio" name="dns" checked class="text-emerald-500 focus:ring-0">
              <div>
                <div class="text-xs font-bold text-slate-200">Cloudflare (1.1.1.1)</div>
                <div class="text-[11px] text-slate-400">Privacidad y alta velocidad • 11ms</div>
              </div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-semibold border border-emerald-500/30">Activo</span>
          </label>

          <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
            <div class="flex items-center space-x-3">
              <input type="radio" name="dns" class="text-emerald-500 focus:ring-0">
              <div>
                <div class="text-xs font-bold text-slate-200">AdGuard DNS</div>
                <div class="text-[11px] text-slate-400">Bloqueo agresivo de anuncios y rastreo • 18ms</div>
              </div>
            </div>
          </label>

          <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
            <div class="flex items-center space-x-3">
              <input type="radio" name="dns" class="text-emerald-500 focus:ring-0">
              <div>
                <div class="text-xs font-bold text-slate-200">Quad9 (9.9.9.9)</div>
                <div class="text-[11px] text-slate-400">Filtrado anti-malware y phishing • 22ms</div>
              </div>
            </div>
          </label>

          <label class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 cursor-pointer">
            <div class="flex items-center space-x-3">
              <input type="radio" name="dns" class="text-emerald-500 focus:ring-0">
              <div>
                <div class="text-xs font-bold text-slate-200">Google Public DNS (8.8.8.8)</div>
                <div class="text-[11px] text-slate-400">Anycast global de alta disponibilidad • 14ms</div>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Tab View: WireGuard -->
      <div id="viewWireGuard" class="p-5 hidden flex-col">
        <h2 class="text-base font-bold text-white mb-1">Túnel WireGuard</h2>
        <p class="text-xs text-slate-400 mb-4">Protocolo VPN de última generación con criptografía moderna (ChaCha20, Curve25519).</p>

        <div class="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 space-y-3">
          <div class="flex justify-between items-center pb-2 border-b border-slate-700/40">
            <div>
              <div class="text-xs font-bold text-slate-200">Servidor Principal: US-East</div>
              <div class="text-[11px] text-slate-400">Endpoint: 198.51.100.42:51820</div>
            </div>
            <span class="w-3 h-3 rounded-full bg-emerald-400"></span>
          </div>

          <div class="flex justify-between text-xs py-1">
            <span class="text-slate-400">Dirección Asignada:</span>
            <span class="font-mono text-slate-200">10.8.0.2 / 32</span>
          </div>
          <div class="flex justify-between text-xs py-1">
            <span class="text-slate-400">Clave Pública:</span>
            <span class="font-mono text-slate-200">x6G+78...c8R2=</span>
          </div>
          <div class="flex justify-between text-xs py-1">
            <span class="text-slate-400">Tráfico Enviado / Recibido:</span>
            <span class="font-medium text-emerald-400">42.8 MB / 143.6 MB</span>
          </div>
          <div class="flex justify-between text-xs py-1">
            <span class="text-slate-400">Último Handshake:</span>
            <span class="text-slate-300">hace 18 segundos</span>
          </div>
        </div>
      </div>

      <!-- Tab View: Firewall -->
      <div id="viewFirewall" class="p-5 hidden flex-col">
        <h2 class="text-base font-bold text-white mb-1">Firewall y Filtros por Categoría</h2>
        <p class="text-xs text-slate-400 mb-4">Reglas de inspección de paquetes a nivel de socket local en Android.</p>

        <div class="space-y-3">
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div>
              <div class="text-xs font-bold text-slate-200">Bloquear Malware y Phishing</div>
              <div class="text-[11px] text-slate-400">Listas negras actualizadas cada 24 horas</div>
            </div>
            <input type="checkbox" checked class="w-4 h-4 rounded text-emerald-500 focus:ring-0">
          </div>

          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div>
              <div class="text-xs font-bold text-slate-200">Bloquear Rastreadores de Telemetría</div>
              <div class="text-[11px] text-slate-400">Impide rastreo de analíticas en apps y juegos</div>
            </div>
            <input type="checkbox" checked class="w-4 h-4 rounded text-emerald-500 focus:ring-0">
          </div>

          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div>
              <div class="text-xs font-bold text-slate-200">Filtrado Cosmético HTTPS</div>
              <div class="text-[11px] text-slate-400">Oculta los espacios vacíos de banners bloqueados</div>
            </div>
            <input type="checkbox" checked class="w-4 h-4 rounded text-emerald-500 focus:ring-0">
          </div>

          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div>
              <div class="text-xs font-bold text-slate-200">Bloquear Redes Sociales</div>
              <div class="text-[11px] text-slate-400">Meta, TikTok, X, ByteDance</div>
            </div>
            <input type="checkbox" class="w-4 h-4 rounded text-emerald-500 focus:ring-0">
          </div>
        </div>
      </div>

      <!-- Tab View: Settings -->
      <div id="viewSettings" class="p-5 hidden flex-col">
        <h2 class="text-base font-bold text-white mb-1">Ajustes de GVPN</h2>
        <p class="text-xs text-slate-400 mb-4">Parámetros del sistema y configuración de compilación.</p>

        <div class="space-y-3">
          <div class="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <div class="text-xs font-bold text-slate-200">Estado del Proyecto Android</div>
            <div class="text-[11px] text-slate-400">
              • Lenguaje: <span class="text-emerald-400 font-semibold">Kotlin 1.9.22</span><br>
              • UI: <span class="text-emerald-400 font-semibold">Jetpack Compose 1.5.8 + Material 3</span><br>
              • SDK: <span class="text-emerald-400 font-semibold">CompileSDK 34 (Android 14)</span><br>
              • Motor de Build: <span class="text-emerald-400 font-semibold">Gradle 9.3.1</span><br>
              • Archivo APK: <span class="text-emerald-400 font-semibold">app-debug.apk (Compilado OK)</span>
            </div>
          </div>

          <a href="/download/app-debug.apk" download class="block text-center py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition shadow-lg shadow-emerald-950/60">
            <i class="fa-solid fa-download mr-1"></i> Descargar APK Compilado (15.7 MB)
          </a>
        </div>
      </div>

      <!-- Bottom Navigation Bar (Android Tab Bar) -->
      <nav class="bg-slate-900 border-t border-slate-800 px-2 py-2 flex justify-around items-center">
        <button onclick="switchTab('home')" id="tabHome" class="flex flex-col items-center py-1 px-3 text-emerald-400 focus:outline-none transition">
          <i class="fa-solid fa-shield text-base mb-1"></i>
          <span class="text-[10px] font-semibold">Estado</span>
        </button>
        <button onclick="switchTab('dns')" id="tabDns" class="flex flex-col items-center py-1 px-3 text-slate-500 hover:text-slate-300 focus:outline-none transition">
          <i class="fa-solid fa-server text-base mb-1"></i>
          <span class="text-[10px] font-semibold">DNS</span>
        </button>
        <button onclick="switchTab('wireguard')" id="tabWireguard" class="flex flex-col items-center py-1 px-3 text-slate-500 hover:text-slate-300 focus:outline-none transition">
          <i class="fa-solid fa-key text-base mb-1"></i>
          <span class="text-[10px] font-semibold">WireGuard</span>
        </button>
        <button onclick="switchTab('firewall')" id="tabFirewall" class="flex flex-col items-center py-1 px-3 text-slate-500 hover:text-slate-300 focus:outline-none transition">
          <i class="fa-solid fa-fire-flame-curved text-base mb-1"></i>
          <span class="text-[10px] font-semibold">Firewall</span>
        </button>
        <button onclick="switchTab('settings')" id="tabSettings" class="flex flex-col items-center py-1 px-3 text-slate-500 hover:text-slate-300 focus:outline-none transition">
          <i class="fa-solid fa-sliders text-base mb-1"></i>
          <span class="text-[10px] font-semibold">Ajustes</span>
        </button>
      </nav>

    </div>

    <!-- Project Architecture Note -->
    <div class="max-w-md w-full text-center text-xs text-slate-500">
      <p>Android Studio SDK 34 • Kotlin Jetpack Compose • WireGuard • DNS Filter Engine</p>
    </div>

  </main>

  <script>
    let isConnected = true;
    let blockedCount = 1489;
    let dataSaved = 186.4;

    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      document.getElementById('currentTime').textContent = hours + ':' + mins;
    }
    setInterval(updateClock, 1000);
    updateClock();

    function toggleVPN() {
      isConnected = !isConnected;
      const btn = document.getElementById('powerBtn');
      const icon = document.getElementById('powerIcon');
      const label = document.getElementById('powerLabel');
      const glow = document.getElementById('glowRing');
      const statusText = document.getElementById('statusText');
      const statusBadge = document.getElementById('statusBadge');
      const vpnIcon = document.getElementById('vpnIcon');
      const headerStatus = document.getElementById('headerStatus');
      const tunnelSub = document.getElementById('tunnelSub');

      if (isConnected) {
        btn.className = 'relative w-40 h-40 rounded-full bg-gradient-to-b from-emerald-500 to-emerald-700 border-4 border-emerald-400/50 flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-950/80 transition-all transform active:scale-95 focus:outline-none';
        glow.className = 'absolute -inset-2 rounded-full bg-emerald-500/20 pulse-glow';
        label.textContent = 'CONECTADO';
        statusText.textContent = 'Protección y Filtrado Activos';
        statusBadge.className = 'flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium mb-6';
        vpnIcon.className = 'fa-solid fa-key text-emerald-400 text-[10px]';
        headerStatus.className = 'text-xs text-emerald-400 font-medium';
        headerStatus.textContent = '● Activo • Cloudflare DNS Encrypted';
        tunnelSub.textContent = 'Túnel WireGuard cifrado';
      } else {
        btn.className = 'relative w-40 h-40 rounded-full bg-gradient-to-b from-slate-700 to-slate-800 border-4 border-slate-600 flex flex-col items-center justify-center text-slate-400 shadow-xl transition-all transform active:scale-95 focus:outline-none';
        glow.className = 'hidden';
        label.textContent = 'DESCONECTADO';
        statusText.textContent = 'Protección Pausada';
        statusBadge.className = 'flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-medium mb-6';
        vpnIcon.className = 'hidden';
        headerStatus.className = 'text-xs text-red-400 font-medium';
        headerStatus.textContent = '○ Desconectado • Tráfico sin filtrar';
        tunnelSub.textContent = 'Túnel inactivo';
      }
    }

    // Periodic simulation
    setInterval(() => {
      if (isConnected) {
        blockedCount += Math.floor(Math.random() * 2) + 1;
        dataSaved += (Math.random() * 0.2);
        document.getElementById('statBlocked').textContent = blockedCount.toLocaleString();
        document.getElementById('statData').textContent = dataSaved.toFixed(1) + ' MB';
      }
    }, 3000);

    function switchTab(tab) {
      const tabs = ['home', 'dns', 'wireguard', 'firewall', 'settings'];
      const views = {
        'home': document.getElementById('viewHome'),
        'dns': document.getElementById('viewDns'),
        'wireguard': document.getElementById('viewWireGuard'),
        'firewall': document.getElementById('viewFirewall'),
        'settings': document.getElementById('viewSettings')
      };
      const buttons = {
        'home': document.getElementById('tabHome'),
        'dns': document.getElementById('tabDns'),
        'wireguard': document.getElementById('tabWireguard'),
        'firewall': document.getElementById('tabFirewall'),
        'settings': document.getElementById('tabSettings')
      };

      tabs.forEach(t => {
        if (t === tab) {
          views[t].classList.remove('hidden');
          views[t].classList.add('flex');
          buttons[t].className = 'flex flex-col items-center py-1 px-3 text-emerald-400 focus:outline-none transition';
        } else {
          views[t].classList.add('hidden');
          views[t].classList.remove('flex');
          buttons[t].className = 'flex flex-col items-center py-1 px-3 text-slate-500 hover:text-slate-300 focus:outline-none transition';
        }
      });
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = parsedUrl.pathname;

  // APK download route
  if (pathname === '/download/app-debug.apk') {
    const apkPaths = [
      path.join(__dirname, '.build-outputs', 'app-debug.apk'),
      path.join(__dirname, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
    ];

    let apkPath = apkPaths.find(p => fs.existsSync(p));

    if (apkPath) {
      const stat = fs.statSync(apkPath);
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename="GVPN-v6.5.2-debug.apk"'
      });
      const stream = fs.createReadStream(apkPath);
      stream.pipe(res);
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('APK not found. Please build with ./gradlew assembleDebug');
      return;
    }
  }

  // API status route
  if (pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      app: 'GVPN',
      version: '6.5.2',
      framework: 'Android SDK (Kotlin / Jetpack Compose)',
      compileSdk: 34,
      apkReady: fs.existsSync(path.join(__dirname, '.build-outputs', 'app-debug.apk'))
    }));
    return;
  }

  // Health check
  if (pathname === '/health' || pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
    return;
  }

  // Default: Serve interactive UI
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-cache'
  });
  res.end(HTML_CONTENT);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[INFO] Server started on port ${PORT}.`);
});
