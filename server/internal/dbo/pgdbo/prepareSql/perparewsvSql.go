package prepareSql

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
)

const (
	//apps
	SqlCountAppsList     = "SqlCountAppsList"
	SqlUpdateApps        = "SqlUpdateApps"
	SqlInsertApps        = "SqlInsertApps"
	SqlDeleteApps        = "SqlDeleteApps"
	SqlDeleteAppsVersion = "SqlDeleteAppsVersion"

	SqlQueryAppsList      = "SqlQueryAppsList"
	SqlCheckAppCategories = "SqlCheckAppCategories"
	SqlCheckAppPrice      = "SqlCheckAppPrice"

	SqlQueryAppVersionIsLatestByAppId = "SqlQueryAppVersionIsLatestByAppId"
	SqlInsertAppByCopy                = "SqlInsertAppByCopy"

	SqlCheckAppUniqueByAdd    = "SqlCheckAppUniqueByAdd"
	SqlCheckAppUniqueByUpdate = "SqlCheckAppUniqueByUpdate"
	// AppUser
	SqlUpdateAppUser                       = "SqlUpdateAppUser"
	SqlCountAppUserList                    = "SqlCountAppUserList"
	SqlQueryAppUserList                    = "SqlQueryAppUserList"
	SqlInsertAppUser                       = "SqlInsertAppUser"
	SqlDeleteAppUser                       = "SqlDeleteAppUser"
	SqlFindDistributorModelByMacInAccount  = "SqlFindDistributorModelByMacInAccount"
	SqlFindDistributorModelByMacInTerminal = "SqlFindDistributorModelByMacInTerminal"
	// Appversion
	SqlCountAppsVersionList      = "SqlCountAppsVersionList"
	SqlInsertAppsVersion         = "SqlInsertAppsVersion"
	SqlUpdateAppsVersion         = "SqlUpdateAppsVersion"
	SqlFindAppsVersion           = "SqlFindAppsVersion"
	SqlUpdateAppsVersionIsLatest = "SqlUpdateAppsVersionIsLatest"
	SqlQueryAppsVersionList      = "SqlQueryAppsVersionList"
	SqlCountCategoriesList       = "SqlCountCategoriesList"
	SqlUpdateCategories          = "SqlUpdateCategories"
	SqlInsertCategories          = "SqlInsertCategories"
	SqlQueryCategoriesList       = "SqlQueryCategoriesList"
	SqlCountPricePlanList        = "SqlCountPricePlanList"
	SqlUpdatePricePlan           = "SqlUpdatePricePlan"
	SqlInsertPricePlan           = "SqlInsertPricePlan"
	SqlQueryPricePlanList        = "SqlQueryPricePlanList"
	SqlQueryAllPricePlan         = "SqlQueryAllPricePlan"
	SqlQueryApps                 = "SqlQueryApps"
	SqlGetAppsByCategories       = "SqlGetAppsByCategories"
	SqlGetAppsForPushDesktop     = "GetAppsForPushDesktop"
	SqlQueryAppsNewestVersion    = "SqlQueryAppsNewestVersion"
	SqlUpdateSelf                = "SqlUpdateSelf"
	SqlQueryAppUserByMac         = "SqlQueryAppUserByMac"
	SqlQueryAllCategories        = "SqlQueryAllCategories"
	SqlGetCategoriesByClass      = "SqlGetCategoriesByClass"
	SqlGetAppsCategories         = "SqlGetAppsCategories"
	SqlInsertFailureRecord       = "SqlInsertFailureRecord"
	SqlGetAppDownloadUrl         = "SqlGetAppDownloadUrl"
)

