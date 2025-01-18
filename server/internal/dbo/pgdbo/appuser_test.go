package pgdbo

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestDbo_QueryAppUserByMac(t *testing.T) {
	mac := "01:23:45:67:89:ac"
	byMac, err := dbo.QueryAppUserByMac(ctx, mac, tid)
	assert.NoError(t, err)
	assert.NotNil(t, byMac)
	if err == nil {
		t.Log("count Distributor ", byMac)
	}
}
