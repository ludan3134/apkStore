package client

//
//import (
//	"connectrpc.com/connect"
//	"context"
//	"encoding/json"
//	fsv1 "github.com/annadance/proto/api/fs/v1"
//	"go.uber.org/zap"
//	"strconv"
//)
//
//func (s *Client) GetNotificationNewest(ctx context.Context, distributorId, modelName, version string, tid int64) ([]byte, error) {
//	log := s.log.Named("client.GetNotificationNewest  " + strconv.FormatInt(tid, 10))
//
//	r := new(fsv1.QueryNotificationNewestRequest)
//	r.TransactionId = tid
//	r.SessionId = 0
//	r.ModelName = modelName
//	r.Version = version
//	r.DistributorId = distributorId
//	grpcRequestInConnect := connect.NewRequest(r)
//	// send grpc request
//
//	// get grpc response
//	responseInConnect, err := s.grpc.QueryNotificationNewest(ctx, grpcRequestInConnect)
//	if err != nil {
//		log.Error("query error", zap.Error(err))
//		return nil, err
//	}
//	nof := responseInConnect.Msg.GetNotification()
//	var data struct {
//		Version string `json:"version"`
//		Content string `json:"content"`
//	}
//	data.Version = strconv.FormatInt(nof.Updated, 10)
//	data.Content = nof.Content
//	a, err := json.Marshal(data)
//	if err != nil {
//		log.Error("json.Marshal error", zap.Error(err))
//		return nil, err
//	}
//	return a, nil
//}