func AfterConnectByWSV(ctx context.Context, conn *pgx.Conn) error {
	prepare := map[string]string{
		SqlCountAppsList: `
			select count(id) as total 
			from wst.apps f
			where CASE WHEN $1 = '' THEN TRUE ELSE f.distributor_id =$1::BIGINT END
			AND CASE WHEN $2 = '' THEN TRUE ELSE f.model_id =$2::BIGINT END
			AND CASE WHEN $3 = '' THEN TRUE ELSE f.app_name ILIKE '%' ||$3 || '%' END
			AND CASE WHEN $5 = '' THEN TRUE ELSE f.class ILIKE '%' ||$5 || '%' END
    		AND (CASE WHEN $4 = 0 THEN TRUE ELSE $4::BIGINT = ANY(f.category_ids) END)
			AND f.deleted = FALSE
		`,
		SqlUpdateApps: `
			update wst.apps 
			set app_name = $1,
			    app_description = $2,
			    app_icon = $3,
			    app_carousel = $4,
			    app_sort = $5,
			    app_banner = $6,
			    system_requirement = $7,
			    rating = $8,
			    class = $9,
			    copyright_notice = $10,
			    category_ids = $11,
			    price_plan_ids = $12,
			    is_show_on_market = $13,
			    is_show_tool_tip = $14,
			    distributor_id = $15,
			    model_id = $16,
			    deleted = $17,
			    catpromo =$18,
			    category_id = $19
			WHERE id = $20;
		`,
		SqlInsertApps: `
			insert into wst.apps (
				app_name,
				app_description,
				app_icon,
				app_carousel,
				app_sort,
				app_banner,
				system_requirement,
				rating,
				copyright_notice,
				distributor_id,
				model_id,
				deleted,
				price_plan_ids,
				class,
				category_ids,
				is_show_on_market,
				is_show_tool_tip,
			    catpromo,
			    category_id               
			) values (
				$1,$2, $3,$4, $5,$6, $7,$8, $9,$10, $11,$12, $13,$14, $15,$16, $17, $18,$19
			);
		`,
		SqlInsertAppByCopy: `
			insert into wst.apps (
				app_name,
				app_description,
				app_icon,
				app_carousel,
				app_sort,
				app_banner,
				system_requirement,
				rating,
				copyright_notice,
				distributor_id,
				model_id,
				deleted,
				price_plan_ids,
				class,
				category_ids,
				is_show_on_market,
				is_show_tool_tip,
			    catpromo
			) values (
				$1,$2, $3,$4, $5,$6, $7,$8, $9,$10, $11,$12, $13,$14, $15,$16, $17, $18
			) RETURNING  id;
		`,
		SqlQueryAppsList: `
		      	SELECT
					f.id,
					f.app_name,
					f.app_description :: TEXT,
					f.app_icon,
					f.app_sort,
					f.app_banner,
					f.app_carousel,
					f.system_requirement :: TEXT,
					f.rating,
					f.copyright_notice :: TEXT,
					f.category_ids,
					f.price_plan_ids,
					f.distributor_id :: TEXT,
					f.model_id :: TEXT,
					ARRAY_AGG(DISTINCT c.category_name) AS categories_name,
					ARRAY_AGG(DISTINCT p.plan_name) AS price_plans_name,
					m.name AS model_name,
					d.title AS distributor_name,
					f.class,
					f.is_show_on_market,
					f.is_show_tool_tip,
					f.catpromo,
					f.category_id
				FROM
					wst.apps f
				JOIN
					wst.distributor d ON f.distributor_id = d.id
				JOIN
					wst.model m ON f.model_id = m.id
				LEFT JOIN
					wst.categories c ON c.id = ANY(f.category_ids)
				LEFT JOIN
					wst.price_plans p ON p.id = ANY(f.price_plan_ids)
				WHERE
					CASE WHEN $1 = '' THEN TRUE ELSE f.distributor_id =$1::BIGINT END
					AND CASE WHEN $2 = '' THEN TRUE ELSE f.model_id =$2::BIGINT END
					AND CASE WHEN $3 = '' THEN TRUE ELSE f.app_name ILIKE '%' ||$3 || '%' END
				  	AND CASE WHEN $7 = '' THEN TRUE ELSE f.class ILIKE '%' ||$7 || '%' END
    				AND (CASE WHEN $4 = 0 THEN TRUE ELSE $4::BIGINT = ANY(f.category_ids) END)
					AND f.deleted = FALSE
				GROUP BY
					f.id, f.app_name, f.app_description, f.app_icon, f.app_sort, f.app_banner, f.app_carousel,
					f.system_requirement, f.rating, f.copyright_notice, f.category_ids, f.price_plan_ids,
					f.distributor_id, f.model_id, m.name, d.title, f.class, f.is_show_on_market, f.is_show_tool_tip
					LIMIT $5 OFFSET $6;
		`,
		SqlCheckAppCategories: `
				SELECT category_name
				 FROM wst.categories
  				 WHERE id = ANY($1)
				 AND distributor_id = $2
				 AND model_id = $3
		`,
		SqlCheckAppUniqueByAdd: `
			select count(id)
			from wst.apps
			where class = $1
			  AND distributor_id = $2
			  AND model_id = $3
			  AND deleted = false
			;
		`,
		SqlCheckAppUniqueByUpdate: `
			select id
			from wst.apps
			where class = $1
			  AND distributor_id = $2
			  AND model_id = $3
			  AND deleted = false
			;
		`,
		SqlCheckAppPrice: `
						SELECT plan_name
				 FROM wst.price_plans
  				 WHERE id = ANY($1::int[])
				 AND distributor_id = $2
				 AND model_id = $3
		`,
		SqlDeleteApps: `
						Delete 
				 FROM wst.apps
  				 WHERE id = $1
		`,
		SqlDeleteAppsVersion: `
						Delete 
				 FROM wst.app_version
  				 WHERE app_id = $1
		`,
		SqlQueryAppVersionIsLatestByAppId: `
						Select 
						 version_name,
						 changelog,
						 is_latest,
						 is_public,
						 is_paid,
						 filesize,
						 md5,
						 url,
						 force_uninstall,
						 class
				 FROM wst.app_version
  				 WHERE app_id = $1
				 AND deleted = false
			     AND is_latest = true;
		`,
		SqlUpdateAppUser: `
			update wst.app_user 
			set user_name = $1, 
			    password = $2, 
			    ip = $3, 
			    country = $4, 
			    city = $5, 
			    distributor_id = $6, 
			    model_id = $7, 
			    deleted = $8,
			    is_active = $9,
			    is_service = $10,
			    is_expired = $11
			WHERE mac = $12;
		`,
		SqlCountAppUserList: `
			select count(id) as total 
			from wst.app_user f
			where CASE WHEN $1 = '' THEN TRUE ELSE f.distributor_id =$1::BIGINT END
			AND CASE WHEN $2 = '' THEN TRUE ELSE f.model_id =$2::BIGINT END
			AND CASE WHEN $3 = '' THEN TRUE ELSE f.mac ILIKE '%' ||$3 || '%' END
			AND f.deleted = FALSE
		`,
		SqlQueryAppUserList: `
			SELECT
				f.user_name,
				f.PASSWORD,
				f.mac,
				f.ip,
				f.country,
				f.city,
				f.last_login,
				f.OPERATOR,
				f.distributor_id,
				f.model_id,
				d.title :: TEXT AS distributorName,
				M.NAME :: TEXT AS modelName,
				f.is_active,
			    f.is_service,
			    f.is_expired
			FROM
				wst.app_user f
				JOIN wst.distributor d ON f.distributor_id = d.ID
				JOIN wst.model M ON f.model_id = M.ID 
			where 
			    CASE WHEN $1 = '' THEN TRUE ELSE f.distributor_id =$1::BIGINT END
				AND CASE WHEN $2 = '' THEN TRUE ELSE f.model_id =$2::BIGINT END
				AND CASE WHEN $3 = '' THEN TRUE ELSE f.mac ILIKE '%' ||$3 || '%' END
				AND f.deleted = FALSE
			LIMIT $4 OFFSET $5;
		`,
		SqlInsertAppUser: `
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
				deleted,
				is_active,
			  	is_expired,
			    is_service                      
			) VALUES (
				$1,$2, $3,$4, $5,$6, $7,$8, $9,$10, $11,$12,$13,$14
			) ON CONFLICT (mac) DO NOTHING
			RETURNING user_name, PASSWORD, mac, ip, country, city, distributor_id, model_id, last_login, operator;
		`,
		SqlDeleteAppUser: `
			DELETE FROM wst.app_user WHERE mac = $1;
		`,
		SqlFindDistributorModelByMacInAccount: `
			(SELECT distributor_id, model_id FROM rja.account WHERE mac_string = $1 AND is_active = true )
			UNION ALL
			(SELECT distributor_id, model_id FROM tv_rja.account WHERE mac_string = $1 AND is_active = true);
		`,
		SqlFindDistributorModelByMacInTerminal: `
			(SELECT is_used FROM rja.terminal WHERE mac_string = $1 )
			UNION ALL
			(SELECT is_used FROM tv_rja.terminal WHERE mac_string = $1);
		`,
		SqlCountAppsVersionList: `
			select count(id) as total 
			from wst.app_version 
			where deleted = false;
		`,
		SqlUpdateAppsVersionIsLatest: `
			UPDATE wst.app_version 
			SET is_latest = false 
			WHERE app_id = $1;
		`,
		SqlInsertAppsVersion: `
			insert into wst.app_version (
				app_id,
				version_name,
				date_released,
				changelog,
				is_latest,
				is_public,
				is_paid,
				filesize,
				md5,
				url,
				force_uninstall,
				deleted,
				class
			) values (
				$1,$2, $3,$4, $5,$6, $7,$8, $9,$10, $11,$12, $13
			);
		`,
		SqlFindAppsVersion: `
			UPDATE wst.app_version 
			SET is_latest = TRUE 
			WHERE
			date_released = ( SELECT MAX(date_released) FROM wst.app_version WHERE app_id = $1 AND is_latest = FALSE) 
			AND app_id = $1;
		`,
		SqlUpdateAppsVersion: `
			update wst.app_version 
			set version_name = $1,
			changelog = $2,
			is_latest = $3,
			is_paid = $4,
			filesize = $5,
			md5 = $6,
			url = $7,
			force_uninstall = $8,
			deleted = $9,
			is_public = $10
			where id = $11;
		`,
		SqlQueryAppsVersionList: `
			select f.id,
			       f.app_id,
			       f.version_name,
			       f.date_released,
			       f.changelog,
			       f.is_latest,
			       f.is_public,
			       f.is_paid,
			       f.filesize,
			       f.md5,
			       f.url,
			       f.force_uninstall,
			       f.filesize 
			from wst.app_version f 
			where f.deleted = false 
			and f.app_id = $1::int  
			limit $2 offset $3;
		`,
		SqlCountCategoriesList: `select count(id) as total from wst.categories f where 
							  	CASE WHEN $1 = '' THEN TRUE ELSE f.distributor_id =$1::BIGINT END
								AND CASE WHEN $2 = '' THEN TRUE ELSE f.model_id =$2::BIGINT END
								AND f.deleted = FALSE;`,
		SqlInsertCategories: `insert into wst.categories (category_name,distributor_id,model_id,sort) values ($1,$2,$3,$4);`,
		SqlUpdateCategories: `update wst.categories set category_name = $1,deleted = $2,distributor_id = $3,model_id = $4,sort = $5 where id = $6;`,
		SqlQueryCategoriesList: `
								SELECT
									f.id,
									f.category_name,
									f.distributor_id,
									f.model_id,
									d.title ::text AS distributorName,
									M.NAME ::text AS modelName,
									f.sort
								FROM
									wst.categories f
									JOIN wst.distributor d ON f.distributor_id  = d.id
									JOIN wst.model M ON f.model_id = M.ID 
								WHERE
								CASE WHEN $1 = '' THEN TRUE ELSE f.distributor_id =$1::BIGINT END
								AND CASE WHEN $2 = '' THEN TRUE ELSE f.model_id =$2::BIGINT END
								AND f.deleted = FALSE
								LIMIT $3 OFFSET $4;`,
		SqlCountPricePlanList: `
			select count(id) as total 
			from wst.price_plans 
			where deleted = false;
		`,
		SqlInsertPricePlan: `
			insert into wst.price_plans (
				plan_name, 
				plan_description, 
				billing_cycle, 
				trial_period, 
				price, 
				distributor_id, 
				model_id
			) values (
				$1,$2, $3,$4, $5,$6, $7
			);
		`,
		SqlUpdatePricePlan: `
			update wst.price_plans 
			set plan_name = $1, 
			    plan_description = $2, 
			    billing_cycle = $3, 
			    trial_period = $4, 
			    price = $5, 
			    distributor_id = $6, 
			    model_id = $7, 
			    deleted = $8 
			where id = $9;
		`,
		SqlQueryPricePlanList: `
			select 
				f.id, 
				f.plan_name, 
				f.plan_description, 
				f.billing_cycle, 
				f.trial_period, 
				f.price, 
				f.distributor_id, 
				f.model_id, 
				d.title as distributorName, 
				m.name as modelName 
			from 
				wst.price_plans f 
				join wst.distributor d on f.distributor_id = d.id 
				join wst.model m on f.model_id = m.id 
			where 
				f.deleted = false 
			limit $1 offset $2;
		`,
		SqlQueryAllPricePlan: `
			SELECT 
				C.ID AS id, 
				CONCAT(C.plan_name, ' - ', d.title, ' - ', M.NAME) AS label 
			FROM 
				wst.price_plans C 
				LEFT JOIN wst.distributor d ON C.distributor_id = d.ID 
				LEFT JOIN wst.model M ON C.model_id = M.ID;
		`,
		SqlQueryApps: `
			SELECT
				f.ID AS apk_id,
				f.app_name,
				f.app_description,
				f.app_icon,
				f.app_carousel,
				f.app_sort,
				f.app_banner,
				f.system_requirement,
				f.rating,
				f.copyright_notice,
				C.category_name AS categories_name,
				P.plan_name AS price_plans_name,
				P.price AS price,
				f.deleted,
				f.CLASS,
				V.version_name AS VERSION,
				V.md5,
				V.url,
				V.filesize,
				f.is_show_on_market,
				f.is_show_tool_tip,
				f.catpromo
			FROM
				wst.apps f
				JOIN wst.categories C ON  c.id = ANY(f.category_ids)
				JOIN wst.price_plans P ON p.id = ANY(f.price_plan_ids)
				JOIN wst.app_version V ON f.ID = V.app_id
			WHERE
				f.deleted = FALSE
				AND V.is_latest = TRUE
				AND f.app_name ILIKE $1
				AND f.distributor_id = $2
				AND f.model_id = $3
			ORDER BY 
			    CAST(app_sort AS INTEGER) ASC;
		`,

		SqlQueryAppsNewestVersion: `
			SELECT DISTINCT ON (f.ID)
				f.ID AS apk_id,
				f.app_name,
				f.app_description,
				f.app_icon,
				f.app_carousel,
				f.app_sort,
				f.app_banner,
				f.system_requirement,
				f.rating,
				f.copyright_notice,
				C.category_name AS categories_name,
				P.plan_name AS price_plans_name,
				P.price AS price,
				f.deleted,
				f.CLASS,
				V.version_name AS VERSION,
				V.md5,
				V.url,
				V.filesize,
				f.is_show_on_market,
				f.is_show_tool_tip
			FROM
				wst.apps f
				JOIN wst.categories C ON c.id = ANY(f.category_ids)
				JOIN wst.price_plans P ON p.id = ANY(f.price_plan_ids) 
				JOIN wst.distributor D ON f.distributor_id = D.ID
				JOIN wst.model M ON f.model_id = M.ID
				JOIN wst.app_version V ON f.ID = V.app_id
			WHERE
				f.deleted = FALSE
				AND V.is_latest = TRUE
				AND V."class" = $1
				AND f.distributor_id = $2
				AND f.model_id = $3
		`,
		// 自更新 SqlUpdateSelf
		SqlUpdateSelf: `
			SELECT
				f.ID AS apk_id,
				f.app_name,
				f.app_description,
				f.app_icon,
				f.app_carousel,
				f.app_sort,
				f.app_banner,
				f.system_requirement,
				f.rating,
				f.copyright_notice,
				C.category_name AS categories_name,
				P.plan_name AS price_plans_name,
				P.price AS price,
				f.deleted,
				f.CLASS,
				V.version_name AS VERSION,
				V.md5,
				V.url,
				V.filesize,
				f.is_show_on_market,
				f.is_show_tool_tip,
				f.catpromo
			FROM
				wst.apps f
				JOIN wst.categories C ON c.id = ANY(f.category_ids)
				JOIN wst.price_plans P ON p.id = ANY(f.price_plan_ids)
				JOIN wst.distributor D ON f.distributor_id = D.ID
				JOIN wst.model M ON f.model_id = M.ID
				JOIN wst.app_version V ON f.ID = V.app_id
			WHERE
				f.deleted = FALSE
				AND V.is_latest = TRUE
				AND V."class" = $1
				AND f.distributor_id = $2
				AND f.model_id = $3
		`,
		SqlGetAppsByCategories: `
			SELECT
				f.ID AS apk_id,
				f.app_name,
				f.app_description,
				f.app_icon,
				f.app_carousel,
				f.app_sort,
				f.app_banner,
				f.system_requirement,
				f.rating,
				f.copyright_notice,
				C.category_name AS categories_name,
				P.plan_name AS price_plans_name,
				P.price AS price,
				f.deleted,
				f.CLASS,
				V.version_name AS VERSION,
				V.md5,
				V.url,
				V.filesize,
				f.is_show_on_market,
				f.is_show_tool_tip,
				f.catpromo,
				f.category_id AS categories_id
			FROM
				wst.apps f
				JOIN wst.categories C ON c.id = ANY(f.category_ids)
				JOIN wst.price_plans P ON p.id = ANY(f.price_plan_ids)
				JOIN wst.distributor D ON f.distributor_id = D.ID
				JOIN wst.model M ON f.model_id = M.ID
				JOIN wst.app_version V ON f.ID = V.app_id
			WHERE
				f.deleted = FALSE
				AND $1 = ANY(f.category_ids)
			  	AND c.id =  $1
				AND f.distributor_id = $2::bigint
				AND f.model_id = $3::bigint
				AND V.is_latest = TRUE
				AND f.is_show_on_market = 1
			ORDER BY
				  CAST(app_sort AS INTEGER) ASC;
		`,

		SqlGetAppsForPushDesktop: `
			SELECT  DISTINCT ON (f.ID)
			    f.ID AS apk_id,
				f.app_name,
				f.app_description,
				f.app_icon,
				f.app_carousel,
				f.app_sort,
				f.app_banner,
				f.system_requirement,
				f.rating,
				f.copyright_notice,
				C.category_name AS categories_name,
				P.plan_name AS price_plans_name,
				P.price AS price,
				f.deleted,
				f.CLASS,
				V.version_name AS VERSION,
				V.md5,
				V.url,
				V.filesize,
				f.is_show_on_market,
				f.is_show_tool_tip,
				f.catpromo,
				f.category_id AS categories_id
			FROM
				wst.apps f
				JOIN wst.categories C ON c.id = ANY(f.category_ids)
				JOIN wst.price_plans P ON p.id = ANY(f.price_plan_ids)
				JOIN wst.distributor D ON f.distributor_id = D.ID
				JOIN wst.model M ON f.model_id = M.ID
				JOIN wst.app_version V ON f.ID = V.app_id
			WHERE
				f.deleted = FALSE
				AND f.distributor_id = $1::bigint
				AND f.model_id = $2::bigint
				AND V.is_latest = TRUE
				AND f.is_show_tool_tip = 1
			ORDER BY
    			f.ID ASC -- 分类 ID 排序
		`,

		SqlQueryAppUserByMac: `SELECT user_name,password,mac,ip,country,city,distributor_id,model_id,last_login,is_active,is_service,is_expired FROM wst.app_user WHERE mac = $1 AND deleted = false;`,
		SqlQueryAllCategories: `
			SELECT 
				C.ID AS category_ids,
				CONCAT(C.category_name, ' - ', d.title, ' - ', M.NAME) AS label 
			FROM 
				wst.categories C 
				LEFT JOIN wst.distributor d ON C.distributor_id = d.ID 
				LEFT JOIN wst.model M ON C.model_id = M.ID
				Where c.deleted = false
			;
		`,
		SqlGetCategoriesByClass: `
			SELECT 
				category_ids 
			FROM 
				wst.apps 
			WHERE 
				class = $1 AND distributor_id =$2 AND model_id = $3;
		`,
		SqlGetAppsCategories: `
			SELECT id,category_name 
			FROM wst.categories 
			WHERE distributor_id = $1
			AND model_id = $2
			AND deleted = FALSE 
			ORDER BY sort ;
		`,
		SqlInsertFailureRecord: `
			INSERT INTO wst.failure_log (
				distributor_id, 
				model_id, 
				mac, 
				deleted
			) VALUES (
				$1,$2, $3,$4
			) ON CONFLICT (mac) DO NOTHING;
		`,
		SqlGetAppDownloadUrl: `
			SELECT url 
			FROM wst.app_version 
			WHERE app_id = $1 AND is_latest = TRUE AND deleted = false;
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
