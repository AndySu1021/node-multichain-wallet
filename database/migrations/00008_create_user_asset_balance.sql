-- +goose Up
CREATE TABLE user_asset_balance (
    id               BIGINT         PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    wallet_id        BIGINT         NOT NULL REFERENCES wallet(id),
    network_asset_id BIGINT         NOT NULL REFERENCES network_asset(id),
    amount_raw       NUMERIC(78, 0) NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT now(),
    CONSTRAINT user_asset_balance_unique UNIQUE (wallet_id, network_asset_id)
);

CREATE INDEX idx_user_asset_balance_wallet_id ON user_asset_balance(wallet_id);

-- +goose Down
DROP TABLE user_asset_balance;