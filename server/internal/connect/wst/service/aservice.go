package service

import (
	"context"
	"fmt"
	"github.com/annadance/proto/api/ws/v1/wsv1connect"
	"github.com/annadance/wst/internal/cache"
	"github.com/annadance/wst/internal/config/serviceconfig"
	"github.com/annadance/wst/internal/connect/middleware"
	"github.com/annadance/wst/internal/dbo/pgdbo"
	"net"
	"net/http"

	"go.uber.org/zap"

	"connectrpc.com/connect"

	"github.com/jba/muxpatterns"
	"github.com/tsingson/logger"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	//_ "net/http/pprof"
)

const (
	PageSize = 4096
	MaxInt32 = 1<<31 - 1
)

type Service struct {
	cfg *serviceconfig.ServiceConfig
	//client *client.HttpClient
	ln    net.Listener
	srv   *http.Server
	log   *logger.Logger
	dbo   *pgdbo.Dbo
	cache *cache.Cache
	ctx   context.Context
}

func NewService(ctx context.Context, cfg *serviceconfig.ServiceConfig, log *logger.Logger) (*Service, error) {
	if len(cfg.GrpcServicePort) == 0 {
		err := fmt.Errorf("self address is empty")
		log.Error("NewService error", zap.Error(err))
		return nil, err
	}

	//hc, err := client.NewHttpClient(ctx, cfg.RequestConfig, log)
	//if err != nil {
	//	log.Error("client.NewClient error", zap.Error(err))
	//	return nil, err
	//}

	dbo, err := pgdbo.NewDbo(ctx, cfg, log)
	if err != nil {
		log.Error("NewDbo error", zap.Error(err))
		return nil, err
	}
	// ----------------------------------------------------------------------------------------------------------------
	log.Debug("try to connect redis")
	c, er1 := cache.NewCache(ctx, cfg.RedisConfig, log)
	if er1 != nil {
		log.Error("connect to redis error", zap.Error(er1))
		return nil, er1
	}
	log.Debug("connect to redis success")
	// ----------------------------------------------------------------------------------------------------------------

	return &Service{
		log:   log,
		cfg:   cfg,
		dbo:   dbo,
		cache: c,
		ctx:   ctx,
		//client: hc,
	}, nil
}

func (s *Service) handle(_ context.Context, _ connect.Spec, _ http.Header, r any) error {
	return connect.NewError(connect.CodeFailedPrecondition, fmt.Errorf("panic: %v", r))
}

func (s *Service) Serve() error {
	log := s.log.Named("rpc Serve")
	log.Debug("try to serve")
	// ----------------------------------------------------------------------------------------------------------------

	// stopSignal := make(chan struct{})
	//go func() {
	//	if err := http.ListenAndServe(":6060", nil); err != nil {
	//		panic("pprof server start error: " + err.Error())
	//	}
	//}()

	//----------------------------------------------------------------------------------------------------------------
	mux := muxpatterns.NewServeMux()
	// up := front.NewReactStaticFileServices(s.cfg.FileServerConfig, s.log)
	// imageHandler := http.StripPrefix(s.cfg.FileServerConfig.DownloadBaseURI,
	//	http.FileServer(http.Dir(s.cfg.FileServerConfig.StaticFileServerFullPath)))

	// mux.HandleFunc("/", up.HandleStatic)
	mux.Handle(wsv1connect.NewWServiceHandler(s,
		connect.WithRecover(s.handle),
		//connect.WithInterceptors(connect.UnaryInterceptorFunc(s.TokenAuthInterceptor)),
	))
	return http.ListenAndServe(
		s.cfg.GrpcServicePort,
		h2c.NewHandler(middleware.NewCORS().Handler(mux), &http2.Server{}),
	)
}

//func (s *Service) TokenAuthInterceptor(next connect.UnaryFunc) connect.UnaryFunc {
//	return func(ctx context.Context, request connect.AnyRequest) (connect.AnyResponse, error) {
//		apiName := filepath.Base(request.Spec().Procedure)
//		if apiName == "QueryMajorEventInfo" {
//			return next(ctx, request)
//		}
//
//		token := request.Header().Get("token")
//		u, err := jwt.ParseToken(token)
//		if err != nil {
//			s.log.Debug("ParseToken error: ", zap.Error(err))
//			return nil, connect.NewError(connect.CodeUnauthenticated, fmt.Errorf("token invalid,please login again"))
//		}
//		userInfo, err := s.cache.GetToken(ctx, u.RoleId, u.Id, token)
//		if err != nil {
//			s.log.Debug("SetToken error: ", zap.Error(err))
//			return nil, connect.NewError(connect.CodeUnauthenticated, fmt.Errorf("token invalid,please login again"))
//		}
//		//超级管理员默认所有权限
//		if userInfo.RoleId != 1 {
//			permission := false
//			for _, menu := range userInfo.MenuList {
//				if strings.Contains(menu.Path, apiName) {
//					permission = true
//				}
//			}
//			if !permission {
//				s.log.Debug("permission denied: ", zap.Bool("permission", permission), zap.Int32("uid", userInfo.Id), zap.Int32("roleId", userInfo.RoleId))
//				return nil, connect.NewError(connect.CodeUnauthenticated, fmt.Errorf("permission denied,please login again"))
//			}
//		}
//
//		ctx = context.WithValue(ctx, "user", userInfo)
//		return next(ctx, request)
//	}
//}
