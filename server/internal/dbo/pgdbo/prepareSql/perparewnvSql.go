package prepareSql

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
)

const (
	SqlInsertAppUsers = "SqlInsertAppUser"
)

func AfterConnectByWNV(ctx context.Context, conn *pgx.Conn) error {
	prepare := map[string]string{
		SqlInsertAppUsers: `
			INSERT INTO wst.app_user (
				user_name, 
				PASSWORD, 
				mac, 
				ip, 
				country, 
				city, 
				distributor_id, 
				model_id, 
				last_login, 
				operator, 
				deleted
			) VALUES (
				$1,$2, $3,$4, $5,$6, $7,$8, $9,$10, $11
			) ON CONFLICT (mac) DO NOTHING
			RETURNING user_name, PASSWORD, mac, ip, country, city, distributor_id, model_id, last_login, operator;
		`,
	}
	for key, value := range prepare {
		_, err := conn.Prepare(ctx, key, value)
		if err != nil {
			fmt.Printf("预加载 %s 语句失败,失败原因:%s\n", key, err)
			return err
		}
	}
	return nil
}
