package dbv5

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/annadance/wst/dbv5/postgresconfig5"

	"github.com/jackc/pgx/v5/tracelog"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"github.com/tsingson/logger"
)

// PrepareConfig prepare configuration from vkconfig
func prepareConfig(cfg *postgresconfig5.PostgresConfig) *pgx.ConnConfig {
	//config, _ := pgx.ParseConfig(fmt.Sprintf("postgres://%s:%s@%s:%d/%s", cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Database))
	config, _ := pgx.ParseConfig("")
	config.Host = cfg.Host
	config.Port = cfg.Port
	config.User = cfg.User
	config.Password = cfg.Password
	config.Database = cfg.Database
	fmt.Sprintf("postgres://%s:%s@%s:%d/%s", cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Database)
	if len(cfg.RuntimeParams) > 0 {
		config.RuntimeParams = cfg.RuntimeParams
	} else {
		config.RuntimeParams = map[string]string{"application_name": "ut"}
	}
	if len(cfg.ApplicationName) > 0 {
		config.RuntimeParams["application_name"] = cfg.ApplicationName
	} else {
		config.RuntimeParams["application_name"] = "ut"
	}

	config.DefaultQueryExecMode = pgx.QueryExecModeCacheDescribe
	config.StatementCacheCapacity = 512
	config.DescriptionCacheCapacity = 512
	return config
}

// Connect connect to database in pgx v4
func Connect(ctx context.Context, pCfg *postgresconfig5.PostgresConfig,
	afterConnect func(context.Context, *pgx.Conn) error, log *logger.ZapLogger,
) (conn *pgx.Conn, err error) {
	cfg := prepareConfig(pCfg)

	trace := &tracelog.TraceLog{
		Logger:   logger.NewPgxLogger(log.Log),
		LogLevel: pCfg.LogLevel,
	}

	if pCfg.Debug {
		trace.LogLevel = tracelog.LogLevelTrace
	}

	cfg.Tracer = trace

	conn, err = pgx.ConnectConfig(ctx, cfg)

	if err != nil {
		log.Error("Unable to create connection", zap.Error(err))
		return nil, err
	}

	if afterConnect != nil {
		err = afterConnect(ctx, conn)
		if err != nil {
			_ = conn.Close(ctx)
			log.Error("prepare sql statement error", zap.Error(err))
			return nil, err
		}
	}

	// conn.ConnInfo().RegisterDataType(pgtype.DataType{
	// 	Value: &pgxuuid.UUID{},
	// 	Name:  "uuid",
	// 	OID:   2950,
	// })

	return conn, nil
}

// ConnectPool connect pool to postgres in pgx v4
func ConnectPool(ctx context.Context, pCfg *postgresconfig5.PostgresConfig,
	afterConnect func(context.Context, *pgx.Conn) error, log *logger.ZapLogger,
) (*pgxpool.Pool, error) {
	cfg := prepareConfig(pCfg)

	trace := &tracelog.TraceLog{
		Logger:   logger.NewPgxLogger(log.Log),
		LogLevel: pCfg.LogLevel,
	}

	if pCfg.Debug {
		// trace.LogLevel = tracelog.LogLevelDebug
		// trace.LogLevel = tracelog.LogLevelTrace
		trace.LogLevel = pCfg.LogLevel
	} else {
		trace.LogLevel = tracelog.LogLevelError
	}

	cfg.Tracer = trace

	var poolConfig *pgxpool.Config

	poolConnect := strings.TrimSpace(pCfg.PoolConnections)
	pc, er0 := strconv.Atoi(poolConnect)
	if er0 == nil && pc > 0 && pc < 43 {
		if len(poolConnect) > 0 {
			poolConfig, _ = pgxpool.ParseConfig("pool_max_conns=" + poolConnect + " pool_min_conns=1")
		}
	} else {
		// config, err := pgxpool.ParseConfig("pool_max_conns=42 pool_min_conns=1")
		pc = runtime.NumCPU()
		poolConfig, _ = pgxpool.ParseConfig("pool_max_conns=8 pool_min_conns=1")
	}

	poolConfig.ConnConfig = cfg
	poolConfig.HealthCheckPeriod = 5 * time.Minute
	poolConfig.MaxConnLifetime = 8 * time.Hour
	poolConfig.AfterConnect = afterConnect
	poolConfig.MaxConns = int32(pc)

	// poolConfig.BeforeAcquire
	return pgxpool.NewWithConfig(ctx, poolConfig)
}
