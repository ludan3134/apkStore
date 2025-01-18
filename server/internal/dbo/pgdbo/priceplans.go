package pgdbo

import (
	"context"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"github.com/annadance/wst/internal/dbo/pgdbo/prepareSql"
	"go.uber.org/zap"
	"strconv"
)

// 后台管理界面接口
func (s *Dbo) QueryPricePlanList(ctx context.Context, tid int64, pageIndex, limit int32) ([]*wsv1.PricePlans, int, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryPricePlanList ", strconv.FormatInt(tid, 10)))
	var count int
	err := s.pool.QueryRow(ctx, prepareSql.SqlCountPricePlanList).Scan(&count)
	if err != nil {
		log.Error("query count error", zap.Error(err))
		return nil, 0, err
	}
	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryPricePlanList, limit, pageIndex*limit)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, 0, err
	}
	list := make([]*wsv1.PricePlans, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.PricePlans)
		err = rows.Scan(&v.Id,
			&v.PlanName,
			&v.PlanDescription,
			&v.BillingCycle,
			&v.TrialPeriod,
			&v.Price,
			&v.DistributorId,
			&v.ModelId,
			&v.DistributorName,
			&v.ModelName,
		)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return nil, 0, err
		}

		list = append(list, v)
	}

	if rows.Err() != nil {
		log.Error("query result rows error", zap.Error(rows.Err()))
		return nil, 0, rows.Err()
	}

	return list, count, nil
}

func (s *Dbo) UpdatePricePlan(ctx context.Context, t *wsv1.PricePlans, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.UpdateApp ", strconv.FormatInt(tid, 10)))
	_, err := s.pool.Exec(ctx, prepareSql.SqlUpdatePricePlan, t.PlanName, t.PlanDescription, t.BillingCycle, t.TrialPeriod, t.Price, t.DistributorId, t.ModelId, t.Deleted, t.Id)
	if err != nil {
		log.Error("update error", zap.Error(err))
		return err
	}
	return nil
}
func (s *Dbo) InsertPricePlan(ctx context.Context, c *wsv1.PricePlans, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.InsertPricePlan ", strconv.FormatInt(tid, 10)))
	_, err := s.pool.Exec(ctx, prepareSql.SqlInsertPricePlan, c.PlanName, c.PlanDescription, c.BillingCycle, c.TrialPeriod, c.Price, c.DistributorId, c.ModelId)
	if err != nil {
		log.Error("insert error", zap.Error(err))
		return err
	}
	return nil
}
func (s *Dbo) QueryAllPricePlan(ctx context.Context, tid int64) ([]*wsv1.AllPricePlanLabel, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryAllPricePlan ", strconv.FormatInt(tid, 10)))
	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryAllPricePlan)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	list := make([]*wsv1.AllPricePlanLabel, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.AllPricePlanLabel)
		err = rows.Scan(&v.Id,
			&v.Label,
		)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return nil, err
		}

		list = append(list, v)
	}

	if rows.Err() != nil {
		log.Error("query result rows error", zap.Error(rows.Err()))
		return nil, rows.Err()
	}
	return list, nil
}
