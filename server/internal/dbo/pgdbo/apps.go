package pgdbo

import (
	"context"
	"errors"
	"fmt"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"github.com/annadance/wst/internal/dbo/pgdbo/prepareSql"
	"github.com/jackc/pgx/v5"
	"go.uber.org/zap"
	"sort"
	"strconv"
	"time"
)

type Distributor_Model struct {
	DistrtributorId int64 `json:"distributor_id"`
	ModelId         int64 `json:"model_id"`
}

// 后台管理界面接口
func (s *Dbo) QueryAppsList(ctx context.Context, tid int64, pageIndex, limit int32, apps *wsv1.Apps) ([]*wsv1.Apps, int, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryAppsList ", strconv.FormatInt(tid, 10)))
	var count int

	err := s.pool.QueryRow(ctx, prepareSql.SqlCountAppsList, apps.DistributorId, apps.ModelId, apps.AppName, apps.CategoriesId, apps.Class).Scan(&count)
	if err != nil {
		log.Error("query count error", zap.Error(err))
		return nil, 0, err
	}
	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryAppsList, apps.DistributorId, apps.ModelId, apps.AppName, apps.CategoriesId, limit, pageIndex*limit, apps.Class)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, 0, err
	}
	list := make([]*wsv1.Apps, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.Apps)
		err = rows.Scan(&v.Id,
			&v.AppName,
			&v.AppDescription,
			&v.AppIcon,
			&v.AppSort,
			&v.AppBanner,
			&v.AppCarousel,
			&v.SystemRequirement,
			&v.Rating,
			&v.CopyrightNotice,
			&v.CategoriesIds,
			&v.PricePlansIds,
			&v.DistributorId,
			&v.ModelId,
			&v.CategoriesName,
			&v.PricePlansName,
			&v.ModelName,
			&v.DistributorName,
			&v.Class,
			&v.IsShowOnMarket,
			&v.IsShowToolTip,
			&v.CatPromo,
			&v.CategoriesId,
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

func (s *Dbo) UpdateApps(ctx context.Context, t *wsv1.Apps, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.UpdateApp ", strconv.FormatInt(tid, 10)))
	if t.IsShowToolTip >= 1 && t.IsShowToolTip <= 2 {
		log.Error("IsShowToolTip is between 1 and 2")
	}

	if t.Deleted {
		tx, err := s.pool.Begin(ctx)
		if err != nil {
			log.Error("tx begin error", zap.Error(err))
			return err
		}
		_, err = tx.Exec(ctx, prepareSql.SqlDeleteAppsVersion, t.Id)
		if err != nil {
			log.Error("删除appverison版本失败", zap.Error(err))
			tx.Rollback(ctx)
			return fmt.Errorf("删除App关联版本成功!")
		}
		_, err = tx.Exec(ctx, prepareSql.SqlDeleteApps, t.Id)
		if err != nil {
			log.Error("删除App失败, ", zap.Error(err))
			tx.Rollback(ctx)
			return fmt.Errorf("删除App失败!")
		}
		if err := tx.Commit(ctx); err != nil {
			log.Error("tx commit error", zap.Error(err))
			tx.Rollback(ctx)
			return err
		}
		return nil
	}
	//校验分销商型号下只有一个app
	var id int32
	err := s.pool.QueryRow(ctx, prepareSql.SqlCheckAppUniqueByUpdate, t.Class, t.DistributorId, t.ModelId).Scan(&id)
	if err != nil {
		log.Error("查询出错, ", zap.Error(err))
	} else {
		if id != t.Id {
			// id 和 t.Id 相等
			log.Info("该分销商型号下已有上传该App,请不要重复上传")
			return fmt.Errorf("该分销商型号下已有上传该App,请不要重复上传")
		}
	}
	//校验分类以及价格套餐
	categorieNames := make([]string, 0)
	categoriesArray, err := s.pool.Query(ctx, prepareSql.SqlCheckAppCategories, t.CategoriesIds, t.DistributorId, t.ModelId)
	if err != nil {
		log.Error("该分销商型号暂无该菜单分类", zap.Error(err))
		return err
	}
	defer categoriesArray.Close()
	// 遍历查询结果
	for categoriesArray.Next() {
		var v string
		err = categoriesArray.Scan(&v)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return err
		}
		categorieNames = append(categorieNames, v)
	}

	// 关闭查询结果
	defer categoriesArray.Close()
	// 比较分类名称数量
	if len(categorieNames) != len(t.CategoriesIds) {
		for _, name := range categorieNames {
			fmt.Println("分类名称:", name)
		}
		return fmt.Errorf("仅有以下分类存在于该分销商型号下面: %v", categorieNames)
	}
	//校验该App提交的价格套餐是属于分销商型号下面的
	priceplansNames := make([]string, 0)
	priceplanssArray, err := s.pool.Query(ctx, prepareSql.SqlCheckAppPrice, t.PricePlansIds, t.DistributorId, t.ModelId)
	if err != nil {
		log.Error("该分销商型号暂无该价格套餐", zap.Error(err))
		return err
	}
	defer priceplanssArray.Close()

	// 遍历查询结果
	for priceplanssArray.Next() {
		var v string
		err = priceplanssArray.Scan(&v)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return err
		}
		priceplansNames = append(priceplansNames, v)
	}

	// 关闭查询结果
	defer priceplanssArray.Close()
	// 比较分类名称数量
	if len(priceplansNames) != len(t.PricePlansIds) {
		return fmt.Errorf("仅有以下价格套餐存在于该分销商型号下面: %v", priceplansNames)
	}
	//校验分类以及价格套餐
	_, err = s.pool.Exec(ctx, prepareSql.SqlUpdateApps, t.AppName, t.AppDescription, t.AppIcon, t.AppCarousel, t.AppSort, t.AppBanner, t.SystemRequirement, t.Rating, t.Class, t.CopyrightNotice, t.CategoriesIds, t.PricePlansIds, t.IsShowOnMarket, t.IsShowToolTip, t.DistributorId, t.ModelId, t.Deleted, t.CatPromo, t.CategoriesId, t.Id)
	if err != nil {
		log.Error("更新App失败,请重新操作", zap.Error(err))
		return err
	}
	return nil
}

