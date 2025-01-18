package fastclient

import (
	"fmt"
	"testing"

	"github.com/annadance/wst/ap"

	"github.com/stretchr/testify/assert"
)

func TestFastClient_Get(t *testing.T) {
	fc := New()
	defer fc.Release()

	// code, payload, err := fc.Get("https://httpbin.org/ip")
	code, payload, err := fc.Get("http://108.181.14.229:8051/hello")
	assert.NoError(t, err)
	assert.Equal(t, 200, code)
	if code == 200 {
		fmt.Println(ap.B2S(payload))
	}
}

func TestFastClient_Post(t *testing.T) {
	fc := New()
	defer fc.Release()

	code, payload, err := fc.Post("https://httpbin.org/post", "hello")
	assert.NoError(t, err)
	assert.Equal(t, 200, code)
	if code == 200 {
		fmt.Println(ap.B2S(payload))
	}
}
