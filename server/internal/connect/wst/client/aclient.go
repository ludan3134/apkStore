package client

import (
	"context"
	"github.com/annadance/proto/api/ws/v1/wsv1connect"
	"github.com/annadance/wst/internal/config/nodeconfig"

	"github.com/annadance/wst/internal/fastclient"

	"github.com/annadance/wst/h2client"

	"connectrpc.com/connect"

	"github.com/tsingson/logger"
	"go.uber.org/zap"
)

// Client is the grpc for aaa service.
type Client struct {
	auth *fastclient.FastClient
	cfg  *nodeconfig.Config
	grpc wsv1connect.WServiceClient
	// cache    *cache.Cache
	debug    bool
	log      *logger.Logger
	authMode bool
}

func NewClient(ctx context.Context, cfg *nodeconfig.Config, log *logger.Logger) (*Client, error) {
	log.Debug("client initialize")

	// ----------------------------------------------------------------------------------------------------------------
	log.Debug("try to connect AAA service",
		zap.String("addr", cfg.GrpcServiceAddress))

	// ----------------------------------------------------------------------------------------------------------------
	//log.Debug("try to connect redis")
	//var c *cache.Cache
	//c, err = cache.NewCache(ctx, cfg.RedisConfig, log)
	//if err != nil {
	//	log.Error("connect to redis error", zap.Error(err))
	//	return nil, err
	//}
	//log.Debug("connect to redis success")

	g := wsv1connect.NewWServiceClient(
		h2client.NewInsecureClient(),
		cfg.GrpcServiceAddress,
		connect.WithGRPC(),
	)

	a := &Client{
		auth: fastclient.New(),
		cfg:  cfg,
		log:  log,
		// cache:    c,
		grpc:     g,
		debug:    cfg.Debug,
		authMode: cfg.AuthMode,
	}

	// ----------------------------------------------------------------------------------------------------------------
	return a, nil
}

func (s *Client) Close() {
	//if s.cache != nil {
	//	s.cache.Close()
	//}
	if s.auth != nil {
		s.auth.Close()
	}
	if s.log != nil {
		s.log.Sync()
	}
}
