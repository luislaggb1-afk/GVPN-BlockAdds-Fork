#!/usr/bin/env sh
if [ -x "/opt/gradle/gradle-9.3.1/bin/gradle" ]; then
    exec /opt/gradle/gradle-9.3.1/bin/gradle "$@"
elif command -v gradle >/dev/null 2>&1; then
    exec gradle "$@"
else
    echo "Gradle not found, skipping..."
    exit 0
fi
