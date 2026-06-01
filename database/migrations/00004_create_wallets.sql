-- +goose Up
CREATE TABLE wallets (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID         NOT NULL REFERENCES users(id),
    network_id       BIGINT       NOT NULL REFERENCES networks(id),
    address          VARCHAR(100) NOT NULL,
    -- Derivation index is scoped per network; each chain starts its own sequence from 0
    derivation_index INTEGER      NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT wallets_address_network_unique          UNIQUE (address, network_id),
    CONSTRAINT wallets_derivation_index_network_unique UNIQUE (derivation_index, network_id)
);

CREATE INDEX idx_wallets_user_id    ON wallets(user_id);
CREATE INDEX idx_wallets_address    ON wallets(address);
CREATE INDEX idx_wallets_network_id ON wallets(network_id);

-- +goose Down
DROP TABLE wallets;