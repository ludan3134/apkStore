package node

import "time"

const (
	contentJSON    = "application/json; charset=utf-8"
	cacheTimeOut   = time.Duration(60) * time.Second
	AcceptJSON     = "application/vnd.pgrst.object+json; charset=utf-8"
	acceptJson     = "application/json"
	acceptRest     = "application/vnd.pgrst.object+json"
	contentText    = "text/plain; charset=utf8"
	contentRest    = "application/vnd.pgrst.object+json; charset=utf-8"
	ContentJson    = "application/json; charset=utf-8"
	cacheSize      = 1024 * 1204 * 512
	idleTimeout    = time.Duration(60) * time.Second
	MaxHTTPConnect = 30000
	BufferSize     = 1024 * 2
	TTL            = time.Second * 15
	contentStream  = "application/octet-stream"
)
