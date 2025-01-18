package pgdbo

import (
	"context"
	"fmt"
	"github.com/annadance/wst/internal/config/serviceconfig"
	"github.com/annadance/wst/internal/dbo/pgdbo/prepareSql"
	"go.uber.org/zap"

	"github.com/annadance/wst/dbv5"

	"github.com/annadance/wst/dbv5/postgresconfig5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/tsingson/logger"
)

// Dbo dbo
type Dbo struct {
	cfg   *postgresconfig5.PostgresConfig
	pool  *pgxpool.Pool
	log   *logger.ZapLogger
	debug bool
}

// NewWithDbPool connect db
func NewWithDbPool(ctx context.Context, cfg *postgresconfig5.PostgresConfig, dp *dbv5.DbPool, log *logger.ZapLogger) (*Dbo, error) { // 数据库配置
	cmsDb := &Dbo{
		cfg:   cfg,
		pool:  dp.GetPool(),
		log:   log,
		debug: cfg.Debug,
	}
	return cmsDb, nil
}

// NewDbo connect db
func NewDbo(ctx context.Context, cfg *serviceconfig.ServiceConfig, log *logger.ZapLogger) (*Dbo, error) { // 数据库配置
	fmt.Println("cfg.PostgresConfig", cfg.PostgresConfig)
	a, er1 := dbv5.NewDbPool(ctx, cfg.PostgresConfig, log, prepareSql.AfterConnectByWSV)
	if er1 != nil {
		log.Error("New db client initial", zap.Error(er1))
		return nil, er1
	}

	cmsDb := &Dbo{
		cfg:   cfg.PostgresConfig,
		pool:  a.GetPool(),
		log:   log,
		debug: cfg.Debug,
	}
	return cmsDb, nil
}

// NewDbo connect db
func NewNodeDbo(ctx context.Context, cfg *postgresconfig5.PostgresConfig, log *logger.ZapLogger) (*Dbo, error) { // 数据库配置
	fmt.Println("cfg.PostgresConfig", cfg)
	a, er1 := dbv5.NewDbPool(ctx, cfg, log, prepareSql.AfterConnectByWNV)
	if er1 != nil {
		log.Error("New db client initial", zap.Error(er1))
		return nil, er1
	}

	cmsDb := &Dbo{
		cfg:   cfg,
		pool:  a.GetPool(),
		log:   log,
		debug: cfg.Debug,
	}
	return cmsDb, nil
}

// Close pgx connection
func (s *Dbo) Close() {
	if s.pool != nil {
		s.pool.Close()
	}
}

// Acquire get connect
func (s *Dbo) Acquire(ctx context.Context) (*pgxpool.Conn, error) {
	if s.pool != nil {
		return s.pool.Acquire(ctx)
	}
	return nil, nil
}

func (s *Dbo) GetPool() *pgxpool.Pool {
	if s.pool != nil {
		return s.pool
	}
	return nil
}
