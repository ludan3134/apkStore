package node

import (
	"encoding/json"
	"errors"
	"fmt"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"github.com/valyala/fasthttp"
	"go.uber.org/zap"
	"os"
	"strconv"
	"strings"
	"time"
)

func (s *Node) QueryApps() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.QueryApps ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- QueryApps begin -------------")
		defer log.Info("-------------------------- QueryApps end -------------")

		domain := B2S(ctx.Request.Host())
		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain error", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, []struct{}{})
			return
		}

		if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
			domain = "http://" + domain
		}
		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "POST" {
			log.Error("method is not POST")
			ResponseReturn(ctx, MethodError, []struct{}{})
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
		//校验token
		a := ctx.Request.Header.Peek("authToken")
		authToken := B2S(a)
		log.Debug("get auth token", zap.String("token", authToken))

		if len(authToken) == 0 {
			er3 := errors.New("no token")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("no token"), []struct{}{})
			return
		}
		tokenCheck, user, er2 := s.client.AuthAccount(ctx, ip, authToken)
		fmt.Println("user", user)
		if er2 != nil {
			log.Error("auth error", zap.Error(er2))
			ResponseReturn(ctx, AuthError.SetMsg("token error"), []struct{}{})
			return
		}
		if !tokenCheck {
			er3 := errors.New("token verified error")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), []struct{}{})
			return
		}
		// -----------------------------------------------ludan--------------------------------------------------------------

		payload := ctx.Request.Body()
		p := new(wsv1.QueryAppsRequest)
		err = json.Unmarshal(payload, p)
		out, err2 := s.client.QueryApps(ctx, p.AppName, domain, user, tid)
		if err2 != nil {
			log.Error(" QueryApps error", zap.Error(err2))
			res := QueryError
			if err2.Error() == errors.New("no data").Error() {
				res = NoData
			}
			ResponseReturn(ctx, res, []struct{}{})
			return
		}
		ResponseReturn(ctx, Success, B2S(out))
		return
	}
}

func (s *Node) GetAppsCategories() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.GetAppsCategories ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- GetAppsCategories begin -------------")
		defer log.Info("-------------------------- GetAppsCategories end -------------")
		domain := B2S(ctx.Request.Host())
		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain erroclient.GetAppsCategoriesr", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, []struct{}{})
			return
		}
		//if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
		//	domain = domain[:colonIndex]
		//}
		if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
			domain = "http://" + domain
		}
		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "POST" {
			log.Error("method is not POST")
			ResponseReturn(ctx, MethodError, []struct{}{})
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
		//校验token
		a := ctx.Request.Header.Peek("authToken")
		authToken := B2S(a)
		log.Debug("get auth token", zap.String("token", authToken))

		if len(authToken) == 0 {
			er3 := errors.New("no token")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("no token"), []struct{}{})
			return
		}
		tokenCheck, user, er2 := s.client.AuthAccount(ctx, ip, authToken)
		fmt.Println("user", user)
		if er2 != nil {
			log.Error("auth error", zap.Error(er2))
			ResponseReturn(ctx, AuthError.SetMsg("token error"), []struct{}{})
			return
		}
		if !tokenCheck {
			er3 := errors.New("token verified error")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), []struct{}{})
			return
		}
		// -----------------------------------------------ludan--------------------------------------------------------------
		payload := ctx.Request.Body()
		p := new(wsv1.QueryAppsRequest)
		err = json.Unmarshal(payload, p)
		//err = json.Unmarshal(payload, p)
		if err != nil {
			log.Error("json.Unmarshal error", zap.Error(err))
			ResponseReturn(ctx, ParamsError, []struct{}{})
			return
		}
		out, err2 := s.client.GetAppsCategories(ctx, user, tid)
		if err2 != nil {
			log.Error(" QueryApps error", zap.Error(err2))
			res := QueryError
			if err2.Error() == errors.New("unknown: no data").Error() {
				//状态码
				res = NoData
			}
			ResponseReturn(ctx, res, []struct{}{})
			return
		}

		ResponseReturn(ctx, Success, B2S(out))
		return
	}
}

