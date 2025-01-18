// aaa 后台服务

package main

import (
	"context"
	"fmt"
	"github.com/annadance/wst/ap"
	"github.com/annadance/wst/internal/config/serviceconfig"
	"github.com/annadance/wst/internal/connect/wst/service"
	"go.uber.org/zap"
	"path/filepath"
	"runtime"
	"runtime/debug"

	"github.com/tsingson/logger"
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

	cfgPath := filepath.Join(path, serviceconfig.ConfigFilename)
	//fmt.Println("-----------------------cfgPath: ", cfgPath)
	//
	//cfgPath = "/home/ludan/wst/cmd/wsv/ws-config.toml"
	//cfgPath = "E:\\LocalRepository\\github\\wst\\cmd\\wsv\\ws-config.toml"
	cfg, err := serviceconfig.Load(cfgPath)
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

	s, err := service.NewService(ctx, cfg, log)
	if err != nil {
		log.Error("NewService error", zap.Error(err))
		return
	}

	log.Debug("-----------------service success-------------------------")

	err = s.Serve()
	if err != nil {
		log.Error("Serve error", zap.Error(err))
		return
	}
}
