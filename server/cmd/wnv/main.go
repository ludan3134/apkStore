// a3 边缘服务器, 本身是一个 http 服务器, 同时也是 grpc 客户端, 用来访问 a3 服务器 asv
package main

import (
	"context"
	"fmt"
	"github.com/annadance/wst/internal/config/nodeconfig"
	"github.com/annadance/wst/internal/connect/wst/node"
	"path/filepath"
	"runtime"
	"runtime/debug"

	"github.com/annadance/wst/ap"

	"github.com/tsingson/logger"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func main() {
	runtime.MemProfileRate = 0
	runtime.GOMAXPROCS(runtime.NumCPU() * 4)            //runtime.NumCPU() * 4
	debug.SetMemoryLimit(int64(1 * 1024 * 1024 * 1024)) //1 * 1024 * 1024 * 1024
	debug.SetGCPercent(400)                             //400

	path, err := ap.GetCurrentExecDir()
	if err != nil {
		fmt.Println("get current exec dir error:", err)
		return
	}

	cfgPath := filepath.Join(path, nodeconfig.ConfigFilename)
	//cfgPath = "E:\\LocalRepository\\github\\wst\\cmd\\wnv\\wn-config.toml"
	//cfgPath = "/home/ludan/wst/cmd/wnv/wn-config.toml"
	//cfgPath = "/home/ludan/wst/cmd/wnv/wn-config.toml"

	fmt.Println("-----------------------cfgPath: ", cfgPath)

	cfg, err := nodeconfig.Load(cfgPath)
	if err != nil {
		fmt.Println("loading config error:", err)
		return
	}
	//litter.Dump(cfg)
	fmt.Println("-------------------- service environment: ", cfg.RunMode)
	if cfg.RunMode == "production" {
		ballast := make([]byte, 5*1024*1024*1024) //5*1024*1024*1024
		runtime.KeepAlive(ballast)
	}

	opts := []logger.ZapLoggerOption{logger.WithDays(31), logger.WithPrefix(cfg.RunMode)}
	if cfg.Debug {
		opts = append(opts, logger.WithDebug(), logger.WithLevel(zapcore.DebugLevel))
	} else {
		opts = append(opts, logger.WithLevel(zapcore.ErrorLevel))
	}

	log := logger.New(opts...)

	defer func() {
		log.Sync()
	}()

	log.Debug("logger init ok")

	ctx := context.Background()

	s, err := node.NewNode(ctx, cfg, log)
	if err != nil {
		log.Error("NewNode error", zap.Error(err))
		return
	}

	log.Debug("-----------------service success-------------------------")

	err = s.Serve()
	if err != nil {
		log.Error("Serve error", zap.Error(err))
		return
	}
}
