package redix

import (
	"context"
	"errors"
	"github.com/annadance/wst/redix/redisconfig"
	"github.com/redis/rueidis"
	"github.com/redis/rueidis/rueidiscompat"
	"github.com/tsingson/logger"
	"net"
	"time"
)

// ConnectRedis connect redis
func ConnectRedis(ctx context.Context, cfg *redisconfig.RedisConfig, log *logger.Logger) (rueidis.Client, error) {
	l := log.Named("ConnectRedis")
	op := rueidis.ClientOption{
		InitAddress: []string{cfg.Addr},

		SelectDB:            cfg.DB,
		BlockingPoolSize:    2048,
		RingScaleEachConn:   2,
		CacheSizeEachConn:   512 * (1 << 20), // 512MB
		Dialer:              net.Dialer{KeepAlive: 15 * time.Minute},
		ReadBufferEachConn:  4 * (1 << 20), // 4MB
		WriteBufferEachConn: 4 * (1 << 20), // 4MB
		PipelineMultiplex:   1,
	}
	if len(cfg.Password) > 0 {
		op.Password = cfg.Password
	}
	rdb, err := rueidis.NewClient(op)
	if err != nil {
		return nil, err
	}

	l.Info("connect redis success")
	adapter := rueidiscompat.NewAdapter(rdb)
	ping := adapter.Ping(ctx)
	if ping.Err() == nil && ping.Val() == "PONG" {
		return rdb, nil
	}
	return nil, errors.New("ping redis error")
}
