
# Variables
PNPM := pnpm
DOCKER_COMPOSE := docker-compose -f infra/docker-compose.yml

.PHONY: help install setup db-up migrate seed dev clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	$(PNPM) install

setup: ## Setup environment files
	@echo "Setting up environment files..."
	@cp -n apps/backend/.env.example apps/backend/.env || echo "backend/.env already exists"
	@cp -n apps/frontend/.env.example apps/frontend/.env || echo "frontend/.env already exists"
	@echo "Environment setup complete. Please check .env files and update secrets if needed."

db-up: ## Start database
	$(PNPM) db:up

migrate: ## Run database migrations
	$(PNPM) --filter backend prisma:migrate

seed: ## Seed database
	$(PNPM) --filter backend prisma:seed

init: install setup db-up ## Initialize project (Install -> Setup -> DB Up -> Migrate -> Seed)
	@echo "Waiting for database to be ready..."
	@sleep 5
	$(MAKE) migrate
	$(MAKE) seed
	@echo "Initialization complete! Run 'make dev' to start."

dev: ## Start dev server (API + Worker + Web)
	$(PNPM) dev

clean: ## Stop database and clean up
	$(PNPM) db:down
