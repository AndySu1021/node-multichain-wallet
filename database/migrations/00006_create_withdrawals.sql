-- +goose Up
CREATE TYPE withdrawal_status AS ENUM ('pending', 'broadcasting', 'confirmed', 'failed');

CREATE TABLE withdrawal (
    id            BIGINT            PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id       BIGINT            NOT NULL REFERENCES "user"(id),
    wallet_id     BIGINT            NOT NULL REFERENCES wallet(id),
    asset_id      BIGINT            NOT NULL REFERENCES asset(id),
    to_address    VARCHAR(42)       NOT NULL,
    amount_raw    NUMERIC(78, 0)    NOT NULL,
    tx_hash       VARCHAR(66),
    status        withdrawal_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at    TIMESTAMPTZ       NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ       NOT NULL DEFAULT now()
);

CREATE INDEX idx_withdrawal_user_id ON withdrawal(user_id);

-- +goose Down
DROP TABLE withdrawal;
DROP TYPE withdrawal_status;