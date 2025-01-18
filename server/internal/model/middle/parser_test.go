package middle

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParsePayload(t *testing.T) {
	str := "&a=1&b=2&c=3"
	mp, er := ParsePayload(str)
	assert.NoError(t, er)
	if er == nil {
		assert.Equal(t, mp["a"], "1")
		assert.Equal(t, mp["b"], "2")
		assert.Equal(t, mp["c"], "3")
	}
}
