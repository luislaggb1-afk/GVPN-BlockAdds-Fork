package com.gvpn.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GVPNTheme {
                MainAppScreen()
            }
        }
    }
}

@Composable
fun GVPNTheme(content: @Composable () -> Unit) {
    val darkColorScheme = darkColorScheme(
        primary = Color(0xFF10B981), // Emerald 500
        onPrimary = Color.White,
        primaryContainer = Color(0xFF065F46),
        secondary = Color(0xFF3B82F6), // Blue 500
        background = Color(0xFF090D16),
        surface = Color(0xFF111827),
        onSurface = Color(0xFFF3F4F6),
        surfaceVariant = Color(0xFF1F2937),
        onSurfaceVariant = Color(0xFF9CA3AF),
        outline = Color(0xFF374151)
    )
    MaterialTheme(
        colorScheme = darkColorScheme,
        content = content
    )
}

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Home : Screen("home", "Estado", Icons.Default.Shield)
    object DNS : Screen("dns", "DNS", Icons.Default.Dns)
    object WireGuard : Screen("wireguard", "WireGuard", Icons.Default.VpnKey)
    object Firewall : Screen("firewall", "Firewall", Icons.Default.Security)
    object Settings : Screen("settings", "Ajustes", Icons.Default.Settings)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScreen() {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }
    var isConnected by remember { mutableStateOf(false) }
    var blockedAdsCount by remember { mutableStateOf(1428) }
    var dataSaved by remember { mutableStateOf("184.2 MB") }
    var activeRequests by remember { mutableStateOf(12) }
    
    // Periodic simulated counter increment when connected
    LaunchedEffect(isConnected) {
        if (isConnected) {
            while(true) {
                delay(2500)
                blockedAdsCount += (1..3).random()
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF10B981)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(Icons.Default.Security, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text("GVPN Shield", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text(
                                if (isConnected) "Protegido • Cloudflare DNS" else "Desconectado",
                                fontSize = 11.sp,
                                color = if (isConnected) Color(0xFF10B981) else Color(0xFFEF4444)
                            )
                        }
                    }
                },
                actions = {
                    IconButton(onClick = { currentScreen = Screen.Settings }) {
                        Icon(Icons.Default.Tune, contentDescription = "Ajustes avanzados", tint = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp
            ) {
                val items = listOf(Screen.Home, Screen.DNS, Screen.WireGuard, Screen.Firewall, Screen.Settings)
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title, fontSize = 10.sp) },
                        selected = currentScreen == screen,
                        onClick = { currentScreen = screen },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color(0xFF10B981),
                            selectedTextColor = Color(0xFF10B981),
                            unselectedIconColor = Color(0xFF9CA3AF),
                            unselectedTextColor = Color(0xFF9CA3AF),
                            indicatorColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                    )
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (currentScreen) {
                Screen.Home -> HomeScreen(
                    isConnected = isConnected,
                    onToggleConnection = { isConnected = !isConnected },
                    blockedCount = blockedAdsCount,
                    dataSaved = dataSaved,
                    activeRequests = activeRequests
                )
                Screen.DNS -> DnsScreen()
                Screen.WireGuard -> WireGuardScreen()
                Screen.Firewall -> FirewallScreen()
                Screen.Settings -> SettingsScreen()
            }
        }
    }
}

