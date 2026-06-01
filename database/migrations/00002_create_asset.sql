-- +goose Up
CREATE TABLE asset (
    id               BIGINT       PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    symbol           VARCHAR(20)  NOT NULL UNIQUE,
    name             VARCHAR(100) NOT NULL,
    decimals         SMALLINT     NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- +goose Down
DROP TABLE asset;