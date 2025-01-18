package node

import (
	"encoding/json"
	"errors"
	"fmt"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	client "github.com/annadance/wst/internal/connect/wst/client"
	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
	"strconv"
	"strings"
)

func (s *Node) Login() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.Login ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- Login begin -------------")
		defer log.Info("-------------------------- Login end -------------")

		domain := B2S(ctx.Request.Host())

		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain error", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, struct{}{})
			return
		}
		if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
			domain = domain[:colonIndex]
		}
		if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
			domain = "http://" + domain
		}

		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "POST" {
			log.Error("method is not POST")
			ResponseReturn(ctx, MethodError, struct{}{})
			return
		}
		ip := ctx.RemoteIP().String()

		if len(B2S(ctx.Request.Header.Peek("X-Forwarded-For"))) > 0 {
			ip = B2S(ctx.Request.Header.Peek("X-Forwarded-For"))
		} // X-Forwarded-For
		ipt, err := IPStringToInt(ip)
		if err != nil {
			log.Error("get error remote ip")
			ipt, _ = IPStringToInt("127.0.0.1")
		}
		log.Debug("remote ip", zap.String("ip", ip), zap.Int64("ipt", ipt))

		// -----------------------------------------------ludan--------------------------------------------------------------

		payload := ctx.Request.Body()
		p := new(wsv1.AuthAccountRequest)
		err = json.Unmarshal(payload, p)
		p.AppUser.Ip = domain
		parts := strings.Split(domain, "-")
		// 检查是否有足够的部分
		if len(parts) == 4 {
			operator := parts[0] // "Chinanet"
			country := parts[1]  // "中国"
			//province := parts[2] // "广东"
			city := parts[3] // "深圳"
			p.AppUser.Operator = operator
			p.AppUser.Country = country
			p.AppUser.City = city
		} else {
			log.Error("json.Unmarshal error", zap.Error(err))
			ResponseReturn(ctx, ParamsError, struct{}{})
		}
		fmt.Println("我是node appUser", p.AppUser)
		//err = json.Unmarshal(payload, p)
		if err != nil {
			log.Error("json.Unmarshal error", zap.Error(err))
			ResponseReturn(ctx, ParamsError, struct{}{})
			return
		}
		account, b, err := s.client.GenerateAccount(ctx, p.GetAppUser())
		fmt.Println("account", account)
		if err != nil || !b {
			log.Error(" AuthAccount error", zap.Error(err))
			res := QueryError
			forReturn := client.AppUserForReturn{}
			//emptyAppUser, _ := json.Marshal(forReturn)
			emptyAppUser, _ := json.Marshal(forReturn.Token)
			if err.Error() == errors.New("no data").Error() {
				//状态码
				res = NoData
			}
			ResponseReturn(ctx, res, B2S(emptyAppUser))
			return
		}
		ResponseReturn(ctx, Success, B2S(account))
		return
	}
}
