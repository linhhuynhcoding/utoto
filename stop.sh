#!/bin/bash

echo "Stopping applications..."

# Check if logs directory exists
if [ ! -d "logs" ]; then
    echo "No logs directory found. Are any apps running?"
    exit 1
fi

# Stop each app using its stored PID
for pid_file in logs/*.pid; do
    if [ -f "$pid_file" ]; then
        name=$(basename "${pid_file}" .pid)
        pid=$(cat "${pid_file}")
        
        echo "-> Stopping ${name} (PID: ${pid})..."
        # Try to kill gracefully, then force if needed
        kill "$pid" 2>/dev/null
        
        # Give it a second to stop
        sleep 1
        
        # Check if still running
        if kill -0 "$pid" 2>/dev/null; then
            echo "   Process still running, forcing..."
            kill -9 "$pid" 2>/dev/null
        fi
        
        # Remove the PID file
        rm "${pid_file}"
    fi
done

echo "----------------------------------------"
echo "All applications stopped."
echo "----------------------------------------"
