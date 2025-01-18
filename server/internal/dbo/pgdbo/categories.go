package pgdbo

import (
	"context"
	"errors"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"github.com/annadance/wst/internal/dbo/pgdbo/prepareSql"
	"go.uber.org/zap"
	"strconv"
)

// 后台管理界面接口
func (s *Dbo) QueryCategoriesList(ctx context.Context, tid int64, pageIndex, limit int32, categories *wsv1.Categories) ([]*wsv1.Categories, int, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryCategoriesList ", strconv.FormatInt(tid, 10)))
	var count int
	err := s.pool.QueryRow(ctx, prepareSql.SqlCountCategoriesList, categories.DistributorId, categories.ModelId).Scan(&count)
	if err != nil {
		log.Error("query count error", zap.Error(err))
		return nil, 0, err
	}
	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryCategoriesList, categories.DistributorId, categories.ModelId, limit, pageIndex*limit)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, 0, err
	}
	list := make([]*wsv1.Categories, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.Categories)
		err = rows.Scan(&v.Id,
			&v.CategoryName,
			&v.DistributorId,
			&v.ModelId,
			&v.DistributorName,
			&v.ModelName,
			&v.Sort,
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

func (s *Dbo) UpdateCategories(ctx context.Context, t *wsv1.Categories, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.UpdateApp ", strconv.FormatInt(tid, 10)))

	_, err := s.pool.Exec(ctx, prepareSql.SqlUpdateCategories, t.CategoryName, t.Deleted, t.DistributorId, t.ModelId, t.Sort, t.Id)
	if err != nil {
		log.Error("update error", zap.Error(err))
		return err
	}
	return nil
}
func (s *Dbo) InsertCategories(ctx context.Context, c *wsv1.Categories, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.InsertCategories ", strconv.FormatInt(tid, 10)))
	_, err := s.pool.Exec(ctx, prepareSql.SqlInsertCategories, c.CategoryName, c.DistributorId, c.ModelId, c.Sort)
	if err != nil {
		log.Error("insert error", zap.Error(err))
		return err
	}
	return nil
}
func (s *Dbo) QueryAllCategories(ctx context.Context, tid int64) ([]*wsv1.AllCategoriesLabel, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryAllCategories ", strconv.FormatInt(tid, 10)))
	log.Debug("QueryAllCategories started")

	defer func() {
		if err := recover(); err != nil {
			log.Error("QueryAllCategories panicked", zap.Any("error", err))
		}
		log.Debug("QueryAllCategories finished")
	}()

	// Check if the context is already done before executing the query
	if ctx.Err() != nil {
		log.Error("context is already done before query", zap.Error(ctx.Err()))
		return nil, ctx.Err()
	}

	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryAllCategories)
	if err != nil {
		log.Error("query error", zap.Error(err))
		// Check if the error is due to the context being canceled
		if errors.Is(err, context.Canceled) {
			log.Error("query was canceled due to context cancellation")
		}
		return nil, err
	}

	list := make([]*wsv1.AllCategoriesLabel, 0)
	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.AllCategoriesLabel)
		err = rows.Scan(&v.Id, &v.Label)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return nil, err
		}
		list = append(list, v)

		// Check if the context is done after each iteration
		if ctx.Err() != nil {
			log.Error("context is done during rows.Next()", zap.Error(ctx.Err()))
			return nil, ctx.Err()
		}
	}

	if rows.Err() != nil {
		log.Error("query result rows error", zap.Error(rows.Err()))
		return nil, rows.Err()
	}

	log.Debug("QueryAllCategories completed successfully")
	return list, nil
}
