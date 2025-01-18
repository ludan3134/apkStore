package cache

import (
	"context"
	"time"

	"github.com/annadance/wst/redix"
	"github.com/annadance/wst/redix/redisconfig"

	"github.com/redis/rueidis"
	"github.com/redis/rueidis/rueidiscompat"

	"github.com/tsingson/logger"
	"go.uber.org/zap"
)

const (
	//LongCacheTTL       = time.Hour * 24 * 7 * 26 // time.Hour * 24 * 7 * 26
	//BlockCacheTTL      = time.Hour * 24          // time.Hour * 24 * 7 * 26
	//ShortCacheTTL      = time.Hour * 2
	//LocalCacheTTL      = time.Duration(15) * time.Minute
	//BlockLocalCacheTTL = time.Duration(30) * time.Minute
	TokenCacheTTL = 24 * time.Hour
)

type Cache struct {
	// pool *puddle.Pool[rueidis.Client]
	res   rueidis.Client
	cfg   *redisconfig.RedisConfig
	log   *logger.Logger
	debug bool
	ctx   context.Context
	// CacheTTL      time.Duration
	// LocalCacheTTL time.Duration
	// IPLimitTTL    time.Duration
}

// NewCache new
func NewCache(ctx context.Context, cfg *redisconfig.RedisConfig, log *logger.Logger) (*Cache, error) {
	l := log.Named("Cache.NewCache")
	// if cfg.TTL == 0 {
	cfg.TTL = TokenCacheTTL // time.Hour * 24 * 7
	//}
	a := &Cache{
		cfg:   cfg,
		log:   log,
		debug: false,
		ctx:   ctx,
		// CacheTTL:      LongCacheTTL,
		// LocalCacheTTL: LocalCacheTTL,
		// IPLimitTTL:    IPLimitTTL,
	}
	l.Info("connect to redis", zap.String("addr", cfg.Addr))
	p, err := redix.ConnectRedis(ctx, cfg, log)
	if err != nil {
		l.Error("connect to redis error", zap.Error(err))
		return nil, err
	}
	l.Info("connect to redis success")
	a.res = p
	return a, nil
}

// Reset the cache.
func (s *Cache) Reset(ctx context.Context) error {
	rdx := rueidiscompat.NewAdapter(s.res)

	return rdx.FlushAll(ctx).Err()
}

// Close the cache.
func (s *Cache) Close() {
	// s.pool.Close()
}
