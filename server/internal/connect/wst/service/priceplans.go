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
func (s *Service) InsertPricePlans(ctx context.Context, req *connect.Request[wsv1.InsertPricePlansRequest]) (*connect.Response[wsv1.InsertPricePlansResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named("service.InsertPricePlans  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- InsertPricePlans start -------------")
	defer log.Debug("-------------------------- InsertPricePlans end -------------")
	resp := new(wsv1.InsertPricePlansResponse)
	resp.TransactionId = tid
	resp.SessionId = sid
	params := req.Msg.GetPricePlans()
	if params == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	err := s.dbo.InsertPricePlan(ctx, params, tid)
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
func (s *Service) QueryPricePlansList(ctx context.Context, req *connect.Request[wsv1.QueryPricePlansListRequest]) (*connect.Response[wsv1.QueryPricePlansListResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named("service.QueryPricePlansList  " + strconv.FormatInt(tid, 10))
	log.Debug("-------------------------- QueryPricePlansList start -------------")
	defer log.Debug("-------------------------- QueryPricePlansList end -------------")
	resp := new(wsv1.QueryPricePlansListResponse)
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

	list, total, err := s.dbo.QueryPricePlanList(ctx, tid, pg.PageIndex, pg.Limit)
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
	resp.PricePlans = list
	res := connect.NewResponse(resp)
	return res, nil
}
func (s *Service) UpdatePricePlans(ctx context.Context, req *connect.Request[wsv1.UpdatePricePlansRequest]) (*connect.Response[wsv1.UpdatePricePlansResponse], error) {
	tid := req.Msg.GetTransactionId()
	sid := req.Msg.GetSessionId()
	log := s.log.Named(ap.StrBuilder("service.UpdatePricePlans ", strconv.FormatInt(tid, 10)))
	log.Debug("-------------------------- UpdatePricePlans start -------------")
	defer log.Debug("-------------------------- UpdatePricePlans end -------------")

	resp := new(wsv1.UpdatePricePlansResponse)
	resp.TransactionId = tid
	resp.SessionId = sid

	u := req.Msg.GetPricePlans()
	if u == nil {
		err := errors.New("params is nil")
		log.Error(err.Error())
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}

	err := s.dbo.UpdatePricePlan(ctx, u, tid)
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
func (s *Service) QueryAllPricePlan(ctx context.Context, req *connect.Request[wsv1.QueryAllPricePlanRequest]) (*connect.Response[wsv1.QueryAllPricePlanResponse], error) {
	log := s.log.Named("service.QueryCategoriesList  " + strconv.FormatInt(1002, 10))
	log.Debug("-------------------------- QueryCategoriesList start -------------")
	defer log.Debug("-------------------------- QueryCategoriesList end -------------")
	resp := new(wsv1.QueryAllPricePlanResponse)

	list, err := s.dbo.QueryAllPricePlan(ctx, 1002)
	if err != nil {
		log.Error("Query error: ", zap.Error(err))
		resp.Status = false
		resp.Message = err.Error()
		res := connect.NewResponse(resp)
		return res, err
	}
	resp.Status = true
	resp.Message = "ok"
	resp.PriceLabelList = list
	res := connect.NewResponse(resp)
	return res, nil
}
