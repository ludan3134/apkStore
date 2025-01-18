package nodeconfig

import (
	"testing"

	"github.com/annadance/wst/internal/config/nodeconfig"

	"github.com/annadance/wst/ap"

	"github.com/stretchr/testify/assert"
)

func TestDefault(t *testing.T) {
	c := Default()
	assert.Equal(t, c.HttpServerPort, nodeconfig.HttpPort)
	_ = ap.SaveTOML(c, "testdata/"+ConfigFilename)
}

func TestLoad(t *testing.T) {
	c, err := Load("testdata/" + ConfigFilename)
	assert.Nil(t, err)
	assert.Equal(t, c.HttpServerPort, nodeconfig.HttpPort)
}