func (s *Node) GetAppsByCategories() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.GetAppsByCategories ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- GetAppsByCategories begin -------------")
		defer log.Info("-------------------------- GetAppsByCategories end -------------")

		domain := B2S(ctx.Request.Host())
		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain error", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, []struct{}{})
			return
		}
		//if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
		//	domain = domain[:colonIndex]
		//}
		if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
			domain = "http://" + domain
		}
		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "POST" {
			log.Error("method is not POST")
			ResponseReturn(ctx, MethodError, []struct{}{})
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
		//校验token
		a := ctx.Request.Header.Peek("authToken")
		authToken := B2S(a)
		log.Debug("get auth token", zap.String("token", authToken))

		if len(authToken) == 0 {
			er3 := errors.New("no token")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("no token"), []struct{}{})
			return
		}
		tokenCheck, user, er2 := s.client.AuthAccount(ctx, ip, authToken)
		fmt.Println("user", user)
		if er2 != nil {
			log.Error("auth error", zap.Error(er2))
			ResponseReturn(ctx, AuthError.SetMsg("token error"), []struct{}{})
			return
		}
		if !tokenCheck {
			er3 := errors.New("token verified error")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), []struct{}{})
			return
		}
		// -----------------------------------------------ludan--------------------------------------------------------------

		payload := ctx.Request.Body()

		p := new(wsv1.GetAppsByCategoriesRequest)
		err = json.Unmarshal(payload, p)
		//err = json.Unmarshal(payload, p)
		if err != nil {
			log.Error("json.Unmarshal error", zap.Error(err))
			ResponseReturn(ctx, ParamsError, []struct{}{})
			return
		}
		out, err2 := s.client.GetAppsByCategories(ctx, p.CategoriesId, domain, user, tid)
		if err2 != nil {
			log.Error(" QueryApps error", zap.Error(err2))
			res := QueryError
			if err2.Error() == errors.New("unknown: no data").Error() {
				//状态码
				res = NoData
			}
			ResponseReturn(ctx, res, []struct{}{})
			return
		}

		ResponseReturn(ctx, Success, B2S(out))
		return
	}
}
func (s *Node) GetAppsForPushDesktop() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.GetAppsForPushDesktop ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- GetAppsForPushDesktop begin -------------")
		defer log.Info("-------------------------- GetAppsForPushDesktop end -------------")

		domain := B2S(ctx.Request.Host())
		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain error", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, []struct{}{})
			return
		}
		//if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
		//	domain = domain[:colonIndex]
		//}
		if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
			domain = "http://" + domain
		}
		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "POST" {
			log.Error("method is not POST")
			ResponseReturn(ctx, MethodError, []struct{}{})
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
		//校验token
		a := ctx.Request.Header.Peek("authToken")
		authToken := B2S(a)
		log.Debug("get auth token", zap.String("token", authToken))

		if len(authToken) == 0 {
			er3 := errors.New("no token")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("no token"), []struct{}{})
			return
		}
		tokenCheck, user, er2 := s.client.AuthAccount(ctx, ip, authToken)
		fmt.Println("user", user)
		if er2 != nil {
			log.Error("auth error", zap.Error(er2))
			ResponseReturn(ctx, AuthError.SetMsg("token error"), []struct{}{})
			return
		}
		if !tokenCheck {
			er3 := errors.New("token verified error")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), []struct{}{})
			return
		}
		// -----------------------------------------------ludan--------------------------------------------------------------

		out, err2 := s.client.GetAppsByCategories(ctx, 10086, domain, user, tid)

		if err2 != nil {
			log.Error(" QueryApps error", zap.Error(err2))
			res := QueryError
			if err2.Error() == errors.New("unknown: no data").Error() {
				//状态码
				res = NoData
			}
			ResponseReturn(ctx, res, []struct{}{})
			return
		}

		ResponseReturn(ctx, Success, B2S(out))
		return
	}
}

