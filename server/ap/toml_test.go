package ap

import (
	"testing"

	"github.com/BurntSushi/toml"
	"github.com/stretchr/testify/assert"
)

type PostgresConf struct {
	Port     int32
	Database string
	User     string
	Password string
	Host     string
}
type Config struct {
	Debug        bool
	PostgresConf PostgresConf
}

func TestSaveTOML(t *testing.T) {
	a := &Config{
		Debug: true,
		PostgresConf: PostgresConf{
			Port:     2022,
			Database: "vktest",
			User:     "postgres",
			Password: "PWD",
			Host:     "122.122.122.122",
		},
	}
	err := SaveTOML(a, "testdata/config1.toml")
	assert.NoError(t, err)
}

func TestSaveTOML2(t *testing.T) {
	var conf Config
	_, err := toml.DecodeFile("testdata/config.toml", &conf)
	assert.NoError(t, err)
	assert.Equal(t, conf.PostgresConf.Port, int32(0))
	assert.Equal(t, conf.PostgresConf.Database, "vktest")
}
