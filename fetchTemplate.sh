#!/usr/bin/bash

# Define variables
TEMPLATE_URL="https://www.felixalbertos.com/files/tfggii.zip"
ZIP_FILE="$HOME/tfggii.zip"
EXTRACT_DIR="./tfggii"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
RESET="\033[0m"
OVERRIDE=false

# Parse arguments
for arg in "$@"; do
    case $arg in
        --override|-o)
            OVERRIDE=true
            shift
            ;;
        *)
            ;;
    esac
done

# Check if the zip file exists, if not, download the template
if [ ! -f "$ZIP_FILE" ]; then
    curl -X GET "$TEMPLATE_URL" -o "$ZIP_FILE"
fi

# Error handling for curl command
if [ $? -ne 0 ]; then
    echo -e "${RED}Error downloading the template file.${RESET}"
    exit 1
fi

# Check if the extraction directory already exists
if [ -d "$EXTRACT_DIR" ] && [ "$OVERRIDE" = false ]; then
    echo -e "${RED}The directory '$EXTRACT_DIR' already exists. Please remove it or use the --override option.${RESET}"
    exit 1
fi

# Extract the zip file to the current working directory
unzip -d . "$ZIP_FILE"

# Error handling for unzip command
if [ $? -ne 0 ]; then
    echo -e "${RED}Error extracting the template file.${RESET}"
    exit 1
fi

if [ "$OVERRIDE" = true ]; then
    echo -e "${YELLOW}The directory '$EXTRACT_DIR' already exists and will be overridden.${RESET}"
    rm -rf "$EXTRACT_DIR"
fi

# Rename the extracted folder
mv template/ "$EXTRACT_DIR"

# Remove unnecessary files and directories
rm -rf "$EXTRACT_DIR/templateAPP/plantuml-images/"
rm -rf "$EXTRACT_DIR/templateAPP/input/appendices/plantuml-images"

echo -e "${GREEN}Template downloaded and extracted successfully to '$EXTRACT_DIR'.${RESET}"