@Composable
fun HomeScreen(
    isConnected: Boolean,
    onToggleConnection: () -> Unit,
    blockedCount: Int,
    dataSaved: String,
    activeRequests: Int
) {
    val scrollState = rememberScrollState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Status Badge
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = if (isConnected) Color(0xFF065F46).copy(alpha = 0.4f) else Color(0xFF7F1D1D).copy(alpha = 0.4f),
            border = BorderStroke(1.dp, if (isConnected) Color(0xFF10B981) else Color(0xFFEF4444))
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(8.dp)
                        .clip(CircleShape)
                        .background(if (isConnected) Color(0xFF10B981) else Color(0xFFEF4444))
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isConnected) "Filtros DNS y Túnel Activos" else "Protección Pausada",
                    color = if (isConnected) Color(0xFF34D399) else Color(0xFFF87171),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Power Button
        Box(
            modifier = Modifier
                .size(160.dp)
                .clip(CircleShape)
                .background(
                    Brush.verticalGradient(
                        if (isConnected) listOf(Color(0xFF059669), Color(0xFF047857))
                        else listOf(Color(0xFF1F2937), Color(0xFF111827))
                    )
                )
                .border(
                    width = 4.dp,
                    color = if (isConnected) Color(0xFF34D399).copy(alpha = 0.5f) else Color(0xFF374151),
                    shape = CircleShape
                )
                .clickable { onToggleConnection() },
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = if (isConnected) Icons.Default.PowerSettingsNew else Icons.Default.PowerOff,
                    contentDescription = "Power",
                    tint = if (isConnected) Color.White else Color(0xFF9CA3AF),
                    modifier = Modifier.size(56.dp)
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = if (isConnected) "CONECTADO" else "CONECTAR",
                    color = if (isConnected) Color.White else Color(0xFF9CA3AF),
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // Stat Cards Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                title = "Anuncios Bloqueados",
                value = blockedCount.toString(),
                icon = Icons.Default.Block,
                color = Color(0xFF10B981),
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Datos Ahorrados",
                value = dataSaved,
                icon = Icons.Default.DataUsage,
                color = Color(0xFF3B82F6),
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            StatCard(
                title = "Conexiones Activas",
                value = "$activeRequests reqs",
                icon = Icons.Default.NetworkCheck,
                color = Color(0xFF8B5CF6),
                modifier = Modifier.weight(1f)
            )
            StatCard(
                title = "Velocidad Latencia",
                value = if (isConnected) "14 ms" else "--",
                icon = Icons.Default.Speed,
                color = Color(0xFFF59E0B),
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Recent Blocked Activity
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Actividad Reciente de Bloqueo", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Ver todos", color = Color(0xFF10B981), fontSize = 12.sp)
                }
                Spacer(modifier = Modifier.height(12.dp))
                BlockedItemRow("ads.googleadservices.com", "Publicidad • DNS", "Hace 2s")
                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                BlockedItemRow("analytics.facebook.com", "Rastreador • HTTPS", "Hace 7s")
                HorizontalDivider(modifier = Modifier.padding(vertical = 8.dp), color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                BlockedItemRow("pagead2.googlesyndication.com", "Anuncio banner • DNS", "Hace 14s")
            }
        }
    }
}

