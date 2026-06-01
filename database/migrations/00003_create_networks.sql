-- +goose Up
CREATE TABLE networks (
    id         BIGINT       PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name       VARCHAR(100) NOT NULL,
    symbol     VARCHAR(20)  NOT NULL UNIQUE,
    chain_id   INTEGER,        -- EVM chain ID (e.g. 1 for Ethereum mainnet); NULL for non-EVM chains
    is_active  BOOLEAN      NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO networks (name, symbol, chain_id, is_active) VALUES
    ('Ethereum',   'ETH', 1,    true),
    ('Bitcoin',    'BTC', NULL, true),
    ('XRP Ledger', 'XRP', NULL, true);

-- +goose Down
DROP TABLE networks;