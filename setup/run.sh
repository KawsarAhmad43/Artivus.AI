#!/bin/bash

# Exit on error
set -e

# Variables
VENV_DIR=".venv"

echo "Starting application..."

# Check virtual environment
if [ ! -d "${VENV_DIR}" ]; then
    echo "Virtual environment not found. Run './setup/setup.sh' first."
    exit 1
fi

# Activate virtual environment
source ${VENV_DIR}/bin/activate

# Check if Ollama is running
if ! pgrep -f "ollama serve" > /dev/null; then
    echo "Starting Ollama server..."
    ollama serve &
    sleep 5
fi

# Run Flask app
echo "Running Flask app..."
python app.py