-- +goose Up
CREATE TABLE "user" (
    id            BIGINT       PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- +goose Down
DROP TABLE "user";