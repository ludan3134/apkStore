package cache

import (
	"context"
	"fmt"
	axv1 "github.com/annadance/proto/api/ax/v1"
	"github.com/annadance/wst/ap"
	"github.com/redis/rueidis/rueidiscompat"
	"github.com/vmihailenco/msgpack/v5"
	"go.uber.org/zap"
	"strconv"
)

const limit = 4096

func (s *Cache) SetToken(ctx context.Context, ac *axv1.UserInfo, token string, tid int64) error {
	log := s.log.Named(ap.StrBuilder("Cache.SetToken ", strconv.FormatInt(tid, 10)))
	if len(token) <= 0 {
		log.Error("token length error", zap.String("token", token))
		return fmt.Errorf("token length error")
	}
	b, err := msgpack.Marshal(ac)
	if err != nil {
		log.Error("msgpack.Marshal error", zap.Error(err))
		return err
	}
	rdx := rueidiscompat.NewAdapter(s.res)
	key := fmt.Sprintf("token:%d:%d--%s", ac.RoleId, ac.Id, token)

	err = rdx.Set(ctx, key, b, TokenCacheTTL).Err()
	if err != nil {
		log.Error("res.Set error", zap.Error(err))
	}

	return nil
}

func (s *Cache) GetToken(ctx context.Context, roleId, id int32, token string) (*axv1.UserInfo, error) {
	log := s.log.Named("cache.GetToken")
	if id <= 0 || roleId <= 0 || len(token) <= 0 {
		log.Error("id roleId token is empty", zap.Int32("id", id), zap.Int32("roleId", roleId), zap.String("token", token))
		return nil, fmt.Errorf("id,roleId,token is empty")
	}

	key := fmt.Sprintf("token:%d:%d--%s", roleId, id, token)
	log.Debug("try get token", zap.String("key", key))
	rdx := rueidiscompat.NewAdapter(s.res)
	// 	defer res.Release()

	b, er1 := rdx.Cache(TokenCacheTTL).Get(ctx, key).Bytes()
	if er1 != nil {
		log.Error("rdb.Get error", zap.Error(er1))
		return nil, er1
	}

	ac := &axv1.UserInfo{}
	err := msgpack.Unmarshal(b, &ac)
	return ac, err
}

func (s *Cache) DelToken(ctx context.Context, pattern string, tid int64) error {
	log := s.log.Named(ap.StrBuilder("cache.DelToken ", strconv.FormatInt(tid, 10)))
	log.Debug("del token", zap.String("key", pattern))
	rdb := rueidiscompat.NewAdapter(s.res)

	var begin uint64
	for {
		keys, cursor, err := rdb.Scan(ctx, begin, pattern, limit).Result()
		if err != nil {
			log.Error("rdb.Scan error", zap.Error(err), zap.String("pattern", pattern))
			return err
		}
		if len(keys) > 0 {
			if err := rdb.Del(ctx, keys...).Err(); err != nil {
				log.Error("rdb.Del error", zap.Error(err), zap.String("pattern", pattern))
				return err
			}
		}

		if cursor == 0 {
			break
		}
		begin = cursor

	}
	return nil
}
