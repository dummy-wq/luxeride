#!/bin/bash

# Theme Wizard Launcher for Bash/Zsh
# This script ensures Node is installed and launches the JS wizard.

if ! command -v node &> /dev/null
then
    echo "❌ Error: Node.js is not installed. Please install it to use the Theme Wizard."
    exit 1
fi

node "$(dirname "$0")/theme-wizard.js"
