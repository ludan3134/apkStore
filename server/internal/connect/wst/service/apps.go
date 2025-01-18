package service

import (
	"connectrpc.com/connect"
	"context"
	"errors"
	"fmt"
	comv1 "github.com/annadance/proto/api/com/v1"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"go.uber.org/zap"
	"strconv"
	"time"
)

// App
func (s *Service) InsertApps(ctx context.Context, req *connect.Request[wsv1.InsertAppsRequest]) (*connect.Response[wsv1.InsertAppsResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named("service.InsertApps  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- InsertApps start -------------")
	defer log.Debug("-------------------------- InsertApps end -------------")
	resp := new(wsv1.InsertAppsResponse)
	resp.TransactionId = tid
	resp.SessionId = sid
	params := req.Msg.GetApps()
	if params == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	err := s.dbo.InsertApps(ctx, params, tid)
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
func (s *Service) QueryAppsList(ctx context.Context, req *connect.Request[wsv1.QueryAppsListRequest]) (*connect.Response[wsv1.QueryAppsListResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named("service.QueryAppsList  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- QueryAppsList start -------------")
	defer log.Debug("-------------------------- QueryAppsList end -------------")
	resp := new(wsv1.QueryAppsListResponse)
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

	list, total, err := s.dbo.QueryAppsList(ctx, tid, pg.PageIndex, pg.Limit, req.Msg.AppsFilter)
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
	resp.AppsList = list
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) UpdateApps(ctx context.Context, req *connect.Request[wsv1.UpdateAppsRequest]) (*connect.Response[wsv1.UpdateAppsResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named(ap.StrBuilder("service.UpdateApps ", strconv.FormatInt(tid, 10)))
	log.Debug("-------------------------- UpdateApps start -------------")
	defer log.Debug("-------------------------- UpdateApps end -------------")

	resp := new(wsv1.UpdateAppsResponse)
	resp.TransactionId = tid
	resp.SessionId = sid

	u := req.Msg.GetApps()
	if u == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}

	err := s.dbo.UpdateApps(ctx, u, tid)
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
func (s *Service) CopyApps(ctx context.Context, req *connect.Request[wsv1.CopyAppsRequest]) (*connect.Response[wsv1.CopyAppsResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named("service.CopyApps  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- CopyApps start -------------")
	defer log.Debug("-------------------------- CopyApps end -------------")
	resp := new(wsv1.CopyAppsResponse)
	resp.TransactionId = tid
	resp.SessionId = sid
	apps := req.Msg.GetApps()
	distributorId := req.Msg.GetDistributorId()
	modelId := req.Msg.GetModelId()
	categoriesIds := req.Msg.GetCategoriesIds()
	pricePlans := req.Msg.GetPricePlans()

	err, errors := s.dbo.CopyApps(ctx, apps, distributorId, modelId, categoriesIds, pricePlans)
	if err != nil {
		log.Error("Copy error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		resp.ErrorMessages = errors
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.ErrorMessages = errors
	res := connect.NewResponse(resp)
	return res, nil
}

// AppVersion
func (s *Service) QueryAppsVersionList(ctx context.Context, req *connect.Request[wsv1.QueryAppsVersionListRequest]) (*connect.Response[wsv1.QueryAppsVersionListResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	id := req.Msg.AppId
	log := s.log.Named("service.QueryAppsVersionList  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- QueryAppsVersionList start -------------")
	defer log.Debug("-------------------------- QueryAppsVersionList end -------------")
	resp := new(wsv1.QueryAppsVersionListResponse)
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

	list, total, err := s.dbo.QueryAppsVersionList(ctx, id, tid, pg.PageIndex, pg.Limit)
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
	resp.Apps = list
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) InsertAppsVersion(ctx context.Context, req *connect.Request[wsv1.InsertAppsVersionRequest]) (*connect.Response[wsv1.InsertAppsVersionResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named("service.InsertAppsVersion  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- InsertAppsVersion start -------------")
	defer log.Debug("-------------------------- InsertAppsVersion end -------------")
	resp := new(wsv1.InsertAppsVersionResponse)
	resp.TransactionId = tid
	resp.SessionId = sid
	params := req.Msg.GetAppVersion()
	params.DateReleased = strconv.FormatInt(time.Now().Unix(), 10)
	if params == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	err := s.dbo.InsertAppsVersion(ctx, params, tid)
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
func (s *Service) UpdateAppsVersion(ctx context.Context, req *connect.Request[wsv1.UpdateAppsVersionRequest]) (*connect.Response[wsv1.UpdateAppsVersionResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named(ap.StrBuilder("service.UpdateAppsVersion ", strconv.FormatInt(tid, 10)))
	log.Debug("-------------------------- UpdateAppsVersion start -------------")
	defer log.Debug("-------------------------- UpdateAppsVersion end -------------")

	resp := new(wsv1.UpdateAppsVersionResponse)
	resp.TransactionId = tid
	resp.SessionId = sid

	u := req.Msg.GetAppVersion()
	if u == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}

	err := s.dbo.UpdateAppsVersion(ctx, u, tid)
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

// 盒子端调用
func (s *Service) QueryApps(ctx context.Context, req *connect.Request[wsv1.QueryAppsRequest]) (*connect.Response[wsv1.QueryAppsResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	appName := req.Msg.AppName
	user := req.Msg.GetAppUser()
	fmt.Println("user", user)
	log := s.log.Named("service.QueryApps  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- QueryApps start -------------")
	defer log.Debug("-------------------------- QueryApps end -------------")
	resp := new(wsv1.QueryAppsResponse)
	resp.TransactionId = tid
	resp.SessionId = sid

	list, err := s.dbo.QueryApps(ctx, appName, user, tid)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.AppsList = list
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) GetAppsCategories(ctx context.Context, req *connect.Request[wsv1.GetAppsCategoriesRequest]) (*connect.Response[wsv1.GetAppsCategoriesResponse], error) {
	log := s.log.Named("service.GetAppsCategories  " + strconv.FormatInt(456, 10))
	user := req.Msg.GetAppUser()
	log.Debug("-------------------------- GetAppsCategories start -------------")
	defer log.Debug("-------------------------- GetAppsCategories end -------------")
	resp := new(wsv1.GetAppsCategoriesResponse)

	list, err := s.dbo.GetAppsCategories(ctx, user, 456)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	if len(list) == 0 {
		log.Error("no data")
		resp.Status = false
		resp.Message = "no data available"
		newErr := errors.New("no categories data available") // 创建一个新的错误
		res := connect.NewResponse(resp)
		return res, newErr // 返回新的错误
	}
	resp.Status = true
	resp.Message = "ok"
	resp.CategoriesList = list
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) GetAppsByCategories(ctx context.Context, req *connect.Request[wsv1.GetAppsByCategoriesRequest]) (*connect.Response[wsv1.GetAppsByCategoriesResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	id := req.Msg.GetCategoriesId()
	user := req.Msg.GetAppUser()
	fmt.Println("user", user)
	log := s.log.Named("service.GetAppsCategories  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- GetAppsByCategories start -------------")
	defer log.Debug("-------------------------- GetAppsByCategories end -------------")
	resp := new(wsv1.GetAppsByCategoriesResponse)
	resp.TransactionId = tid
	resp.SessionId = sid

	list, err := s.dbo.GetAppsByCategories(ctx, user, id, tid)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.AppsList = list
	res := connect.NewResponse(resp)
	return res, nil
}

func (s *Service) GetAppsByClass(ctx context.Context, req *connect.Request[wsv1.GetAppsByClassRequest]) (*connect.Response[wsv1.GetAppsByClassResponse], error) {
	user := req.Msg.GetClassVersion()
	fmt.Println("user", user)
	log := s.log.Named("service.GetAppsByClass  " + strconv.FormatInt(0, 10))
	log.Debug("-------------------------- GetAppsByClass start -------------")
	defer log.Debug("-------------------------- GetAppsByClass end -------------")
	resp := new(wsv1.GetAppsByClassResponse)
	classVersion := req.Msg.GetClassVersion()
	appUser := req.Msg.GetAppUser()
	list, err := s.dbo.GetAppsByClass(ctx, appUser, classVersion, 0)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.AppsList = list
	fmt.Println("aaa!!!1", list)
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) QueryAppsNewestVersion(ctx context.Context, req *connect.Request[wsv1.QueryAppsNewestVersionRequest]) (*connect.Response[wsv1.QueryAppsNewestVersionResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	classVersions := req.Msg.ClassVersion
	user := req.Msg.GetAppUser()
	fmt.Println("user", user)
	log := s.log.Named("service.QueryAppsNewestVersion  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- QueryAppsNewestVersion start -------------")
	defer log.Debug("-------------------------- QueryAppsNewestVersion end -------------")
	resp := new(wsv1.QueryAppsNewestVersionResponse)
	resp.TransactionId = tid
	resp.SessionId = sid
	fmt.Printf("我是classVersions", classVersions)
	list, err := s.dbo.QueryAppsNewestVersion(ctx, user, classVersions, tid)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.AppsList = list
	res := connect.NewResponse(resp)
	return res, nil
}

func (s *Service) UpdateSelf(ctx context.Context, req *connect.Request[wsv1.UpdateSelfRequest]) (*connect.Response[wsv1.UpdateSelfResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	classVersions := req.Msg.ClassVersion
	user := req.Msg.GetAppUser()
	fmt.Println("user", user)
	fmt.Println("我是classversionAA", classVersions)
	log := s.log.Named("service.UpdateSelf  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- UpdateSelf start -------------")
	defer log.Debug("-------------------------- UpdateSelf end -------------")
	resp := new(wsv1.UpdateSelfResponse)
	resp.TransactionId = tid
	resp.SessionId = sid
	fmt.Printf("我是classVersions", classVersions)
	list, err := s.dbo.UpdateSelf(ctx, user, classVersions, tid)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.App = list[0]
	res := connect.NewResponse(resp)
	return res, nil
}
