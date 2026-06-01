-- +goose Up
CREATE TABLE asset (
    id               BIGINT       PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    symbol           VARCHAR(20)  NOT NULL UNIQUE,
    name             VARCHAR(100) NOT NULL,
    contract_address VARCHAR(42)  UNIQUE,
    decimals         SMALLINT     NOT NULL,
    is_active        BOOLEAN      NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- +goose Down
DROP TABLE asset;