package postgresconfig5

import (
	"github.com/BurntSushi/toml"
	"github.com/google/wire"
	"github.com/jackc/pgx/v5/tracelog"
	"github.com/spf13/afero"
)

var (
	Provider       = wire.NewSet(Loading) // Provider
	ConfigFullPath = ""                   // ConfigFullPath
)

const ConfigFilename = "postgres-config.toml"

// PostgresConfig  postgres configuration
type PostgresConfig struct {
	ApplicationName string
	RuntimeParams   map[string]string
	Database        string
	User            string
	Password        string
	Host            string
	PoolConnections string
	LogLevel        tracelog.LogLevel
	Port            uint16
	Debug           bool
}

// var _defaultLog = logger.New(logger.WithDebug(),
// 	logger.WithDays(31),
// 	logger.WithLevel(zapcore.DebugLevel),
// 	logger.WithStoreInDay())

// Option ProxyOption options
type Option func(*PostgresConfig)

// WithHost new server port in string
func WithHost(host string, port uint16) Option {
	return func(o *PostgresConfig) {
		o.Host = host
		o.Port = port
	}
}

// WithDatabase with
func WithDatabase(dbname string) Option {
	return func(o *PostgresConfig) {
		o.Database = dbname
	}
}

func WithApplicationName(name string) Option {
	return func(o *PostgresConfig) {
		if len(name) > 0 {
			o.ApplicationName = name
		} else {
			o.ApplicationName = "ut"
		}
	}
}

// WithUserPassword options
func WithUserPassword(user, password string) Option {
	return func(o *PostgresConfig) {
		o.User = user
		o.Password = password
	}
}

// WithLogLevel new server port in string
func WithLogLevel(level tracelog.LogLevel) Option {
	return func(o *PostgresConfig) {
		if level > 0 {
			o.LogLevel = level
		} else {
			o.LogLevel = tracelog.LogLevelError
		}
	}
}

// WithDebug debug
func WithDebug(l bool) Option {
	return func(o *PostgresConfig) {
		o.Debug = l
		if l {
			o.LogLevel = tracelog.LogLevelTrace
		}
	}
}

// WithRuntimeParams options
func WithRuntimeParams(r map[string]string) Option {
	return func(o *PostgresConfig) {
		for k, v := range r {
			o.RuntimeParams[k] = v
		}
	}
}

// New postgres config
func New(opts ...Option) *PostgresConfig {
	p := new(PostgresConfig)

	// statement_cache_mode=describe
	//	p.RuntimeParams["statement_cache_mode"] = "describe"

	for _, o := range opts {
		o(p)
	}
	return p
}

// SetLogLevel  set logger
func (p *PostgresConfig) SetLogLevel(level tracelog.LogLevel) {
	p.LogLevel = level
}

// Load load
func Load(f string) (*PostgresConfig, error) {
	// 读取配置文件

	cf := &PostgresConfig{}
	_, err := toml.DecodeFile(f, &cf)
	if err != nil {
		return nil, err
	}
	if cf.LogLevel == 0 {
		cf.LogLevel = tracelog.LogLevelError
	}
	if cf.Debug {
		cf.LogLevel = tracelog.LogLevelTrace
	}
	return cf, nil
}

// Loading configuration
func Loading() (*PostgresConfig, error) {
	// 读取配置文件

	fs := afero.NewOsFs()
	chk, er1 := afero.DirExists(fs, ConfigFullPath)

	if !chk {
		return nil, er1
	}

	f := ConfigFullPath + "/" + ConfigFilename

	cf := &PostgresConfig{}
	_, err := toml.DecodeFile(f, &cf)
	if err != nil {
		return nil, err
	}
	if cf.LogLevel == 0 {
		cf.LogLevel = tracelog.LogLevelError
	}
	if cf.Debug {
		cf.LogLevel = tracelog.LogLevelTrace
	}
	return cf, nil
}
