package h2client

import (
	"context"
	"crypto/tls"
	"net"
	"net/http"
	"time"

	"golang.org/x/net/http2"
)

const (
	HTTPReqTimeOut = 15 * time.Second
)

func NewInsecureClient() *http.Client {
	return &http.Client{
		CheckRedirect: func(_ *http.Request, _ []*http.Request) error {
			return http.ErrUseLastResponse
		},
		Timeout: time.Duration(15) * time.Minute,
		Transport: &http2.Transport{
			AllowHTTP: true,
			//DialTLS: func(network, addr string, _ *tls.Config) (net.Conn, error) {
			//	// If you're also using this client for non-h2c traffic, you may want
			//	// to delegate to tls.Dial if the network isn't TCP or the addr isn't
			//	// in an allowlist.
			//	return net.Dial(network, addr)
			//},
			DialTLSContext: func(ctx context.Context, network, addr string, _ *tls.Config) (net.Conn, error) {
				return (&net.Dialer{
					Timeout: HTTPReqTimeOut,
				}).DialContext(ctx, network, addr)
			},
			// Don't forget timeouts!
		},
	}
}