@Composable
fun StatCard(title: String, value: String, icon: ImageVector, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clip(RoundedCornerShape(6.dp))
                        .background(color.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(icon, contentDescription = null, tint = color, modifier = Modifier.size(16.dp))
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(title, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(value, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}

@Composable
fun BlockedItemRow(domain: String, type: String, time: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(Color(0xFFEF4444))
            )
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(domain, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurface)
                Text(type, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        Text(time, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun DnsScreen() {
    var selectedProvider by remember { mutableStateOf("Cloudflare (1.1.1.1)") }
    val providers = listOf(
        "Cloudflare (1.1.1.1) - Recomendado",
        "AdGuard DNS (Bloqueo de anuncios)",
        "Google Public DNS (8.8.8.8)",
        "Quad9 (Seguridad avanzada)",
        "Cloudflare Families (Sin NSFW)"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text("Servidores DNS & Filtrado", fontSize = 20.sp, fontWeight = FontWeight.Bold)
        Text("Selecciona el servidor DNS primario para bloqueo a nivel de red.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        
        Spacer(modifier = Modifier.height(16.dp))

        providers.forEach { provider ->
            val isSelected = selectedProvider.startsWith(provider.substringBefore(" -"))
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clickable { selectedProvider = provider },
                colors = CardDefaults.cardColors(
                    containerColor = if (isSelected) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.surface
                ),
                border = if (isSelected) BorderStroke(1.dp, Color(0xFF10B981)) else null
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        RadioButton(selected = isSelected, onClick = { selectedProvider = provider })
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(provider, fontSize = 13.sp, fontWeight = FontWeight.Medium)
                    }
                    if (isSelected) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = Color(0xFF10B981))
                    }
                }
            }
        }
    }
}

@Composable
fun WireGuardScreen() {
    var isWgConnected by remember { mutableStateOf(false) }
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text("Túnel VPN WireGuard", fontSize = 20.sp, fontWeight = FontWeight.Bold)
        Text("Conexión cifrada de alta velocidad y bajo consumo de batería.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

        Spacer(modifier = Modifier.height(20.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Servidor Principal • US-East", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Endpoint: 198.51.100.42:51820", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    Switch(
                        checked = isWgConnected,
                        onCheckedChange = { isWgConnected = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = Color(0xFF10B981))
                    )
                }
                Spacer(modifier = Modifier.height(12.dp))
                HorizontalDivider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                Spacer(modifier = Modifier.height(12.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Dirección IP Asignada", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("10.8.0.2 / 32", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(6.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Transferencia", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text("42.8 MB / 112.4 MB", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
fun FirewallScreen() {
    var blockMalware by remember { mutableStateOf(true) }
    var blockSocial by remember { mutableStateOf(false) }
    var blockAdult by remember { mutableStateOf(true) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text("Firewall & Reglas de Categoría", fontSize = 20.sp, fontWeight = FontWeight.Bold)
        Text("Bloquea tráfico malicioso y categorías completas de servidores.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

        Spacer(modifier = Modifier.height(16.dp))

        FirewallToggleItem("Bloquear Malware y Phishing", "Protege contra sitios de estafa y software malicioso", blockMalware) { blockMalware = it }
        FirewallToggleItem("Bloquear Redes Sociales", "Evita rastreadores de Meta, TikTok, X, etc.", blockSocial) { blockSocial = it }
        FirewallToggleItem("Bloquear Contenido Adulto (NSFW)", "Filtra contenido inapropiado a nivel DNS", blockAdult) { blockAdult = it }
    }
}

@Composable
fun FirewallToggleItem(title: String, subtitle: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Switch(
                checked = checked,
                onCheckedChange = onCheckedChange,
                colors = SwitchDefaults.colors(checkedThumbColor = Color(0xFF10B981))
            )
        }
    }
}

@Composable
fun SettingsScreen() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text("Ajustes del Sistema GVPN", fontSize = 20.sp, fontWeight = FontWeight.Bold)
        Text("Configuraciones avanzadas de rendimiento y seguridad.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

        Spacer(modifier = Modifier.height(16.dp))

        SettingItemRow(Icons.Default.Notifications, "Notificaciones de Bloqueo", "Avisar cuando se bloqueen anuncios en segundo plano", true)
        SettingItemRow(Icons.Default.BatteryChargingFull, "Modo Ahorro de Batería", "Optimiza el uso de CPU del filtro DNS", false)
        SettingItemRow(Icons.Default.Security, "HTTPS Cosmetic Filtering", "Oculta elementos visuales de anuncios bloqueados", true)
        SettingItemRow(Icons.Default.Update, "Actualizar Listas Automáticamente", "Sincroniza listas de bloqueo cada 24 horas", true)
    }
}

@Composable
fun SettingItemRow(icon: ImageVector, title: String, subtitle: String, initialChecked: Boolean) {
    var checked by remember { mutableStateOf(initialChecked) }
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                Icon(icon, contentDescription = null, tint = Color(0xFF10B981), modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Text(title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text(subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            Switch(
                checked = checked,
                onCheckedChange = { checked = it },
                colors = SwitchDefaults.colors(checkedThumbColor = Color(0xFF10B981))
            )
        }
    }
}
