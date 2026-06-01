-- +goose Up
CREATE TABLE network
(
    id         BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name       VARCHAR(100) NOT NULL,
    symbol     VARCHAR(20)  NOT NULL UNIQUE,
    chain_id   INTEGER, -- EVM chain ID (e.g. 1 for Ethereum mainnet); NULL for non-EVM chains
    coin_type  SMALLINT     NOT NULL,
    is_active  BOOLEAN      NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO network (name, symbol, chain_id, coin_type, is_active)
VALUES ('Ethereum', 'ETH', 1, 60, true),
       ('Bitcoin', 'BTC', NULL, 0, true),
       ('XRP Ledger', 'XRP', NULL, 144, true);

-- +goose Down
DROP TABLE network;