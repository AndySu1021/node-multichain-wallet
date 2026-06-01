-- +goose Up
ALTER TABLE asset
    DROP COLUMN contract_address,
    DROP COLUMN is_active;

-- +goose Down
ALTER TABLE asset
    ADD COLUMN contract_address VARCHAR(42) UNIQUE,
    ADD COLUMN is_active        BOOLEAN     NOT NULL DEFAULT true;