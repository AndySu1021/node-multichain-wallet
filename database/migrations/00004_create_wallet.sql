-- +goose Up
CREATE TABLE wallet (
    id               BIGINT       PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id          BIGINT       NOT NULL REFERENCES "user"(id),
    network_id       BIGINT       NOT NULL REFERENCES network(id),
    address          VARCHAR(100) NOT NULL,
    -- Derivation index is scoped per network; each chain starts its own sequence from 0
    derivation_index INTEGER      NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT wallet_address_network_unique          UNIQUE (address, network_id),
    CONSTRAINT wallet_derivation_index_network_unique UNIQUE (derivation_index, network_id)
);

CREATE INDEX idx_wallet_user_id    ON wallet(user_id);
CREATE INDEX idx_wallet_address    ON wallet(address);
CREATE INDEX idx_wallet_network_id ON wallet(network_id);

-- +goose Down
DROP TABLE wallet;