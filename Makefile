# Makefile for your Python + React (Next.js) App
# ----------------------------------------------
# This automates install, build, and run steps.

# Directory for frontend
FRONTEND_DIR=frontend

.PHONY: help install lint build run clean

# Show available commands
help:
	@echo ""
	@echo "Available commands:"
	@echo "  make install   - Install all dependencies (npm & pip)"
	@echo "  make lint      - Lint frontend and Python code"
	@echo "  make build     - Build static frontend (Next.js)"
	@echo "  make run       - Run the Python PyWebview app"
	@echo "  make clean     - Clean the frontend build output"
	@echo ""

# Install Node and Python dependencies
install:
	cd $(FRONTEND_DIR) && npm install
	pip install -r requirements.txt

# Lint both frontend and Python code
lint:
	cd $(FRONTEND_DIR) && npm run lint || echo "No frontend lint"
	flake8 main.py || echo "No Python lint"

# Build frontend to static HTML
build:
	cd $(FRONTEND_DIR) && npm run build

# Run the PyWebview desktop app
run:
	python main.py

# Clean the built output
clean:
	rm -rf $(FRONTEND_DIR)/out


# PyWebview and React both in dev mode
dev:
	@echo "Starting both React dev server and PyWebview in DEV mode..."
	(cd $(FRONTEND_DIR) && npm run dev &) && sleep 3 && python main.py --dev