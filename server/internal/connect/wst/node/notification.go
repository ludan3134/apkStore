package node

//func (s *Node) getNotification() func(ctx *fasthttp.RequestCtx) {
//	return func(ctx *fasthttp.RequestCtx) {
//		tid := int64(ctx.ID())
//		log := s.log.Named(StrBuilder("node.getNotification ", strconv.FormatInt(tid, 10)))
//		log.Info("-------------------------- getNotification begin -------------")
//		defer log.Info("-------------------------- getNotification end -------------")
//		//domain := B2S(ctx.Request.Host())
//		//if len(strings.TrimSpace(domain)) <= 0 {
//		//	log.Error("domain error", zap.String("domain", domain))
//		//	ResponseReturn(ctx, DomainError, []struct{}{})
//		//	return
//		//}
//		//if !strings.Contains(domain, "https://") && !strings.Contains(domain, "http://") {
//		//	domain = "http://" + domain
//		//}
//		//method := B2S(ctx.Method())
//		//log.Debug("method", zap.String("method", method))
//		//
//		//if method != "POST" {
//		//	log.Error("method is not POST")
//		//	ResponseReturn(ctx, MethodError, []struct{}{})
//		//	return
//		//}
//		// -------------------------------------------------------------------------------------------------------------
//		ip := ctx.RemoteIP().String()
//
//		if len(B2S(ctx.Request.Header.Peek("X-Forwarded-For"))) > 0 {
//			ip = B2S(ctx.Request.Header.Peek("X-Forwarded-For"))
//		} // X-Forwarded-For
//		ipt, err := IPStringToInt(ip)
//		if err != nil {
//			log.Error("get error remote ip")
//			ipt, _ = IPStringToInt("127.0.0.1")
//		}
//		log.Debug("remote ip", zap.String("ip", ip), zap.Int64("ipt", ipt))
//		// -------------------------------------------------------------------------------------------------------------
//		//获取路径参数
//		paramValue := ctx.UserValue("portType")
//		if paramValue == nil {
//			log.Error("Path parameter not found")
//			ResponseReturn(ctx, ParamsError.SetMsg("Path parameter not found"), struct{}{})
//			return
//		}
//		//路径参数定义为字符串
//		paramStr, ok := paramValue.(string)
//		if !ok {
//			log.Error("Invalid parameter type")
//			ResponseReturn(ctx, ParamsError.SetMsg("Invalid parameter type"), struct{}{})
//			return
//		}
//		if paramStr != "ott" && paramStr != "tv" {
//			log.Error("Invalid parameter", zap.String("portType", paramStr))
//			ResponseReturn(ctx, ParamsError.SetMsg("Invalid parameter"), struct{}{})
//			return
//		}
//		log.Debug("portType=", zap.String("portType", paramStr))
//		// -------------------------------------------------------------------------------------------------------------
//		a := ctx.Request.Header.Peek("A")
//		authToken := B2S(a)
//		log.Debug("get auth token", zap.String("token", authToken))
//
//		if len(authToken) == 0 {
//			er3 := errors.New("no token")
//			log.Error("auth error", zap.Error(er3))
//			ResponseReturn(ctx, AuthError.SetMsg("no token"), struct{}{})
//			return
//		}
//		tokenCheck, er2 := s.client.Auth(paramStr, authToken, tid)
//		if er2 != nil {
//			log.Error("auth error", zap.Error(er2))
//			ResponseReturn(ctx, AuthError.SetMsg("token error"), struct{}{})
//			return
//		}
//		if !tokenCheck {
//			er3 := errors.New("token verified error")
//			log.Error("auth error", zap.Error(er3))
//			ResponseReturn(ctx, AuthError.SetMsg("token verified error"), struct{}{})
//			return
//		}
//		// -------------------------------------------------------------------------------------------------------------
//
//		payload := ctx.Request.Body()
//
//		p := new(wsv1.GeneralRequest)
//		err = json.Unmarshal(payload, p)
//		if err != nil {
//			log.Error("json.Unmarshal error", zap.Error(err))
//			ResponseReturn(ctx, ParamsError, struct{}{})
//			return
//		}
//
//		timestamp := strconv.FormatInt(p.Timestamp, 10)
//		log.Debug("mac", zap.String("mac", p.Mac))
//		log.Debug("timestamp", zap.String("timestamp", timestamp))
//		log.Debug("sign", zap.String("sign", p.Sign))
//
//		md5Str := CalculateMD5(StrBuilder(p.Mac, timestamp, "getNotification"))
//		aesPwdBytes, err := ap.DePwdCode(p.Sign, S2B(md5Str[:16])) //mac-model_name-version-timestamp
//		if err != nil {
//			log.Error("DePwdCode error", zap.Error(err))
//			ResponseReturn(ctx, DePwdCodeError, struct{}{})
//			return
//		}
//
//		aesPwdList := strings.Split(B2S(aesPwdBytes), "-")
//		if len(aesPwdList) != 4 {
//			log.Error("DePwdCode split error", zap.String("sign", p.Sign))
//			ResponseReturn(ctx, DePwdCodeError.SetMsg("length error"), struct{}{})
//			return
//		}
//		log.Debug("aesPwdList", zap.Any("aesPwdList", aesPwdList))
//
//		if len(strings.TrimSpace(aesPwdList[0])) <= 0 || len(strings.TrimSpace(aesPwdList[1])) <= 0 || len(strings.TrimSpace(aesPwdList[2])) <= 0 || len(strings.TrimSpace(aesPwdList[3])) <= 0 {
//			log.Error("cannot be empty", zap.String("aesPwdList[0]", aesPwdList[0]), zap.String("aesPwdList[1]", aesPwdList[1]), zap.String("aesPwdList[2]", aesPwdList[2]), zap.String("aesPwdList[3]", aesPwdList[3]))
//			ResponseReturn(ctx, ParamsError.SetMsg("cannot be empty"), struct{}{})
//			return
//		}
//
//		if aesPwdList[0] != p.Mac || aesPwdList[3] != timestamp {
//			log.Error("DePwdCode content error", zap.String("aesPwdList[0]", aesPwdList[0]), zap.String("aesPwdList[3]", aesPwdList[3]))
//			ResponseReturn(ctx, DePwdCodeError.SetMsg("content error"), struct{}{})
//			return
//		}
//
//		out, err2 := s.client.GetNotificationNewest(s.ctx, "", aesPwdList[1], aesPwdList[2], tid)
//		if err2 != nil {
//			log.Error(" GetNotificationNewest error", zap.Error(err2))
//			res := QueryError
//			if err2.Error() == errors.New("unknown: no data").Error() {
//				res = NoNeedToUpdate
//			}
//			ResponseReturn(ctx, res, struct{}{})
//			return
//		}
//
//		ResponseReturn(ctx, Success, B2S(out))
//		return
//	}
//}
//
//func CalculateMD5(input string) string {
//	// 创建MD5哈希对象
//	hasher := md5.New()
//
//	// 将字符串转换为字节数组并写入哈希对象
//	hasher.Write([]byte(input))
//
//	// 计算哈希值
//	hash := hasher.Sum(nil)
//
//	// 将哈希值转换为16进制字符串
//	hashString := hex.EncodeToString(hash)
//
//	return hashString
//}
