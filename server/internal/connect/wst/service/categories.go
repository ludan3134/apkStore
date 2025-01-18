package service

import (
	"connectrpc.com/connect"
	"context"
	"errors"
	comv1 "github.com/annadance/proto/api/com/v1"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"go.uber.org/zap"
	"strconv"
)

// App
func (s *Service) InsertCategories(ctx context.Context, req *connect.Request[wsv1.InsertCategoriesRequest]) (*connect.Response[wsv1.InsertCategoriesResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named("service.InsertCategories  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- InsertCategories start -------------")
	defer log.Debug("-------------------------- InsertCategories end -------------")
	resp := new(wsv1.InsertCategoriesResponse)
	resp.TransactionId = tid
	resp.SessionId = sid
	params := req.Msg.GetCategories()
	if params == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	err := s.dbo.InsertCategories(ctx, params, tid)
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
func (s *Service) QueryCategoriesList(ctx context.Context, req *connect.Request[wsv1.QueryCategoriesListRequest]) (*connect.Response[wsv1.QueryCategoriesListResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	filter := req.Msg.CategoriesFilter
	log := s.log.Named("service.QueryCategoriesList  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- QueryCategoriesList start -------------")
	defer log.Debug("-------------------------- QueryCategoriesList end -------------")
	resp := new(wsv1.QueryCategoriesListResponse)
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

	list, total, err := s.dbo.QueryCategoriesList(ctx, tid, pg.PageIndex, pg.Limit, filter)
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
	resp.CategoriesList = list
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) QueryAllCategories(ctx context.Context, req *connect.Request[wsv1.QueryAllCategoriesRequest]) (*connect.Response[wsv1.QueryAllCategoriesResponse], error) {
	log := s.log.Named("service.QueryAllCategories").With(zap.Int64("tid", 1001))
	log.Debug("-------------------------- QueryAllCategories start -------------")
	defer log.Debug("-------------------------- QueryAllCategories end -------------")

	// 检查上下文是否已经被取消
	select {
	case <-ctx.Done():
		log.Error("context is done before query", zap.Error(ctx.Err()))
		return nil, ctx.Err()
	default:
		// 上下文尚未取消，继续执行
	}

	resp := new(wsv1.QueryAllCategoriesResponse)
	list, err := s.dbo.QueryAllCategories(ctx, 1001)

	if err != nil {
		log.Error("Query error", zap.Error(err))
		// 检查错误是否是因为上下文被取消
		if errors.Is(err, context.Canceled) {
			log.Error("context was canceled during the query")
		}
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}

	// 检查上下文是否在查询后被取消
	select {
	case <-ctx.Done():
		log.Error("context is done after query", zap.Error(ctx.Err()))
		return nil, ctx.Err()
	default:
		// 上下文仍然有效，继续处理结果
	}

	resp.Status = true
	resp.Message = "ok"
	resp.CategoriesLabelList = list
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) UpdateCategories(ctx context.Context, req *connect.Request[wsv1.UpdateCategoriesRequest]) (*connect.Response[wsv1.UpdateCategoriesResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named(ap.StrBuilder("service.UpdateCategories ", strconv.FormatInt(tid, 10)))
	log.Debug("-------------------------- UpdateCategories start -------------")
	defer log.Debug("-------------------------- UpdateCategories end -------------")

	resp := new(wsv1.UpdateCategoriesResponse)
	resp.TransactionId = tid
	resp.SessionId = sid

	u := req.Msg.GetCategories()
	if u == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}

	err := s.dbo.UpdateCategories(ctx, u, tid)
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
