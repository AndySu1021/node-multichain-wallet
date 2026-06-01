-- +goose Up
CREATE TYPE transaction_status AS ENUM ('confirmed', 'failed');

CREATE TABLE transactions (
    id           UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
    tx_hash      VARCHAR(66)        NOT NULL UNIQUE,
    block_number INTEGER            NOT NULL,
    from_address VARCHAR(42)        NOT NULL,
    to_address   VARCHAR(42)        NOT NULL,
    asset_id     UUID               NOT NULL REFERENCES assets(id),
    amount_raw   NUMERIC(78, 0)     NOT NULL,
    status       transaction_status NOT NULL DEFAULT 'confirmed',
    created_at   TIMESTAMPTZ        NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_to_address   ON transactions(to_address);
CREATE INDEX idx_transactions_from_address ON transactions(from_address);

-- +goose Down
DROP TABLE transactions;
DROP TYPE transaction_status;