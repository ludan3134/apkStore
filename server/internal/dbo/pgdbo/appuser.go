package pgdbo

import (
	"context"
	"errors"
	"fmt"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"github.com/annadance/wst/internal/dbo/pgdbo/prepareSql"

	"go.uber.org/zap"
	"strconv"
	"strings"
)

// 盒子端调用
func (s *Dbo) QueryAppUserByMac(ctx context.Context, mac string, tid int64) ([]*wsv1.AppUser, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryApps ", strconv.FormatInt(tid, 10)))
	log.Debug("Processed mac before query", zap.String("mac", mac)) // Log the processed mac

	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryAppUserByMac, mac)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}

	list := make([]*wsv1.AppUser, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.AppUser)
		err = rows.Scan(&v.UserName,
			&v.Password,
			&v.Mac,
			&v.Ip,
			&v.Country,
			&v.City,
			&v.DistributorId,
			&v.ModelId,
			&v.LastLogin,
			&v.IsActive,
			&v.IsService,
			&v.IsExpired,
		)
		fmt.Println("我是vvv", v)
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
func (s *Dbo) FindDistributorModelByMac(ctx context.Context, mac string, tid int64) ([]*wsv1.AppUser, error, bool) {
	log := s.log.Named(ap.StrBuilder("dbo.FindDistributorModelByMac ", strconv.FormatInt(tid, 10)))
	address := formatMACAddress(mac)
	fmt.Println("我是传入的mac地址:", address)
	var checkTerminal bool
	err := s.pool.QueryRow(ctx, prepareSql.SqlFindDistributorModelByMacInTerminal, address).Scan(&checkTerminal)
	if err != nil {
		log.Error("terminal 无此 mac", zap.Error(err))
		return nil, err, true
	}
	if !checkTerminal {
		log.Error("terminal中该 mac 处于未使用状态", zap.Error(err))
		//该盒子在terminal数据库,被禁用
		return nil, err, false
	}

	rows, err := s.pool.Query(ctx, prepareSql.SqlFindDistributorModelByMacInAccount, address)
	if err != nil {
		log.Error("query SqlFindDistributorModelByMacInAccount error", zap.Error(err))
		return nil, err, false
	}
	list := make([]*wsv1.AppUser, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.AppUser)
		err = rows.Scan(
			&v.DistributorId,
			&v.ModelId,
		)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return nil, err, false
		}
		list = append(list, v)
	}
	if rows.Err() != nil {
		log.Error("query result rows error", zap.Error(rows.Err()))
		return nil, rows.Err(), false
	}
	if len(list) == 0 {
		log.Error("no data", zap.Error(rows.Err()))
		return nil, errors.New("no data"), false
	}
	return list, nil, true
}
func (s *Dbo) InsertAppUserList(ctx context.Context, appUsers []*wsv1.AppUser) (int32, int32) {
	log := s.log.Named(ap.StrBuilder("dbo.InsertAppUserList ", strconv.FormatInt(111, 10)))
	var successCount int32 = 0
	var failCount int32 = 0
	for _, appUser := range appUsers {
		// 准备SQL语句
		_, err := s.pool.Exec(ctx, prepareSql.SqlInsertAppUser, appUser.UserName, appUser.Password, appUser.Mac, appUser.Ip, appUser.Country, appUser.City, appUser.DistributorId, appUser.ModelId, appUser.LastLogin, appUser.Operator, false)
		if err != nil {
			log.Error("插入失败", zap.Error(err))
			_, err1 := s.pool.Exec(ctx, prepareSql.SqlInsertFailureRecord, appUser.DistributorId, appUser.ModelId, appUser.Mac, false)
			if err1 != nil {
				log.Error("错误记录插入失败", zap.Error(err))
				failCount++ // 即使插入失败记录失败，也要增加失败计数
			}
			failCount++
		} else {
			successCount++
		}
	}

	return successCount, failCount
}

func formatMACAddress(mac string) string {
	// 检查 MAC 地址长度是否正确
	if len(mac) != 12 {
		return ""
	}

	// 使用 strings.Builder 来构建新的 MAC 地址字符串
	var sb strings.Builder
	for i := 0; i < len(mac); i += 2 {
		// 每两位字符后添加冒号，最后一个两位字符后不添加
		if i > 0 {
			sb.WriteString(":")
		}
		sb.WriteString(mac[i : i+2])
	}
	return sb.String()
}