func (s *Dbo) InsertApps(ctx context.Context, c *wsv1.Apps, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.InsertApps ", strconv.FormatInt(tid, 10)))
	if c.IsShowToolTip >= 1 && c.IsShowToolTip <= 2 {
		log.Error("IsShowToolTip and c.IsShowToolTip are both between 1 and 2")
	}
	//校验分销商型号下只有一个app
	var count int
	err := s.pool.QueryRow(ctx, prepareSql.SqlCheckAppUniqueByAdd, c.Class, c.DistributorId, c.ModelId).Scan(&count)
	if err != nil || count > 0 {
		log.Error("该分销商型号下已有上传该App,请移步至编辑Apps 更改其价格套餐/分类", zap.Error(err))
		return fmt.Errorf("该分销商型号下已有上传该App,请移步至编辑Apps 更改其价格套餐/分类")
	}
	//校验该App提交的分类是属于分销商型号下面的
	// 执行SQL查询
	categorieNames := make([]string, 0)
	categoriesArray, err := s.pool.Query(ctx, prepareSql.SqlCheckAppCategories, c.CategoriesIds, c.DistributorId, c.ModelId)
	if err != nil {
		log.Error("该分销商型号暂无该菜单分类", zap.Error(err))
		return err
	}
	defer categoriesArray.Close()
	// 遍历查询结果
	for categoriesArray.Next() {
		var v string
		err = categoriesArray.Scan(&v)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return err
		}
		categorieNames = append(categorieNames, v)
	}

	// 关闭查询结果
	defer categoriesArray.Close()
	// 比较分类名称数量
	if len(categorieNames) != len(c.CategoriesIds) {
		for _, name := range categorieNames {
			fmt.Println("分类名称:", name)
		}
		return fmt.Errorf("仅有以下分类存在于该分销商型号下面: %v", categorieNames)
	}
	//校验该App提交的价格套餐是属于分销商型号下面的
	priceplansNames := make([]string, 0)
	priceplanssArray, err := s.pool.Query(ctx, prepareSql.SqlCheckAppPrice, c.PricePlansIds, c.DistributorId, c.ModelId)
	if err != nil {
		log.Error("该分销商型号暂无该价格套餐", zap.Error(err))
		return err
	}
	defer priceplanssArray.Close()

	// 遍历查询结果
	for priceplanssArray.Next() {
		var v string
		err = priceplanssArray.Scan(&v)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return err
		}
		priceplansNames = append(priceplansNames, v)
	}

	// 关闭查询结果
	defer priceplanssArray.Close()
	// 比较分类名称数量
	if len(priceplansNames) != len(c.PricePlansIds) {
		return fmt.Errorf("仅有以下价格套餐存在于该分销商型号下面: %v", priceplansNames)
	}

	_, err = s.pool.Exec(ctx, prepareSql.SqlInsertApps, c.AppName, c.AppDescription, c.AppIcon, c.AppCarousel, c.AppSort, c.AppBanner, c.SystemRequirement, c.Rating, c.CopyrightNotice, c.DistributorId, c.ModelId, c.Deleted, c.PricePlansIds, c.Class, c.CategoriesIds, c.IsShowOnMarket, c.IsShowToolTip, c.CatPromo, c.CategoriesId)
	if err != nil {
		log.Error("新增App插入失败", zap.Error(err))
		return err
	}
	return nil
}
func (s *Dbo) CopyApps(ctx context.Context, apps []*wsv1.Apps, distributorId string, modelId string, categoriesIds []int32, pricePlans []int32) (error, []string) {
	log := s.log.Named(ap.StrBuilder("dbo.InsertApps ", strconv.FormatInt(0, 10)))
	var Myerrors []string

	//	遍历验证插入
	for _, app := range apps {
		fmt.Println("--------------------分割线----------------------------------")
		// 	先验证该 apps 的分销商Id与型号Id是否和本 app一致,如果一致,就不复制
		//if app.DistributorId == distributorId && app.ModelId == modelId {
		//	log.Debug("App的分销商Id与型号Id与本app一致，不复制。", zap.String("app自带---"+app.DistributorId+"--"+app.ModelId+":", "上传要求--"+distributorId+"--"+modelId))
		//	Myerrors = append(Myerrors, app.AppName+"的分销商Id与型号Id与选中的分销商型号一致.请移步至对应App进行编辑")
		//	continue
		//}
		var id int32
		err := s.pool.QueryRow(ctx, prepareSql.SqlCheckAppUniqueByUpdate, app.Class, distributorId, modelId).Scan(&id)
		if err != nil {
			log.Error("查询出错, ", zap.Error(err))
		} else {
			if id != app.Id {
				// id 和 t.Id 相等
				log.Debug("App的分销商Id与型号Id与本app一致，不复制。", zap.String("app自带---"+app.DistributorId+"--"+app.ModelId+":", "上传要求--"+distributorId+"--"+modelId))
				Myerrors = append(Myerrors, app.AppName+"的分销商Id与型号Id与选中的分销商型号一致.请移步至对应App进行编辑")
				continue
			}
		}
		// 该app上传的菜单分类要求是否和分销商下的菜单分类一致
		categorieNames := make([]string, 0)
		categoriesArray, err := s.pool.Query(ctx, prepareSql.SqlCheckAppCategories, categoriesIds, distributorId, modelId)
		if err != nil {
			log.Error("该分销商型号暂无该菜单分类", zap.Error(err))
			return nil, Myerrors
		}
		// 遍历查询结果
		for categoriesArray.Next() {
			var v string
			err = categoriesArray.Scan(&v)
			if err != nil {
				log.Error("scan error", zap.Error(err))
				return nil, Myerrors
			}
			categorieNames = append(categorieNames, v)
		}
		// 比较分类名称数量
		if len(categorieNames) != len(categoriesIds) {
			for _, name := range categorieNames {
				log.Debug("仅有以下分类存在于该分销商型号下面:", zap.String(app.AppName+"---"+app.DistributorName+"---"+app.ModelName+":", name))
				Myerrors = append(Myerrors, app.AppName+"仅有以下分类符合目标分销商型号分类"+name)
			}
			Myerrors = append(Myerrors, app.AppName+"下无任何符合目标分销商型号的分类")

			continue
		}
		// 该app上传价格套餐要求是否和分销商下的价格套餐一致
		priceplansNames := make([]string, 0)
		priceplanssArray, err := s.pool.Query(ctx, prepareSql.SqlCheckAppPrice, pricePlans, distributorId, modelId)
		if err != nil {
			log.Error("该分销商型号暂无该价格套餐", zap.Error(err))
			return nil, Myerrors
		}
		// 遍历查询结果
		for priceplanssArray.Next() {
			var v string
			err = priceplanssArray.Scan(&v)
			if err != nil {
				log.Error("scan error", zap.Error(err))
				return nil, Myerrors
			}
			priceplansNames = append(priceplansNames, v)
		}
		// 比较分类名称数量
		if len(priceplansNames) != len(pricePlans) {
			for _, name := range priceplansNames {
				log.Debug("仅有以下分类存在于该分销商型号下面:", zap.String(app.AppName+"---"+app.DistributorName+"---"+app.ModelName+":", name))
				Myerrors = append(Myerrors, app.AppName+"仅有以下价格套餐符合目标分销商型号分类"+name)
			}
			Myerrors = append(Myerrors, app.AppName+"下无任何符合目标分销商型号的价格套餐")

			continue
		}
		tx, err := s.pool.Begin(ctx)
		if err != nil {
			log.Error("tx begin error", zap.Error(err))
			return nil, Myerrors
		}
		appVersion := &wsv1.AppVersion{}
		// ... 确保在 Scan 前初始化 appVersion
		err = tx.QueryRow(ctx, prepareSql.SqlQueryAppVersionIsLatestByAppId, app.Id).Scan(&appVersion.VersionName, &appVersion.Changelog, &appVersion.IsLatest, &appVersion.IsPublic, &appVersion.IsPaid, &appVersion.Filesize, &appVersion.Md5, &appVersion.Url, &appVersion.ForceUninstall, &appVersion.Class)
		if err != nil {
			log.Error("query error", zap.Error(err))
			Myerrors = append(Myerrors, app.AppName+"无添加appversion版本,请先添加")
			tx.Rollback(ctx)
			continue
		}

		var appId int32
		err = tx.QueryRow(ctx, prepareSql.SqlInsertAppByCopy, app.AppName, app.AppDescription, app.AppIcon, app.AppCarousel, app.AppSort, app.AppBanner, app.SystemRequirement, app.Rating, app.CopyrightNotice, distributorId, modelId, false, pricePlans, app.Class, categoriesIds, app.IsShowOnMarket, app.IsShowToolTip, app.CatPromo).Scan(&appId)
		if err != nil {
			log.Error("insert error", zap.Error(err))
			tx.Rollback(ctx)
			return nil, Myerrors
		}
		appVersion.AppId = appId
		dateReleasedStr := time.Now().Format("2006-01-02 15:04:05") // 格式可以根据需要调整
		_, err = tx.Exec(ctx, prepareSql.SqlInsertAppsVersion, appVersion.AppId, appVersion.VersionName, dateReleasedStr, appVersion.Changelog, appVersion.IsLatest, appVersion.IsPublic, appVersion.IsPaid, appVersion.Filesize, appVersion.Md5, appVersion.Url, appVersion.ForceUninstall, false, appVersion.Class)
		if err != nil {
			log.Error("insert error", zap.Error(err))
			tx.Rollback(ctx)
			return nil, Myerrors
		}
		if err := tx.Commit(ctx); err != nil {
			log.Error("tx commit error", zap.Error(err))
			tx.Rollback(ctx)
			return nil, Myerrors
		}
	}
	return nil, Myerrors
}

