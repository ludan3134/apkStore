package redisconfig

import (
	"time"

	"github.com/google/wire"
	"github.com/spf13/afero"

	"github.com/BurntSushi/toml"
)

var (
	Provider       = wire.NewSet(Loading) // Provider
	ConfigFullPath = ""                   // ConfigFullPath
)

const ConfigFilename = "redis-config.toml" // ConfigFilename

type RedisConfig struct {
	Addr     string        `json:"addr"`
	Password string        `json:"password"`
	DB       int           `json:"db"`
	TTL      time.Duration `json:"ttl"`
}

var _cfg = &RedisConfig{
	Addr:     "127.0.0.1:6009",
	Password: "redisPWD", // no password set
	DB:       1,          // use default DB
	TTL:      time.Second * 60 * 60 * 25,
}

// Option ProxyOption options
type Option func(*RedisConfig)

// WithDb debug
func WithDb(db int) Option {
	return func(o *RedisConfig) {
		o.DB = db
	}
}

func WithAddr(addr string) Option {
	return func(o *RedisConfig) {
		o.Addr = addr
	}
}

// WithPassword password
func WithPassword(pw string) Option {
	return func(o *RedisConfig) {
		o.Password = pw
	}
}

// WithTTL ttl
func WithTTL(ttl time.Duration) Option {
	return func(o *RedisConfig) {
		o.TTL = ttl
	}
}

// New postgres config
func New(opts ...Option) *RedisConfig {
	p := _cfg
	for _, o := range opts {
		o(p)
	}
	return p
}

func Default() *RedisConfig {
	return _cfg
}

// Load load
func Load(f string) (*RedisConfig, error) {
	// 读取配置文件

	cf := &RedisConfig{}
	_, err := toml.DecodeFile(f, &cf)
	if err != nil {
		return nil, err
	}
	return cf, nil
}

func Loading() (*RedisConfig, error) {
	fs := afero.NewOsFs()
	chk, er1 := afero.DirExists(fs, ConfigFullPath)

	if !chk {
		return nil, er1
	}
	f := ConfigFullPath + "/" + ConfigFilename
	cf := &RedisConfig{}
	_, err := toml.DecodeFile(f, &cf)
	if err != nil {
		return nil, err
	}
	return cf, nil
}
