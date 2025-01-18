package dbv5

import (
	"context"

	"github.com/annadance/wst/dbv5/postgresconfig5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/tsingson/logger"
)

// DbPool dbo
type DbPool struct {
	cfg   *postgresconfig5.PostgresConfig
	pool  *pgxpool.Pool
	log   *logger.ZapLogger
	debug bool
}

func NewDbPool(ctx context.Context, cfg *postgresconfig5.PostgresConfig, log *logger.ZapLogger, opts ...AfterConnectFunc) (*DbPool, error) {
	a := NewAfterConnectList(opts...)

	pool, er1 := ConnectPool(ctx, cfg, a.AfterConnect, log)
	if er1 != nil {
		return nil, er1
	}
	cmsDb := &DbPool{
		cfg:   cfg,
		pool:  pool,
		log:   log,
		debug: cfg.Debug,
	}
	return cmsDb, nil
}

// Close pgx connection
func (s *DbPool) Close() {
	if s.pool != nil {
		s.pool.Close()
	}
}

// Acquire  get connect
func (s *DbPool) Acquire(ctx context.Context) (*pgxpool.Conn, error) {
	if s.pool != nil {
		return s.pool.Acquire(ctx)
	}
	return nil, nil
}

func (s *DbPool) GetPool() *pgxpool.Pool {
	if s.pool != nil {
		return s.pool
	}
	return nil
}
