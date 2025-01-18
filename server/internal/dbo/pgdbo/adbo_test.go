package pgdbo

import (
	"context"
	"github.com/annadance/wst/dbv5/postgresconfig5"
	"github.com/annadance/wst/internal/config/serviceconfig"
	"os"
	"testing"
	"time"

	"go.uber.org/zap"

	"github.com/jackc/pgx/v5/tracelog"

	"github.com/tsingson/logger"
)

var (
	cfg *postgresconfig5.PostgresConfig
	log *logger.ZapLogger
	dbo *Dbo
	ctx context.Context
	tid int64
)

// var conn *pgx.conn

func TestMain(m *testing.M) {
	// call flag.Parse() here if TestMain uses flags
	// goleak.VerifyTestMain(m)

	log = logger.New(logger.WithDebug())
	// log = logger.New()
	tid = time.Now().Unix()
	config := serviceconfig.ServiceConfig{}
	/**
	Password = "A^Me!4VGt#8"
	Database = "ukingottportal"
	Port = 39407
	Host = "167.114.174.85"
	*/
	cfg = &postgresconfig5.PostgresConfig{
		User:            "postgres",
		Database:        "rdb",
		Password:        "postgresqlPWD",
		Port:            6008,
		Host:            "47.120.68.50",
		LogLevel:        tracelog.LogLevelDebug,
		PoolConnections: "4",
	}
	config.PostgresConfig = cfg

	ctx = context.Background()
	var err error
	dbo, err = NewNodeDbo(ctx, cfg, log)
	if err != nil {
		log.Error("NewDbo", zap.Error(err))
	}

	// setup(true)
	os.Exit(m.Run())
}
