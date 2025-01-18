package fastclient

import (
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/valyala/fasthttp"
)

const (
	contentText       = "text/plain; charset=utf8"
	contentUrlencoded = "application/x-www-form-urlencoded; charset=utf-8"
)

var doOnce sync.Once

type FastClient struct {
	Req    *fasthttp.Request
	Rsp    *fasthttp.Response
	Client *fasthttp.Client
	ttl    time.Duration
	echo   bool
}

// New fastClient
func New() *FastClient {
	var f *FastClient
	// doOnce.Do(func() {
	f = new(FastClient)
	f.Req = fasthttp.AcquireRequest()
	f.Rsp = fasthttp.AcquireResponse()
	f.Client = new(fasthttp.Client)
	f.Client.ReadBufferSize = 512 * 1024
	f.ttl = time.Second * 3 * 60
	f.echo = false

	return f
}

// NewOnce fastClient
func NewOnce() *FastClient {
	var f *FastClient
	doOnce.Do(func() {
		f = new(FastClient)
		f.Req = fasthttp.AcquireRequest()
		f.Rsp = fasthttp.AcquireResponse()
		f.Client = new(fasthttp.Client)
		f.Client.ReadBufferSize = 300 * 1024
		f.ttl = time.Second * 3 * 60
		f.echo = false
	})

	return f
}

func (s *FastClient) Release() {
	fasthttp.ReleaseRequest(s.Req)
	fasthttp.ReleaseResponse(s.Rsp)
	s.Client = nil
}

func (s *FastClient) Close() {
	s.Release()
}

func (s *FastClient) Prompt() *FastClient {
	s.echo = true
	return s
}

func (s *FastClient) Get(url string) (int, []byte, error) {
	s.Req.SetRequestURI(url)

	s.Req.Header.Add("User-Agent", `Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36`)
	err := s.Client.DoTimeout(s.Req, s.Rsp, s.ttl)
	if err != nil {
		return 0, nil, err
	}
	return s.Rsp.StatusCode(), s.Rsp.Body(), nil
}

func (s *FastClient) Post(u, payload string) (int, []byte, error) {
	s.Req.SetRequestURI(u)
	s.Req.SetBodyString(payload)
	s.Req.Header.SetMethod("POST")
	s.Req.Header.SetContentType(contentText)

	err := s.Client.DoTimeout(s.Req, s.Rsp, s.ttl)
	if err != nil {
		return 0, nil, err
	}
	return s.Rsp.StatusCode(), s.Rsp.Body(), nil
}

func (s *FastClient) PostWithUrlEncoded(u string, param map[string]string) (int, []byte, error) {
	s.Req.SetRequestURI(u)
	// 设置表单数据
	args := fasthttp.AcquireArgs()
	defer fasthttp.ReleaseArgs(args)
	for k, v := range param {
		args.Set(k, v)
	}

	// 将表单数据编码为 x-www-form-urlencoded 格式
	body := args.QueryString()
	s.Req.SetBody(body)

	s.Req.Header.SetMethod("POST")
	s.Req.Header.SetContentType(contentUrlencoded)

	err := s.Client.DoTimeout(s.Req, s.Rsp, s.ttl)
	if err != nil {
		return 0, nil, err
	}
	return s.Rsp.StatusCode(), s.Rsp.Body(), nil
}

// ParseURL get base url
func ParseURL(urlString string) (baseURL string, err error) {
	var u *url.URL
	u, err = url.Parse(urlString)
	if err != nil {
		return "", err
	}
	baseURL = u.Scheme + "://" + u.Hostname() + u.Port()
	baseURL = strings.Trim(baseURL, " ")
	return baseURL, nil
}
