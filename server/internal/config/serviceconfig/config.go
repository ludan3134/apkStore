package serviceconfig

import (
	"github.com/BurntSushi/toml"
	"github.com/annadance/wst/dbv5/postgresconfig5"
	"github.com/annadance/wst/redix/redisconfig"
)

type ServiceConfig struct {
	Debug              bool
	RunMode            string
	QaMode             bool
	Name               string
	NodeId             string
	GrpcServicePort    string
	PostgresConfig     *postgresconfig5.PostgresConfig
	RedisConfig        *redisconfig.RedisConfig
	DefaultDistributor string
	DefaultModel       string
}

// Load config from file
func Load(f string) (*ServiceConfig, error) {
	// 读取配置文件

	cfg := new(ServiceConfig)
	_, err := toml.DecodeFile(f, &cfg)
	if err != nil {
		return nil, err
	}

	return cfg, nil
}
