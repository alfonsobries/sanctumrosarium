#!/bin/bash

# Helpers compartidos por los scripts de desarrollo. Sourcear, no ejecutar.

# IPv4 de la interfaz con ruta default (la que ve un celular en la misma Wi-Fi).
detect_local_ip() {
    local iface ip

    iface=$(route get default 2>/dev/null | awk '/interface: /{print $2}')
    if [ -n "$iface" ]; then
        ip=$(ipconfig getifaddr "$iface" 2>/dev/null)
    fi

    if [ -z "$ip" ]; then
        for iface in en0 en1; do
            ip=$(ipconfig getifaddr "$iface" 2>/dev/null)
            [ -n "$ip" ] && break
        done
    fi

    if [ -z "$ip" ] && command -v ip &>/dev/null; then
        iface=$(ip -4 route show default 2>/dev/null | awk '{print $5}' | head -1)
        if [ -n "$iface" ]; then
            ip=$(ip -4 -o addr show "$iface" 2>/dev/null | awk '{print $4}' | cut -d/ -f1 | head -1)
        fi
    fi

    echo "$ip"
}

# Exporta DEV_HOST con la IP dada o la detectada; deja pasar sin IP (simulador
# y emulador siguen funcionando con localhost).
export_dev_host() {
    local ip="${1:-}"

    if [ -z "$ip" ]; then
        ip=$(detect_local_ip)
    fi

    if [ -n "$ip" ]; then
        export DEV_HOST="$ip"
        echo "DEV_HOST=$ip"
    else
        echo "Sin IPv4 en LAN. Simulador/emulador funcionan; un celular necesita Wi-Fi o pnpm play 192.168.X.X"
    fi
}

port_is_busy() {
    lsof -iTCP:"$1" -sTCP:LISTEN -t >/dev/null 2>&1
}

# Exporta la variable $1 (su valor o el default $2) con ese puerto si está libre; si
# no, con el siguiente libre, y avisa. Artisan (config/dev.php) y Metro la leen.
export_free_port() {
    local name="$1" port="${!1:-}" wanted

    if [ -z "$port" ] && [ -f api/.env ]; then
        port=$(sed -n "s/^$name=\([0-9]\{1,\}\)\$/\1/p" api/.env | tail -n 1)
    fi

    port="${port:-$2}"
    wanted="$port"
    while port_is_busy "$port"; do
        port=$((port + 1))
    done

    if [ "$port" != "$wanted" ]; then
        echo "$name: el puerto $wanted está ocupado, uso $port"
    fi

    export "$name=$port"
}

require_setup() {
    if [ ! -f api/.env ]; then
        echo "No hay api/.env. Corre: cp api/.env.example api/.env && (cd api && php artisan key:generate)"
        exit 1
    fi

    if [ ! -d api/vendor ] || [ ! -d app/node_modules ]; then
        echo "Faltan dependencias. Corre: pnpm install && (cd api && composer install)"
        exit 1
    fi
}
