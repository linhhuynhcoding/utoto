#!/bin/bash

# Create logs directory if it doesn't exist
mkdir -p logs

# Function to kill process occupying a port
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:"${port}")
    if [ ! -z "${pid}" ]; then
        echo "-> Killing process ${pid} occupying port ${port}..."
        kill -9 "${pid}" 2>/dev/null
    fi
}

echo "Cleaning up ports..."
kill_port 4000
kill_port 4001
kill_port 5173
kill_port 5174

echo "Starting applications in background..."

# Function to start an app and save its PID
start_app() {
    local name=$1
    local filter=$2
    local command=$3
    local log_file="logs/${name}.log"
    local pid_file="logs/${name}.pid"

    echo "-> Starting ${name} (log: ${log_file})..."
    pnpm --filter "${filter}" ${command} > "${log_file}" 2>&1 &
    echo $! > "${pid_file}"
}

# Start all apps
start_app "api" "backend" "dev:api"
start_app "worker" "backend" "dev:worker"
start_app "frontend" "frontend" "dev"
start_app "gps" "gps" "dev"
start_app "gps-ui" "gps-ui" "dev"

echo "----------------------------------------"
echo "All applications started!"
echo "Logs are available in the 'logs/' directory:"
ls -1 logs/*.log
echo "----------------------------------------"
echo "To stop all apps, run: ./stop.sh"
