-- +goose Up
CREATE TYPE transaction_status AS ENUM ('confirmed', 'failed');

CREATE TABLE transaction (
    id           BIGINT             PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tx_hash      VARCHAR(66)        NOT NULL UNIQUE,
    block_number INTEGER            NOT NULL,
    from_address VARCHAR(42)        NOT NULL,
    to_address   VARCHAR(42)        NOT NULL,
    asset_id     BIGINT             NOT NULL REFERENCES asset(id),
    amount_raw   NUMERIC(78, 0)     NOT NULL,
    status       transaction_status NOT NULL DEFAULT 'confirmed',
    created_at   TIMESTAMPTZ        NOT NULL DEFAULT now()
);

CREATE INDEX idx_transaction_to_address   ON transaction(to_address);
CREATE INDEX idx_transaction_from_address ON transaction(from_address);

-- +goose Down
DROP TABLE transaction;
DROP TYPE transaction_status;