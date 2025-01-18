package pgdbo

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestDbo_InsertAppsTEEST(t *testing.T) {
	err := dbo.InsertAppsTEEST(ctx)
	assert.NoError(t, err)
	if err == nil {
		t.Log("INsert ERRor ", err)
	}
}
