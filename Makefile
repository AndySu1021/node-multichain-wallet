-include .env
export

GOOSE     := goose
GOOSE_DIR := ./database/migrations
DRIVER    := postgres
DSN       := postgres://$(DB_USERNAME):$(DB_PASSWORD)@$(DB_HOST):$(DB_PORT)/$(DB_DATABASE)?sslmode=$(or $(DB_SSLMODE),disable)

.PHONY: migrate-up migrate-down migrate-down-to migrate-reset migrate-status migrate-create

## Run all pending migrations
migrate-up:
	$(GOOSE) -dir $(GOOSE_DIR) $(DRIVER) "$(DSN)" up

## Rollback the last applied migration
migrate-down:
	$(GOOSE) -dir $(GOOSE_DIR) $(DRIVER) "$(DSN)" down

## Rollback to a specific version: make migrate-down-to version=00003
migrate-down-to:
	$(GOOSE) -dir $(GOOSE_DIR) $(DRIVER) "$(DSN)" down-to $(version)

## Rollback all migrations
migrate-reset:
	$(GOOSE) -dir $(GOOSE_DIR) $(DRIVER) "$(DSN)" reset

## Show current migration status
migrate-status:
	$(GOOSE) -dir $(GOOSE_DIR) $(DRIVER) "$(DSN)" status

## Create a new migration file: make migrate-create name=add_index_to_wallets
migrate-create:
	$(GOOSE) -dir $(GOOSE_DIR) create $(name) sql
