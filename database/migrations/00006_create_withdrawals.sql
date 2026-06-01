-- +goose Up
CREATE TYPE withdrawal_status AS ENUM ('pending', 'broadcasting', 'confirmed', 'failed');

CREATE TABLE withdrawals (
    id            UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID              NOT NULL REFERENCES users(id),
    wallet_id     UUID              NOT NULL REFERENCES wallets(id),
    asset_id      UUID              NOT NULL REFERENCES assets(id),
    to_address    VARCHAR(42)       NOT NULL,
    amount_raw    NUMERIC(78, 0)    NOT NULL,
    tx_hash       VARCHAR(66),
    status        withdrawal_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at    TIMESTAMPTZ       NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ       NOT NULL DEFAULT now()
);

CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);

-- +goose Down
DROP TABLE withdrawals;
DROP TYPE withdrawal_status;