// Package nodeconfig A3 边缘节点配置文件
package nodeconfig

import (
	"github.com/BurntSushi/toml"
	"github.com/annadance/wst/dbv5/postgresconfig5"
)

// Config current cfg struct
type Config struct {
	Name               string
	Debug              bool
	RunMode            string
	AuthMode           bool // false 内部验证, true 外部验证
	NodeId             string
	HttpServerPort     string
	GrpcServiceAddress string
	A3AuthNodeURL      string // A3 Auth Node URL
	TvA3AuthNodeURL    string // A3 Auth Node URL
	StoragePath        string // 文件存储地址
	AnotherStoragePath string // 文件存储地址
	FileName           string // 文件名
	FileDir            string //文件路径
	PostgresConfig     *postgresconfig5.PostgresConfig

	// UploadClientConfig *uploadclientconfig.UploadClientConfig
}

var _cfg = &Config{
	Name:               "edge-node-http-server-with-grpc-client-inside",
	Debug:              true,
	NodeId:             "1001",
	HttpServerPort:     HttpPort,
	GrpcServiceAddress: "http://127.0.0.1:8041",
	A3AuthNodeURL:      "http://127.0.0.1:8061/v", // 这个就是 V 接口
	TvA3AuthNodeURL:    "http://127.0.0.1:8062/v", // 这个就是 V 接口
	AuthMode:           true,
}

// Default default config for testing only
func Default() *Config {
	return _cfg
}

// Load config from file
func Load(f string) (*Config, error) {
	// 读取配置文件

	cfg := new(Config)
	_, err := toml.DecodeFile(f, &cfg)
	if err != nil {
		return nil, err
	}

	return cfg, nil
}
