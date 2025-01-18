package dbv5

import (
	"context"

	"github.com/jackc/pgx/v5"
)

type (
	AfterConnectFunc func(ctx context.Context, conn *pgx.Conn) error

	AfterConnectList []AfterConnectFunc
)

func NewAfterConnectList(opts ...AfterConnectFunc) AfterConnectList {
	p := make([]AfterConnectFunc, 0)
	// p = append(p, afterConnectCheck)

	for _, o := range opts {
		p = append(p, o)
	}
	return p
}

func (c AfterConnectList) AfterConnect(ctx context.Context, conn *pgx.Conn) error {
	for _, f := range c {
		err := f(ctx, conn)
		if err != nil {
			return err
		}
	}
	return nil
}
