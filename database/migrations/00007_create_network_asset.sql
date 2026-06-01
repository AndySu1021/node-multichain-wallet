-- +goose Up
CREATE TABLE network_asset (
    id               BIGINT      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    network_id       BIGINT      NOT NULL REFERENCES network(id),
    asset_id         BIGINT      NOT NULL REFERENCES asset(id),
    contract_address VARCHAR(42),    -- NULL for native coins (e.g. ETH, BTC)
    is_active        BOOLEAN     NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT network_asset_unique UNIQUE (network_id, asset_id)
);

-- Prevent duplicate contract addresses on the same network
CREATE UNIQUE INDEX idx_network_asset_contract
    ON network_asset (network_id, contract_address)
    WHERE contract_address IS NOT NULL;

-- +goose Down
DROP TABLE network_asset;