#!/bin/bash

# Exit on error
set -e

# Variables
VENV_DIR="venv"
MODEL_NAME="llama3-chatqa:8b"
PYTHON_VERSION="3.10"

echo "Setting up project..."

# Check for Python
if ! command -v python${PYTHON_VERSION} &> /dev/null; then
    echo "Python ${PYTHON_VERSION} not found. Please install it."
    exit 1
fi

# Create and activate virtual environment
echo "Creating virtual environment..."
python${PYTHON_VERSION} -m venv ${VENV_DIR}
source ${VENV_DIR}/bin/activate

# Verify virtual environment activation
if [ -z "$VIRTUAL_ENV" ]; then
    echo "Failed to activate virtual environment."
    exit 1
fi
echo "Virtual environment activated at ${VENV_DIR}"

# Install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Check if Ollama is installed
if command -v ollama &> /dev/null; then
    echo "Ollama is installed."
    ollama_version=$(ollama --version 2>/dev/null || echo "Unknown")
    echo "Ollama version: ${ollama_version}"
    
    # Start Ollama server
    echo "Starting Ollama server..."
    ollama serve &
    
    # Wait for Ollama to start
    sleep 5
    
    # Pull model
    echo "Pulling ${MODEL_NAME}..."
    ollama pull ${MODEL_NAME}
else
    echo "Ollama is not installed. Please install Ollama manually (e.g., visit https://ollama.com/download)."
    exit 1
fi

echo "Setup complete! Run './setup/run.sh' to start the app."