#!/bin/bash
# CyberMod — Steam Deck Installer
# Usage: curl -L <release_url> | tar xz && chmod +x install.sh && ./install.sh

set -euo pipefail

INSTALL_DIR="/home/deck/cybermod"
SERVICE_DIR="/home/deck/.config/systemd/user"
JAR_NAME="cybermod-backend-1.2.0.jar"
REPO_URL="${GITHUB_REPO_URL:-}"

echo "========================================"
echo "    CYBERMOD — INSTALLER FOR STEAM DECK"
echo "========================================"

# --- 1. Detect environment ---
if [ ! -f /etc/os-release ]; then
    echo "[WARN] Cannot detect OS. Proceeding anyway."
elif ! grep -q "steamos" /etc/os-release; then
    echo "[WARN] This doesn't appear to be SteamOS. Installation may not work correctly."
fi

# --- 2. Check Java ---
if ! command -v java &> /dev/null; then
    echo "[INFO] Java not found. Installing JDK 21 via Flatpak..."
    flatpak install -y flathub org.freedesktop.Sdk.Extension.openjdk21 2>/dev/null || {
        echo "[ERROR] Cannot install Java. Please install JDK 21 manually."
        exit 1
    }
fi

# --- 3. Create directories ---
mkdir -p "${INSTALL_DIR}/backend"
mkdir -p "${INSTALL_DIR}/frontend/dist"
mkdir -p "${INSTALL_DIR}/catalog"
mkdir -p "${SERVICE_DIR}"

# --- 4. Copy files ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -f "${SCRIPT_DIR}/backend/${JAR_NAME}" ]; then
    cp "${SCRIPT_DIR}/backend/${JAR_NAME}" "${INSTALL_DIR}/backend/"
    echo "[OK] Backend JAR copied"
else
    echo "[WARN] Backend JAR not found in package"
fi

if [ -d "${SCRIPT_DIR}/frontend/dist" ]; then
    cp -r "${SCRIPT_DIR}/frontend/dist/." "${INSTALL_DIR}/frontend/dist/"
    echo "[OK] Frontend dist copied"
else
    echo "[WARN] Frontend dist not found in package"
fi

if [ -f "${SCRIPT_DIR}/catalog/manifest.json" ]; then
    cp "${SCRIPT_DIR}/catalog/manifest.json" "${INSTALL_DIR}/catalog/"
    echo "[OK] Catalog manifest copied"
else
    echo "[WARN] Catalog manifest not found in package"
fi

# --- 5. Install systemd service ---
if [ -f "${SCRIPT_DIR}/cybermod.service" ]; then
    cp "${SCRIPT_DIR}/cybermod.service" "${SERVICE_DIR}/cybermod.service"
elif [ -f "${SCRIPT_DIR}/../scripts/cybermod.service" ]; then
    cp "${SCRIPT_DIR}/../scripts/cybermod.service" "${SERVICE_DIR}/cybermod.service"
else
    cat > "${SERVICE_DIR}/cybermod.service" << 'SERVICE_EOF'
[Unit]
Description=CyberMod Backend Service
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/deck/cybermod/backend
ExecStart=/usr/bin/java -jar cybermod-backend-1.2.0.jar
Restart=on-failure
RestartSec=5
Environment=CYBERMOD_VERSION=%i

[Install]
WantedBy=default.target
SERVICE_EOF
fi

echo "[OK] systemd service installed"

# --- 6. Install launch script ---
if [ -f "${SCRIPT_DIR}/cybermod.sh" ]; then
    cp "${SCRIPT_DIR}/cybermod.sh" "${INSTALL_DIR}/cybermod.sh"
    chmod +x "${INSTALL_DIR}/cybermod.sh"
else
    cat > "${INSTALL_DIR}/cybermod.sh" << 'LAUNCH_EOF'
#!/bin/bash
cd /home/deck/cybermod/backend
exec java -jar cybermod-backend-1.2.0.jar
LAUNCH_EOF
    chmod +x "${INSTALL_DIR}/cybermod.sh"
fi

echo "[OK] Launch script installed"

# --- 7. Store repo URL for auto-update ---
if [ -n "${REPO_URL}" ]; then
    echo "${REPO_URL}" > "${INSTALL_DIR}/.repo_url"
fi

# --- 8. Write version file ---
RELEASE_TAG="${GITHUB_REF_NAME:-1.2.0}"
echo "${RELEASE_TAG}" > "${INSTALL_DIR}/.version"
mkdir -p "${HOME}/.config/cybermod"
echo "${RELEASE_TAG}" > "${HOME}/.config/cybermod/version"

# --- 9. Enable and start service ---
systemctl --user daemon-reload
systemctl --user enable cybermod.service
systemctl --user restart cybermod.service || true

echo ""
echo "========================================"
echo "  CyberMod installation complete!"
echo "  Backend: http://localhost:7070"
echo "  Service: systemctl --user status cybermod"
echo "========================================"
