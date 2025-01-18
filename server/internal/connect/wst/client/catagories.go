package client

import (
	"connectrpc.com/connect"
	"context"
	"encoding/json"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"go.uber.org/zap"
	"strconv"
)

func (s *Client) GetAppsCategories(ctx context.Context, user *wsv1.AppUser, tid int64) ([]byte, error) {
	log := s.log.Named("client.GetAppsCategories  " + strconv.FormatInt(tid, 10))
	r := new(wsv1.GetAppsCategoriesRequest)
	r.AppUser = user
	grpcRequestInConnect := connect.NewRequest(r)
	responseInConnect, err := s.grpc.GetAppsCategories(ctx, grpcRequestInConnect)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	apps := responseInConnect.Msg.GetCategoriesList()
	a, err := json.Marshal(apps)
	if err != nil {
		log.Error("json.Marshal error", zap.Error(err))
		return nil, err
	}
	return a, nil
}