// AppUser
// 后台管理界面接口
func (s *Dbo) QueryAppUserList(ctx context.Context, tid int64, pageIndex, limit int32, user *wsv1.AppUser) ([]*wsv1.AppUser, int, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryAppUserList ", strconv.FormatInt(tid, 10)))
	var count int
	err := s.pool.QueryRow(ctx, prepareSql.SqlCountAppUserList, user.DistributorId, user.ModelId, user.Mac).Scan(&count)
	if err != nil {
		log.Error("query count error", zap.Error(err))
		return nil, 0, err
	}
	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryAppUserList, user.DistributorId, user.ModelId, user.Mac, limit, pageIndex*limit)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, 0, err
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
			&v.LastLogin,
			&v.Operator,
			&v.DistributorId,
			&v.ModelId,
			&v.DistributorName,
			&v.ModelName,
			&v.IsActive,
			&v.IsService,
			&v.IsExpired,
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

func (s *Dbo) UpdateAppUser(ctx context.Context, t *wsv1.AppUser, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.UpdateApp ", strconv.FormatInt(tid, 10)))
	_, err := s.pool.Exec(ctx, prepareSql.SqlUpdateAppUser, t.UserName, t.Password, t.Ip, t.Country, t.City, t.DistributorId, t.ModelId, t.Deleted, t.IsActive, t.IsService, t.IsExpired, t.Mac)
	if err != nil {
		log.Error("update error", zap.Error(err))
		return err
	}
	return nil
}

