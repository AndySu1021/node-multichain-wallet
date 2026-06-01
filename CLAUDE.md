# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start:dev        # Start with file watching (development)
yarn build            # Compile to dist/
yarn start:prod       # Run compiled output
yarn lint             # ESLint with auto-fix
yarn test             # Run unit tests (jest)
yarn test:watch       # Watch mode
yarn test:cov         # Coverage report
yarn test:e2e         # End-to-end tests
```

Run a single test file:
```bash
yarn test src/wallets/wallets.service.spec.ts
```

## Architecture Overview

This is a custodial multi-chain wallet service built with NestJS. Ethereum is the only chain with a fully implemented signing path; BTC and XRP are registered in the `networks` table as future targets.

### Infrastructure dependencies

- **PostgreSQL** — primary datastore (TypeORM `synchronize: false`; schema managed entirely by goose)
- **Redis** — BullMQ queue backend for withdrawal jobs
- **AWS KMS** — available via `KmsService` but not yet on the critical signing path (planned for master mnemonic encryption)
- **Ethereum node** — self-hosted, connected via WebSocket (`ETH_WS_URL`)

### Multi-chain support

Supported networks are stored in the `networks` table (id, name, symbol, chain_id, is_active). Each `wallet` row references a `network_id`. The `GET /networks` endpoint returns all active networks.

To register a new chain, insert a row into `networks`:
```sql
INSERT INTO networks (name, symbol, chain_id, is_active)
VALUES ('Polygon', 'MATIC', 137, true);
```

Address derivation per chain is implemented inside `WalletsService.create()`. Currently only `symbol = 'ETH'` is implemented; adding a new chain requires adding a branch there (and any required library for key derivation).

### Wallet key derivation

All Ethereum wallet addresses are derived from a single BIP39 master mnemonic stored in `WALLET_MASTER_MNEMONIC`. `EthereumService` loads it at startup into `masterNode` (`ethers.HDNodeWallet.fromPhrase`), and `deriveWallet(index)` returns `m/44'/60'/0'/0/{index}` connected to the provider.

The `derivationIndex` column in the `wallets` table is the only persistent key material — **no private keys are stored in the database**. The index is scoped per network (each network maintains its own sequence starting from 0), guaranteeing uniqueness within a chain.

`WalletsService.getDecryptedSigner()` is the single call site that re-derives a signer for signing withdrawals.

Planned migration: replace `WALLET_MASTER_MNEMONIC` with a KMS-encrypted value so the plaintext mnemonic never appears in env. Only `EthereumService.onModuleInit()` needs to change.

### Module responsibilities

| Module | Role |
|--------|------|
| `kms` | Thin wrapper around `@aws-sdk/client-kms`. `encrypt()` returns base64 ciphertext; `decrypt()` returns plaintext. Not on the active signing path yet. |
| `ethereum` | Owns the `WebSocketProvider` and `masterNode`. `deriveWallet(index)` is the only way to obtain an ETH signer. |
| `auth` | JWT registration/login. Passport `jwt` strategy attaches the full `User` to `req.user`. |
| `networks` | CRUD for the `networks` table. `NetworksService` is exported for use by `WalletsModule`. |
| `wallets` | Accepts a `networkId` on creation, assigns a per-network unique `derivationIndex`, derives the address, persists to DB. |
| `assets` | Read-only access to the `assets` table. New tokens are added directly in the DB — `contractAddress` is `null` for ETH. |
| `indexer` | Subscribes to `provider.on('block')`. For each block: scans ETH value transfers and queries ERC20 `Transfer` logs per active asset. Upserts into `transactions` by `txHash`. |
| `transactions` | Stores confirmed on-chain transfers. Written exclusively by `IndexerService`. |
| `withdrawals` | Accepts withdrawal requests → persists to DB → enqueues a BullMQ job. `WithdrawalsProcessor` re-derives the signer, broadcasts the tx, then waits for 1 confirmation. |

### Withdrawal state machine

```
PENDING → BROADCASTING (tx hash assigned) → CONFIRMED
                                           ↘ FAILED
```

### Amount representation

All token amounts are stored and passed as `amountRaw` — an integer string in the token's smallest unit (wei for ETH, 6-decimal units for USDT, etc.). Conversion to human-readable form is the caller's responsibility using the `decimals` field on `Asset`.

### Adding a new supported token

Insert a row into the `assets` table:
```sql
INSERT INTO assets (symbol, name, contract_address, decimals, is_active)
VALUES ('USDT', 'Tether USD', '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, true);
```
For ETH, set `contract_address = NULL`.

### Database migrations

Schema is managed by [goose](https://github.com/pressly/goose) (external tool, not NestJS migrations). Install it once before running any `make migrate-*` commands:

```bash
# macOS
brew install goose

# Go toolchain
go install github.com/pressly/goose/v3/cmd/goose@latest
``` Migration files live in `database/migrations/` and are numbered sequentially.

```bash
make migrate-status                              # show applied / pending migrations
make migrate-up                                  # apply all pending migrations
make migrate-down                                # rollback last migration
make migrate-down-to version=00003               # rollback to a specific version
make migrate-reset                               # rollback everything
make migrate-create name=add_index_to_wallets    # create a new migration file
```

The Makefile reads DB credentials from `.env` via `-include .env`. On AWS set `DB_SSLMODE=require`; it defaults to `disable` for local development.

**Entity ↔ column name mapping**: all TypeORM entities use explicit `@Column({ name: 'snake_case' })` to match the snake_case column names in the SQL migrations. When adding a new column to an entity, always specify the `name` option — do not rely on TypeORM's default camelCase mapping.

### Configuration

All config is loaded via `@nestjs/config` namespace keys. The three registered namespaces are `database.*`, `kms.*`, and `ethereum.*` (see `src/common/config/`). Flat env vars (`JWT_SECRET`, `REDIS_HOST`, `REDIS_PORT`) are accessed directly without a namespace.

Copy `.env.example` to `.env` to get started locally.