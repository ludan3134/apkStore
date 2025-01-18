package service

import (
	"connectrpc.com/connect"
	"context"
	"crypto/md5"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	comv1 "github.com/annadance/proto/api/com/v1"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"go.uber.org/zap"
	"net"
	"strconv"
	"time"
)

//后台调用

func (s *Service) InsertAppUser(ctx context.Context, req *connect.Request[wsv1.InsertAppUserRequest]) (*connect.Response[wsv1.InsertAppUserResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named("service.InsertAppUser  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- InsertAppUser start -------------")
	defer log.Debug("-------------------------- InsertAppUser end -------------")
	resp := new(wsv1.InsertAppUserResponse)
	resp.TransactionId = tid
	resp.SessionId = sid
	params := req.Msg.GetAppUser()
	if params == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	params.LastLogin = strconv.FormatInt(time.Now().Unix(), 10)
	_, err := s.dbo.InsertAppUser(ctx, params, tid)
	if err != nil {
		log.Error("Insert error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}

	resp.Status = true
	resp.Message = "ok"
	res := connect.NewResponse(resp)
	return res, nil
}

func (s *Service) UpdateAppUser(ctx context.Context, req *connect.Request[wsv1.UpdateAppUserRequest]) (*connect.Response[wsv1.UpdateAppUserResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named(ap.StrBuilder("service.UpdateAppUser ", strconv.FormatInt(tid, 10)))
	log.Debug("-------------------------- UpdateAppUser start -------------")
	defer log.Debug("-------------------------- UpdateAppUser end -------------")

	resp := new(wsv1.UpdateAppUserResponse)
	resp.TransactionId = tid
	resp.SessionId = sid

	u := req.Msg.GetAppUser()
	if u == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}

	err := s.dbo.UpdateAppUser(ctx, u, tid)
	if err != nil {
		log.Error("update error", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}

	resp.Status = true
	resp.Message = "ok"
	res := connect.NewResponse(resp)
	return res, nil
}

func (s *Service) QueryAppUserList(ctx context.Context, req *connect.Request[wsv1.QueryAppUserListRequest]) (*connect.Response[wsv1.QueryAppUserListResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	filter := req.Msg.AppUserFilter
	log := s.log.Named("service.QueryAppUserList  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- QueryAppUserList start -------------")
	defer log.Debug("-------------------------- QueryAppUserList end -------------")
	resp := new(wsv1.QueryAppUserListResponse)
	resp.TransactionId = tid
	resp.SessionId = sid

	pg := req.Msg.GetPageMeta()
	if pg == nil {
		pg = new(comv1.PageMeta)
	}
	if pg.Limit <= 0 {
		pg.Limit = PageSize
	}
	if pg.PageIndex < 0 {
		pg.PageIndex = 0
	}

	list, total, err := s.dbo.QueryAppUserList(ctx, tid, pg.PageIndex, pg.Limit, filter)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	pg.TotalRecords = int32(total)
	resp.PageMeta = pg
	resp.AppUserList = list
	res := connect.NewResponse(resp)
	return res, nil
}

// 盒子端调用
// 获取链接下载地址
func (s *Service) GetAppDownloadUrl(ctx context.Context, req *connect.Request[wsv1.GetAppDownloadUrlRequest]) (*connect.Response[wsv1.GetAppDownloadUrlResponse], error) {
	appID := req.Msg.AppInfo.GetApkId()
	log := s.log.Named("service.GetAppDownloadUrl  " + strconv.FormatInt(0, 10))
	log.Debug("-------------------------- QueryApps start -------------")
	defer log.Debug("-------------------------- QueryApps end -------------")
	resp := new(wsv1.GetAppDownloadUrlResponse)
	list, err := s.dbo.GetAppDownloadUrl(ctx, appID, 0)
	fmt.Println("Urlaaaa", list)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.AppInfo = list
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) Login(ctx context.Context, req *connect.Request[wsv1.LoginRequest]) (*connect.Response[wsv1.LoginResponse], error) {
	user := req.Msg.GetAppUser()
	mac := req.Msg.AppUser.Mac
	log := s.log.Named("service.Login  " + strconv.FormatInt(0, 10))
	log.Debug("-------------------------- Login start -------------")
	defer log.Debug("-------------------------- Login end -------------")
	resp := new(wsv1.LoginResponse)
	list, err := s.dbo.QueryAppUserByMac(ctx, mac, 0)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	if len(list) == 0 {
		distributor2model, err, b := s.dbo.FindDistributorModelByMac(ctx, mac, 0)
		if err != nil {
			log.Debug("distributor2model not found: ", zap.Error(err))
		}
		if !b {
			log.Error("该盒子被禁用: ", zap.Error(err))
			resp.Status = false
			resp.Message = err.Error()
			res := connect.NewResponse(resp)
			return res, err
		}
		user.DistributorId = s.cfg.DefaultDistributor
		user.ModelId = s.cfg.DefaultModel
		if len(distributor2model) != 0 {
			log.Debug("distributor2model was found: ", zap.Error(err))
			user.DistributorId = distributor2model[0].DistributorId
			user.ModelId = distributor2model[0].ModelId
		}
		amac, err := generateRandomMacAddress()
		if err != nil {
			log.Error("Insert error: ", zap.Error(err))
			resp.Status = false
			resp.Message = err.Error()
			res := connect.NewResponse(resp)
			return res, err
		}
		macStr := amac.String()
		//账号密码生成随机数
		usernameFromMac := GenerateUsernameFromMac(macStr)
		passwordFromMac := GeneratePasswordFromMac(macStr)
		user.UserName = usernameFromMac
		user.Password = passwordFromMac
		user.LastLogin = strconv.FormatInt(time.Now().Unix(), 10)
		user.Ip = "127.0.0.1"
		user.Operator = "default_operator"
		user.IsService = false
		user.IsActive = false
		user.IsExpired = false
		log.Debug("uer ", zap.Error(err))
		appUser, err := s.dbo.InsertAppUser(ctx, user, 0)
		if err != nil {
			log.Error("Insert error: ", zap.Error(err))
			resp.Status = false
			resp.Message = err.Error()
			res := connect.NewResponse(resp)
			return res, err
		}
		resp.Status = true
		resp.Message = "ok"
		resp.AppUser = appUser
		res := connect.NewResponse(resp)
		return res, nil
	}
	resp.Status = true
	resp.Message = "ok"
	resp.AppUser = list[0]
	res := connect.NewResponse(resp)
	return res, nil
}

// 盒子端调用
// 登录校验返回user对象
func (s *Service) AuthAccount(ctx context.Context, req *connect.Request[wsv1.AuthAccountRequest]) (*connect.Response[wsv1.AuthAccountResponse], error) {
	mac := req.Msg.AppUser.Mac
	log := s.log.Named("service.AuthAccount  " + strconv.FormatInt(0, 10))
	log.Debug("-------------------------- AuthAccount start -------------")
	defer log.Debug("-------------------------- AuthAccount end -------------")
	resp := new(wsv1.AuthAccountResponse)
	list, err := s.dbo.QueryAppUserByMac(ctx, mac, 0)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.AppUser = list[0]
	res := connect.NewResponse(resp)
	return res, nil
}
func GenerateUsernameFromMac(mac string) string {
	// 对 MAC 地址进行 MD5 哈希，生成用户名
	hash := md5.Sum([]byte(mac))
	return hex.EncodeToString(hash[:])
}
func GeneratePasswordFromMac(mac string) string {
	// 对 MAC 地址进行 SHA-256 哈希，生成密码
	hash := sha256.Sum256([]byte(mac + "unique_salt_for_password"))
	return hex.EncodeToString(hash[:])
}

// generateRandomMacAddress 生成一个随机的不重复的MAC地址
func generateRandomMacAddress() (net.HardwareAddr, error) {
	buf := make([]byte, 6)
	_, err := rand.Read(buf)
	if err != nil {
		return nil, err
	}

	// 设置MAC地址的本地管理位和多播位
	// 通常，本地管理位设置为1，表示MAC地址是随机生成的
	// 多播位设置为0，表示单播地址
	buf[0] = (buf[0] | 2) & 0xfd

	return net.HardwareAddr(buf), nil
}