//Appversion

func (s *Dbo) QueryAppsVersionList(ctx context.Context, appId string, tid int64, pageIndex, limit int32) ([]*wsv1.AppVersion, int, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryAppsVersionList ", strconv.FormatInt(tid, 10)))
	var count int
	err := s.pool.QueryRow(ctx, prepareSql.SqlCountAppsVersionList).Scan(&count)
	if err != nil {
		log.Error("query count error", zap.Error(err))
		return nil, 0, err
	}
	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryAppsVersionList, appId, limit, pageIndex*limit)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, 0, err
	}
	list := make([]*wsv1.AppVersion, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.AppVersion)
		err = rows.Scan(&v.Id,
			&v.AppId,
			&v.VersionName,
			&v.DateReleased,
			&v.Changelog,
			&v.IsLatest,
			&v.IsPublic,
			&v.IsPaid,
			&v.Filesize,
			&v.Md5,
			&v.Url,
			&v.ForceUninstall,
			&v.Filesize,
			//&v.PricePlans,
			//&v.Categories,
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
func (s *Dbo) InsertAppsVersion(ctx context.Context, c *wsv1.AppVersion, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.InsertAppsVersion ", strconv.FormatInt(tid, 10)))
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		log.Error("tx begin error", zap.Error(err))
		return err
	}
	_, err1 := tx.Exec(ctx, prepareSql.SqlUpdateAppsVersionIsLatest, c.AppId)
	if err1 != nil {
		log.Error("UpdateAppsVersionIsLatest error", zap.Error(err1))
		tx.Rollback(ctx)
		return err1
	}
	dateReleasedStr := time.Now().Format("2006-01-02 15:04:05") // 格式可以根据需要调整

	_, err2 := tx.Exec(ctx, prepareSql.SqlInsertAppsVersion, c.AppId, c.VersionName, dateReleasedStr, c.Changelog, true, c.IsPublic, c.IsPaid, c.Filesize, c.Md5, c.Url, c.ForceUninstall, c.Deleted, c.Class)

	if err1 != nil {
		log.Error("insert error", zap.Error(err1))
		tx.Rollback(ctx)
		return err2
	}
	if err := tx.Commit(ctx); err != nil {
		log.Error("tx commit error", zap.Error(err))
		tx.Rollback(ctx)
		return err
	}
	return nil
}
func (s *Dbo) UpdateAppsVersion(ctx context.Context, c *wsv1.AppVersion, tid int64) error {
	log := s.log.Named(ap.StrBuilder("dbo.UpdateAppsVersion ", strconv.FormatInt(tid, 10)))
	tx, err := s.pool.Begin(ctx)
	_, err1 := tx.Exec(ctx, prepareSql.SqlUpdateAppsVersionIsLatest, c.AppId)
	if err1 != nil {
		log.Error("UpdateAppsVersionIsLatest error", zap.Error(err1))
		tx.Rollback(ctx)
		return err1
	}
	_, err = tx.Exec(ctx, prepareSql.SqlUpdateAppsVersion, c.VersionName, c.Changelog, c.IsLatest, c.IsPaid, c.Filesize, c.Md5, c.Url, c.ForceUninstall, c.Deleted, c.IsPublic, c.Id)
	if err != nil {
		log.Error("update error", zap.Error(err))
		tx.Rollback(ctx)
		return err
	}
	if c.Deleted && c.IsLatest {
		_, err = tx.Exec(ctx, prepareSql.SqlFindAppsVersion, c.AppId)
		if err != nil {
			log.Error("update error", zap.Error(err))
			tx.Rollback(ctx)
			return err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		log.Error("tx commit error", zap.Error(err))
		tx.Rollback(ctx)
		return err
	}
	return nil
}

// 盒子端调用
func (s *Dbo) QueryApps(ctx context.Context, appName string, user *wsv1.AppUser, tid int64) ([]*wsv1.AppInfo, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryApps ", strconv.FormatInt(tid, 10)))

	rows, err := s.pool.Query(ctx, prepareSql.SqlQueryApps, "%"+appName+"%", user.DistributorId, user.ModelId)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	list := make([]*wsv1.AppInfo, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.AppInfo)
		err = rows.Scan(&v.ApkId,
			&v.AppName,
			&v.AppDescription,
			&v.AppIcon,
			&v.AppCarousel,
			&v.AppSort,
			&v.AppBanner,
			&v.SystemRequirement,
			&v.Rating,
			&v.CopyrightNotice,
			&v.CategoriesName,
			&v.PricePlansName,
			&v.Price,
			&v.Deleted,
			&v.Class,
			&v.Version,
			&v.Md5,
			&v.Url,
			&v.Filesize,
			&v.IsShowOnMarket,
			&v.IsShowToolTip,
			&v.CatPromo,
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
func (s *Dbo) GetAppsCategories(ctx context.Context, user *wsv1.AppUser, tid int64) ([]*wsv1.Categories, error) {
	log := s.log.Named(ap.StrBuilder("dbo.GetAppsCategories ", strconv.FormatInt(tid, 10)))

	rows, err := s.pool.Query(ctx, prepareSql.SqlGetAppsCategories, user.DistributorId, user.ModelId)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	list := make([]*wsv1.Categories, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.Categories)
		err = rows.Scan(
			&v.Id,
			&v.CategoryName,
			//&v.Deleted,
			//&v.PricePlans,
			//&v.Categories,
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

	//for _, category := range list {
	//	fmt.Println("进来了", category.Id)
	//	rows, err := s.pool.Query(ctx, sqlGetAppsByCategories, category.Id, user.DistributorId, user.ModelId)
	//	if err != nil {
	//		log.Error("query error", zap.Error(err))
	//		return nil, err
	//	}
	//	list := make([]*wsv1.AppInfo, 0)
	//	defer rows.Close()
	//	for rows.Next() {
	//		v := new(wsv1.AppInfo)
	//		err = rows.Scan(&v.ApkId,
	//			&v.AppName,
	//			&v.AppDescription,
	//			&v.AppIcon,
	//			&v.AppCarousel,
	//			&v.AppSort,
	//			&v.AppBanner,
	//			&v.SystemRequirement,
	//			&v.Rating,
	//			&v.CopyrightNotice,
	//			&v.CategoriesName,
	//			&v.PricePlansName,
	//			&v.Price,
	//			&v.Deleted,
	//			&v.Class,
	//			&v.Version,
	//			&v.Md5,
	//			&v.Url,
	//			&v.Filesize,
	//			&v.IsShowOnMarket,
	//			&v.IsShowToolTip,
	//		)
	//		if err != nil {
	//			log.Error("scan error", zap.Error(err))
	//			return nil, err
	//		}
	//		list = append(list, v)
	//	}
	//	category.AppList = list
	//}
	return list, nil
}
func (s *Dbo) GetAppsByCategories(ctx context.Context, user *wsv1.AppUser, categoriesId int32, tid int64) ([]*wsv1.AppInfo, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryAppsVersionList ", strconv.FormatInt(tid, 10)))
	var rows pgx.Rows
	var err error
	if categoriesId == 10086 {
		rows, err = s.pool.Query(ctx, prepareSql.SqlGetAppsForPushDesktop, user.DistributorId, user.ModelId)
		if err != nil {
			log.Error("query error", zap.Error(err))
			return nil, err
		}
	} else {
		rows, err = s.pool.Query(ctx, prepareSql.SqlGetAppsByCategories, categoriesId, user.DistributorId, user.ModelId)
		if err != nil {
			log.Error("query error", zap.Error(err))
			return nil, err
		}
	}
	list := make([]*wsv1.AppInfo, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.AppInfo)
		err = rows.Scan(&v.ApkId,
			&v.AppName,
			&v.AppDescription,
			&v.AppIcon,
			&v.AppCarousel,
			&v.AppSort,
			&v.AppBanner,
			&v.SystemRequirement,
			&v.Rating,
			&v.CopyrightNotice,
			&v.CategoriesName,
			&v.PricePlansName,
			&v.Price,
			&v.Deleted,
			&v.Class,
			&v.Version,
			&v.Md5,
			&v.Url,
			&v.Filesize,
			&v.IsShowOnMarket,
			&v.IsShowToolTip,
			&v.CatPromo,
			&v.CategoriesId,
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
	if categoriesId == 10086 {
		sort.Slice(list, func(i, j int) bool {
			return list[i].CategoriesId < list[j].CategoriesId
		})
	}
	for _, appInfo := range list {
		fmt.Printf("AppInfo: %+v\n", appInfo.CategoriesId)
	}
	return list, nil
}

func (s *Dbo) GetAppsByClass(ctx context.Context, user *wsv1.AppUser, classVersions *wsv1.ClassVersion, tid int64) ([]*wsv1.AppInfo, error) {
	log := s.log.Named(ap.StrBuilder("dbo.GetAppsByClass ", strconv.FormatInt(tid, 10)))

	var categoriesIds []int
	err := s.pool.QueryRow(ctx, prepareSql.SqlGetCategoriesByClass, classVersions.ClassX, user.DistributorId, user.ModelId).Scan(&categoriesIds)
	if err != nil {
		log.Error("tx begin error", zap.Error(err))
		return nil, err
	}
	rows, err := s.pool.Query(ctx, prepareSql.SqlGetAppsByCategories, categoriesIds[0], user.DistributorId, user.ModelId)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	list := make([]*wsv1.AppInfo, 0)

	defer rows.Close()

	for rows.Next() {
		v := new(wsv1.AppInfo)
		err = rows.Scan(&v.ApkId,
			&v.AppName,
			&v.AppDescription,
			&v.AppIcon,
			&v.AppCarousel,
			&v.AppSort,
			&v.AppBanner,
			&v.SystemRequirement,
			&v.Rating,
			&v.CopyrightNotice,
			&v.CategoriesName,
			&v.PricePlansName,
			&v.Price,
			&v.Deleted,
			&v.Class,
			&v.Version,
			&v.Md5,
			&v.Url,
			&v.Filesize,
			&v.IsShowOnMarket,
			&v.IsShowToolTip,
			&v.CatPromo,
			&v.CategoriesId,
		)
		if err != nil {
			log.Error("scan error", zap.Error(err))
			return nil, err
		}

		list = append(list, v)
	}
	return list, err
}

func (s *Dbo) QueryAppsNewestVersion(ctx context.Context, user *wsv1.AppUser, classVersions []*wsv1.ClassVersion, tid int64) ([]*wsv1.AppInfo, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryAppsVersionList ", strconv.FormatInt(tid, 10)))
	list := make([]*wsv1.AppInfo, 0)
	for _, classVersion := range classVersions {
		// 针对每个classVersion查询最新的app_version
		fmt.Println("classVersion.ClassX", classVersion.ClassX)
		rows, err := s.pool.Query(ctx, prepareSql.SqlQueryAppsNewestVersion, classVersion.ClassX, user.DistributorId, user.ModelId)
		if err != nil {
			log.Error("query error", zap.Error(err))
			return nil, err
		}
		defer rows.Close() // 延迟执行，确保在循环结束后释放资源
		for rows.Next() {
			v := new(wsv1.AppInfo)
			err = rows.Scan(&v.ApkId,
				&v.AppName,
				&v.AppDescription,
				&v.AppIcon,
				&v.AppCarousel,
				&v.AppSort,
				&v.AppBanner,
				&v.SystemRequirement,
				&v.Rating,
				&v.CopyrightNotice,
				&v.CategoriesName,
				&v.PricePlansName,
				&v.Price,
				&v.Deleted,
				&v.Class,
				&v.Version,
				&v.Md5,
				&v.Url,
				&v.Filesize,
				&v.IsShowOnMarket,
				&v.IsShowToolTip,
			)
			fmt.Println("v.version", v.Version)
			fmt.Println("classVersion", classVersion.Version)
			if v.Version == classVersion.Version {
				continue // 如果版本不一致，跳过当前循环
			}
			// 添加到list
			list = append(list, v)
		}
		if rows.Err() != nil {
			log.Error("query result rows error", zap.Error(rows.Err()))
			return nil, rows.Err()
		}
	}
	return list, nil
}

func (s *Dbo) UpdateSelf(ctx context.Context, user *wsv1.AppUser, classVersion *wsv1.ClassVersion, tid int64) ([]*wsv1.AppInfo, error) {
	log := s.log.Named(ap.StrBuilder("dbo.UpdateSelf ", strconv.FormatInt(tid, 10)))
	list := make([]*wsv1.AppInfo, 0)
	// 针对每个classVersion查询最新的app_version
	fmt.Println("classVersion.ClassX", classVersion.ClassX)
	rows, err := s.pool.Query(ctx, prepareSql.SqlUpdateSelf, classVersion.ClassX, user.DistributorId, user.ModelId)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	defer rows.Close() // 延迟执行，确保在循环结束后释放资源
	for rows.Next() {
		v := new(wsv1.AppInfo)
		err = rows.Scan(&v.ApkId,
			&v.AppName,
			&v.AppDescription,
			&v.AppIcon,
			&v.AppCarousel,
			&v.AppSort,
			&v.AppBanner,
			&v.SystemRequirement,
			&v.Rating,
			&v.CopyrightNotice,
			&v.CategoriesName,
			&v.PricePlansName,
			&v.Price,
			&v.Deleted,
			&v.Class,
			&v.Version,
			&v.Md5,
			&v.Url,
			&v.Filesize,
			&v.IsShowOnMarket,
			&v.IsShowToolTip,
			&v.CatPromo,
		)
		if err != nil {
			log.Error(" result scan error", zap.Error(rows.Err()))
			return nil, rows.Err()
		}
		if classVersion.Version == v.Version {
			log.Error(" 传入的app版本和已知的app版本一致,无须更新", zap.Error(rows.Err()))
			return nil, err
		}
		// 添加到list
		list = append(list, v)
	}
	if rows.Err() != nil {
		log.Error("query result rows error", zap.Error(rows.Err()))
		return nil, rows.Err()
	}

	return list, nil
}
func (s *Dbo) InsertAppUser(ctx context.Context, c *wsv1.AppUser, tid int64) (*wsv1.AppUser, error) {
	log := s.log.Named(ap.StrBuilder("dbo.InsertApps ", strconv.FormatInt(tid, 10)))
	newUser := new(wsv1.AppUser)
	//开启事务
	tx, err1 := s.pool.Begin(ctx)
	if err1 != nil {
		log.Error("开启事务失败", zap.Error(err1))
		return nil, err1
	}
	// 使用defer确保事务最终会被提交或回滚
	defer func() {
		if p := recover(); p != nil {
			tx.Rollback(ctx) // 发生panic时回滚事务
			panic(p)         // 重新抛出panic
		}
	}()
	result, err1 := tx.Exec(ctx, prepareSql.SqlDeleteAppUser, c.Mac)
	if err1 != nil {
		log.Error("删除原始AppUser失败", zap.Error(err1))
		tx.Rollback(ctx) // 删除失败时回滚事务
		return nil, err1
	}
	// 检查是否有行被删除
	affected := result.RowsAffected()
	// 如果没有行被删除，说明没有旧记录，可以继续插入新记录
	if affected == 0 {
		log.Debug("没有找到具有相同mac的旧记录，继续插入新记录")
	}
	//_, err := s.pool.Exec(ctx, sqlInsertAppUser, c.UserName, c.Password, c.Mac, c.Ip, c.Country, c.City, c.DistributorId, c.ModelId, c.DistributorName, c.ModelName, c.LastLogin)
	dateLoginStr := time.Now().Format("2006-01-02 15:04:05") // 格式可以根据需要调整

	err := tx.QueryRow(ctx, prepareSql.SqlInsertAppUser, c.UserName, c.Password, c.Mac, c.Ip, c.Country, c.City, c.DistributorId, c.ModelId, dateLoginStr, c.Operator, false, c.IsActive, c.IsExpired, c.IsService).Scan(
		&newUser.UserName,
		&newUser.Password,
		&newUser.Mac,
		&newUser.Ip,
		&newUser.Country,
		&newUser.City,
		&newUser.DistributorId,
		&newUser.ModelId,
		&newUser.LastLogin,
		&newUser.Operator,
	)
	if err != nil {
		log.Error("insert error", zap.Error(err))
		tx.Rollback(ctx)
		return nil, err
	}
	if err := tx.Commit(ctx); err != nil {
		log.Error("tx commit error", zap.Error(err))
		tx.Rollback(ctx)
		return nil, err
	}
	return newUser, err
}
func (s *Dbo) GetAppDownloadUrl(ctx context.Context, appId int32, tid int64) (*wsv1.AppInfo, error) {
	log := s.log.Named(ap.StrBuilder("dbo.QueryApps ", strconv.FormatInt(tid, 10)))

	rows, err := s.pool.Query(ctx, prepareSql.SqlGetAppDownloadUrl, appId)
	fmt.Println("err", err)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	list := make([]*wsv1.AppInfo, 0)

	defer rows.Close()

	for rows.Next() {
		//var v *wsv1.AppInfo
		v := new(wsv1.AppInfo)
		err = rows.Scan(&v.Url)
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
	if len(list) == 0 {
		log.Error("no data", zap.Any("list is empty", list))
		return nil, errors.New("no data")
	}
	return list[0], nil
}
func (s *Dbo) InsertAppsTEEST(ctx context.Context) error {
	//if c.IsShowToolTip >= 1 && c.IsShowToolTip <= 2 {
	//	log.Error("IsShowToolTip and c.IsShowToolTip are both between 1 and 2")
	//}
	fmt.Println("我进来了哈哈")
	var numbers = [5]int{1, 2, 3, 4, 5}
	_, err2 := s.pool.Exec(ctx, "INSERT INTO wst.apps (app_name, deleted, category_ids) VALUES ($1, false,$2);", "测试插入", numbers)
	if err2 != nil {
		fmt.Println("数据测试", err2)
	}
	return nil
}