func (s *Node) GetAppsByClass() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.GetAppsByClass ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- GetAppsByClass begin -------------")
		defer log.Info("-------------------------- GetAppsByClass end -------------")

		domain := B2S(ctx.Request.Host())
		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain error", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, []struct{}{})
			return
		}
		//if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
		//	domain = domain[:colonIndex]
		//}
		if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
			domain = "http://" + domain
		}
		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "POST" {
			log.Error("method is not POST")
			ResponseReturn(ctx, MethodError, []struct{}{})
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
		//校验token
		a := ctx.Request.Header.Peek("authToken")
		authToken := B2S(a)
		log.Debug("get auth token", zap.String("token", authToken))

		if len(authToken) == 0 {
			er3 := errors.New("no token")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("no token"), []struct{}{})
			return
		}
		tokenCheck, user, er2 := s.client.AuthAccount(ctx, ip, authToken)
		fmt.Println("user", user)
		if er2 != nil {
			log.Error("auth error", zap.Error(er2))
			ResponseReturn(ctx, AuthError.SetMsg("token error"), []struct{}{})
			return
		}
		if !tokenCheck {
			er3 := errors.New("token verified error")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), []struct{}{})
			return
		}
		// -----------------------------------------------ludan--------------------------------------------------------------

		payload := ctx.Request.Body()

		p := new(wsv1.GetAppsByClassRequest)
		err = json.Unmarshal(payload, p)
		//err = json.Unmarshal(payload, p)
		if err != nil {
			log.Error("json.Unmarshal error", zap.Error(err))
			ResponseReturn(ctx, ParamsError, []struct{}{})
			return
		}
		out, err2 := s.client.GetAppsByClass(ctx, p.ClassVersion, domain, user, tid)
		if err2 != nil {
			log.Error(" QueryApps error", zap.Error(err2))
			res := QueryError
			if err2.Error() == errors.New("unknown: no data").Error() {
				//状态码
				res = NoData
			}
			ResponseReturn(ctx, res, []struct{}{})
			return
		}

		ResponseReturn(ctx, Success, B2S(out))
		return
	}
}
func (s *Node) QueryAppsNewestVersion() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.QueryAppsNewestVersion ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- QueryAppsNewestVersion begin -------------")
		defer log.Info("-------------------------- QueryAppsNewestVersion end -------------")
		//获取域名
		domain := B2S(ctx.Request.Host())
		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain error", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, []struct{}{})
			return
		}
		//if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
		//	domain = domain[:colonIndex]
		//}
		if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
			domain = "http://" + domain
		}
		//获取域名

		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "POST" {
			log.Error("method is not POST")
			ResponseReturn(ctx, MethodError, []struct{}{})
			return
		}
		// -------------------------------------------------------------------------------------------------------------
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
		//校验token
		a := ctx.Request.Header.Peek("authToken")
		authToken := B2S(a)
		log.Debug("get auth token", zap.String("token", authToken))

		if len(authToken) == 0 {
			er3 := errors.New("no token")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("no token"), []struct{}{})
			return
		}
		tokenCheck, user, er2 := s.client.AuthAccount(ctx, ip, authToken)
		fmt.Println("user", user)
		if er2 != nil {
			log.Error("auth error", zap.Error(er2))
			ResponseReturn(ctx, AuthError.SetMsg("token error"), []struct{}{})
			return
		}
		if !tokenCheck {
			er3 := errors.New("token verified error")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), []struct{}{})
			return
		}
		// -----------------------------------------------ludan--------------------------------------------------------------

		payload := ctx.Request.Body()

		p := new(wsv1.QueryAppsNewestVersionRequest)
		err = json.Unmarshal(payload, p)
		//err = json.Unmarshal(payload, p)
		if err != nil {
			log.Error("json.Unmarshal error", zap.Error(err))
			ResponseReturn(ctx, ParamsError, []struct{}{})
			return
		}

		out, err2 := s.client.QueryAppsNewestVersion(ctx, p.ClassVersion, domain, user, tid)
		if err2 != nil {
			log.Error(" QueryApps error", zap.Error(err2))
			res := QueryError
			if err2.Error() == errors.New("unknown: no data").Error() {
				//状态码
				res = NoData
			}
			ResponseReturn(ctx, res, []struct{}{})
			return
		}

		ResponseReturn(ctx, Success, B2S(out))
		return
	}
}
func (s *Node) UpdateSelf() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.UpdateSelf ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- UpdateSelf begin -------------")
		defer log.Info("-------------------------- UpdateSelf end -------------")
		//获取域名
		domain := B2S(ctx.Request.Host())
		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain error", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, struct{}{})
			return
		}
		//if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
		//	domain = domain[:colonIndex]
		//}
		if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
			domain = "http://" + domain
		}
		//获取域名

		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "POST" {
			log.Error("method is not POST")
			ResponseReturn(ctx, MethodError, struct{}{})
			return
		}
		// -------------------------------------------------------------------------------------------------------------
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
		//// -------------------------------------------------------------------------------------------------------------
		//校验token
		a := ctx.Request.Header.Peek("authToken")
		authToken := B2S(a)
		log.Debug("get auth token", zap.String("token", authToken))

		if len(authToken) == 0 {
			er3 := errors.New("no token")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("no token"), struct{}{})
			return
		}
		tokenCheck, user, er2 := s.client.AuthAccount(ctx, ip, authToken)
		fmt.Println("user", user)
		if er2 != nil {
			log.Error("auth error", zap.Error(er2))
			ResponseReturn(ctx, AuthError.SetMsg("token error"), struct{}{})
			return
		}
		if !tokenCheck {
			er3 := errors.New("token verified error")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), struct{}{})
			return
		}
		// -----------------------------------------------ludan--------------------------------------------------------------

		payload := ctx.Request.Body()

		p := new(wsv1.UpdateSelfRequest)
		err = json.Unmarshal(payload, p)
		//err = json.Unmarshal(payload, p)
		if err != nil {
			log.Error("json.Unmarshal error", zap.Error(err))
			ResponseReturn(ctx, ParamsError, struct{}{})
			return
		}

		out, err2 := s.client.UpdateSelf(ctx, p.ClassVersion, domain, user, tid)
		if err2 != nil {
			log.Error(" QueryApps error", zap.Error(err2))
			res := QueryError
			if err2.Error() == errors.New("unknown: no data").Error() {
				//状态码
				res = NoData
			}
			ResponseReturn(ctx, res, struct{}{})
			return
		}

		ResponseReturn(ctx, Success, B2S(out))
		return
	}
}
func (s *Node) GetAppDownloadUrl() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.GetAppDownloadUrl ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- GetAppDownloadUrl begin -------------")
		defer log.Info("-------------------------- GetAppDownloadUrl end -------------")

		domain := B2S(ctx.Request.Host())
		if len(strings.TrimSpace(domain)) <= 0 {
			log.Error("domain error", zap.String("domain", domain))
			ResponseReturn(ctx, DomainError, struct{}{})
			return
		}
		//if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
		//	domain = domain[:colonIndex]
		//}
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

		a := ctx.Request.Header.Peek("authToken")
		authToken := B2S(a)
		log.Debug("get auth token", zap.String("token", authToken))

		if len(authToken) == 0 {
			er3 := errors.New("no token")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("no token"), struct{}{})
			return
		}
		tokenCheck, user, er2 := s.client.AuthAccount(ctx, ip, authToken)
		fmt.Println("user", user)
		if er2 != nil {
			log.Error("auth error", zap.Error(er2))
			ResponseReturn(ctx, AuthError.SetMsg("token error"), struct{}{})
			return
		}
		if !tokenCheck {
			er3 := errors.New("token verified error")
			log.Error("auth error", zap.Error(er3))
			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), struct{}{})
			return
		}
		// -----------------------------------------------ludan--------------------------------------------------------------

		payload := ctx.Request.Body()

		p := new(wsv1.GetAppDownloadUrlRequest)
		err = json.Unmarshal(payload, p)
		if err != nil {
			log.Error("json.Unmarshal error", zap.Error(err))
			ResponseReturn(ctx, ParamsError, struct{}{})
			return
		}
		out, err2 := s.client.GetAppDownloadUrl(ctx, domain, p.AppInfo, user)
		if err2 != nil {
			log.Error(" AuthAccount error", zap.Error(err2))
			res := QueryError
			if err2.Error() == errors.New("no data").Error() {
				//状态码
				res = NoData
			}
			ResponseReturn(ctx, res, struct{}{})
			return
		}
		ResponseReturn(ctx, Success, B2S(out))
		return
	}
}
func (s *Node) downloadFile() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		tid := int64(ctx.ID())
		log := s.log.Named(StrBuilder("node.downloadFile ", strconv.FormatInt(tid, 10)))
		log.Info("-------------------------- /downloadFile begin -------------")
		defer log.Info("-------------------------- /downloadFile end -------------")

		method := B2S(ctx.Method())
		log.Debug("method", zap.String("method", method))

		if method != "GET" {
			log.Error("method is not GET")
			ResponseReturn(ctx, MethodError, struct{}{})
			return
		}

		//获取路径参数
		paramValue := ctx.UserValue("filePath")
		if paramValue == nil {
			err := errors.New("path parameter not found")
			log.Error("Path parameter not found", zap.Error(err))
			ResponseReturn(ctx, ParamsError.SetMsg("Path parameter not found"), struct{}{})
			return
		}
		////路径参数定义为字符串
		paramStr, ok := paramValue.(string)
		if !ok {
			err := errors.New("invalid parameter type")
			log.Error("Invalid parameter type", zap.Error(err))
			ResponseReturn(ctx, ParamsError.SetMsg("Invalid parameter type"), struct{}{})
			return
		}
		//解密
		decodedByte, err := ap.DePwdCode(paramStr, S2B("8jh4jd82e92is0iw"))
		if err != nil {
			log.Error("decoded error", zap.Error(err))
			ResponseReturn(ctx, ParamsError.SetMsg("decoded error"), struct{}{})
			return
		}
		decoded := B2S(decodedByte)
		decodedArr := strings.Split(decoded, "##")
		if len(decodedArr) != 2 {
			err := errors.New("strings.Split error")
			log.Error("strings.Split error", zap.Error(err))
			ResponseReturn(ctx, ParamsError.SetMsg("strings.Split error"), struct{}{})
			return
		}
		// -------------------------------------------------------------------------------------------------------------
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
		//校验时间戳
		currentTime := time.Now()
		timestampStr := decodedArr[1]
		timestamp, err := strconv.ParseInt(timestampStr, 10, 64)
		if err != nil {
			log.Error("Error parsing timestamp", zap.Error(err))
			ResponseReturn(ctx, ParamsError.SetMsg("Error parsing timestamp"), struct{}{})
			return
		}
		if currentTime.Unix() > timestamp {
			log.Error("Current time is greater than timestamp")
			ResponseReturn(ctx, AuthError, struct{}{})
			return
		}
		// 读取文件内容
		filePath := s.cfg.StoragePath + decodedArr[0]
		file, err := os.Open(filePath)
		fmt.Println("第一次读取的filePath:", filePath)
		if err != nil {
			log.Error("Error open file", zap.Error(err), zap.String("file path", filePath))
			//ResponseReturn(ctx, FileError.SetMsg("Error open file"), struct{}{})
			//return
			filePath = s.cfg.AnotherStoragePath + decodedArr[0]
		}

		file, err = os.Open(filePath)
		fmt.Println("第二次读取的filePath:", filePath)

		if err != nil {
			log.Error("Error open file", zap.Error(err), zap.String("another file path", filePath))
			ResponseReturn(ctx, FileError.SetMsg("Error open file"), struct{}{})
			return
		}

		defer file.Close()
		ctx.SendFile(filePath)
		return
		//获取文件信息
		//fileInfo, err := file.Stat()
		//if err != nil {
		//	log.Error("Error Stat file", zap.Error(err), zap.String("file path", filePath))
		//	ResponseReturn(ctx, FileError.SetMsg("Error Stat file"), struct{}{})
		//	return
		//}
		//fileSize := fileInfo.Size()
		//解析range头
		//rangeHeader := B2S(ctx.Request.Header.Peek("Range"))
		//ctx.Response.Header.Set("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filepath.Base(decodedArr[0])))
		//if rangeHeader != "" {
		//	// 格式示例: "bytes 500-999"
		//	start, end, err := parseRangeHeader(rangeHeader, fileSize)
		//	if err != nil {
		//		log.Error("parseRangeHeader Error", zap.Error(err), zap.String("file path", filePath))
		//		ResponseReturn(ctx, RangeError, struct{}{})
		//		return
		//	}
		//
		//	// 设置 Content-Range 头
		//	ctx.Response.Header.Set("Content-Range", fmt.Sprintf("bytes %d-%d/%d", start, end, fileSize))
		//
		//	// 设置 Content-Length 头
		//	ctx.Response.Header.Set("Content-Length", strconv.FormatInt(end-start+1, 10))
		//
		//	// 设置状态码为 206 Partial Content
		//	ctx.SetStatusCode(fasthttp.StatusPartialContent)
		//
		//	// 发送文件部分内容
		//	_, err = file.Seek(start, 0)
		//	if err != nil {
		//		log.Error("seek Error", zap.Error(err), zap.String("file path", filePath))
		//		ResponseReturn(ctx, FileError, struct{}{})
		//		return
		//	}
		//	// 使用 ctx.Write 提供的方法发送部分内容
		//	buf := make([]byte, end-start+1)
		//	_, err = io.ReadFull(file, buf)
		//	if err != nil {
		//		log.Error("ReadFull Error", zap.Error(err), zap.String("file path", filePath))
		//		ResponseReturn(ctx, InternalError, struct{}{})
		//		return
		//	}
		//	_, err = ctx.Write(buf)
		//	if err != nil {
		//		log.Error("ctx write Error", zap.Error(err), zap.String("file path", filePath))
		//		ResponseReturn(ctx, InternalError, struct{}{})
		//		return
		//	}
		//} else {
		//	ctx.SendFile(filePath)
		//}
	}
}
