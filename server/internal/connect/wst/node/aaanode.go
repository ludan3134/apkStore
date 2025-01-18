package node

import (
	"context"
	"github.com/annadance/wst/internal/dbo/pgdbo"
	"net"
	"time"

	"github.com/annadance/wst/internal/config/nodeconfig"
	"github.com/annadance/wst/internal/connect/wst/client"

	"github.com/valyala/fasthttp/reuseport"

	"github.com/fasthttp/router"
	"github.com/tsingson/logger"
	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
)

// Node is the Client for aaa service.
type Node struct {
	cfg    *nodeconfig.Config
	client *client.Client
	ln     net.Listener
	server *fasthttp.Server
	router *router.Router
	debug  bool
	log    *logger.Logger
	ctx    context.Context
	dbo    *pgdbo.Dbo
}

// NewNode creates a new Node
func NewNode(ctx context.Context, cfg *nodeconfig.Config, log *logger.Logger) (*Node, error) {
	log.Debug("aaa mac client initialize")

	c, err := client.NewClient(ctx, cfg, log)
	if err != nil {
		log.Error("client.NewClient error", zap.Error(err))
		return nil, err
	}
	dbo, err := pgdbo.NewNodeDbo(ctx, cfg.PostgresConfig, log)
	a := &Node{
		cfg:    cfg,
		log:    log,
		router: router.New(),
		debug:  cfg.Debug,
		ctx:    ctx,
		client: c,
		dbo:    dbo,
	}

	// ------------------------------------------------------------------------------------------------------------------
	log.Debug("aaa mac node initial success")
	return a, nil
}

// Close closes connect pool.
func (s *Node) Close() {
	s.log.Named("node.Close").Info("closing aaa client")
	if s.log != nil {
		s.log.Sync()
	}
	if s.ln != nil {
		_ = s.ln.Close()
	}
	if s.client != nil {
		s.client.Close()
	}
}

func (s *Node) Debug(b bool) *Node {
	s.debug = b
	return s
}

// Serve run
func (s *Node) Serve() (err error) {
	log := s.log.Named("node.serve ")
	log.Debug("start aaa server", zap.String("addr", s.cfg.HttpServerPort))
	// reuseport
	s.ln, err = reuseport.Listen("tcp4", s.cfg.HttpServerPort)
	if err != nil {
		log.Error("aaa error", zap.Error(err))
		return err
	}
	//
	s.setRouter()
	//
	s.server = &fasthttp.Server{
		Handler:            s.router.Handler,
		Name:               s.cfg.Name,
		MaxConnsPerIP:      1024 * 512,
		MaxRequestsPerConn: 1024 * 64,
		MaxRequestBodySize: 4 * 1024 * 1024 * 1024,
		Concurrency:        1024 * 1024 * 1024,
		DisableKeepalive:   true,
		TCPKeepalive:       false,
		IdleTimeout:        time.Duration(15) * time.Minute,
		Logger:             s.log,
	}
	log.Debug("try to start server")
	return s.server.Serve(s.ln)
}
