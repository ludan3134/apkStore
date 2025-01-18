package client

import (
	"connectrpc.com/connect"
	"context"
	"encoding/json"
	"fmt"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"github.com/pkg/errors"
	"go.uber.org/zap"
	"net/url"
	"strconv"
	"strings"
	"time"
)

func (s *Client) QueryApps(ctx context.Context, appName string, domain string, user *wsv1.AppUser, tid int64) ([]byte, error) {
	// 获取90分钟后的秒数时间戳
	//timestamp := time.Now().Add(90 * time.Minute).Unix()
	//timestampString := strconv.FormatInt(timestamp, 10)
	// 获取5分钟后的秒数时间戳
	timestamp := time.Now().Add(10 * time.Minute).Unix()
	timestampString := strconv.FormatInt(timestamp, 10)
	domainWithoutPort, _ := RemovePortFromURL(domain)

	log := s.log.Named("client.QueryApps  " + strconv.FormatInt(tid, 10))
	r := new(wsv1.QueryAppsRequest)
	r.TransactionId = tid
	r.SessionId = 0
	r.AppUser = user
	r.AppName = appName
	grpcRequestInConnect := connect.NewRequest(r)
	responseInConnect, err := s.grpc.QueryApps(ctx, grpcRequestInConnect)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	apps := responseInConnect.Msg.GetAppsList()
	fmt.Println("我是apps", apps)
	if len(apps) == 0 {
		er2 := errors.New("no data")
		log.Error("list is empty", zap.Error(er2))
		return nil, er2
	}

	for i, app := range apps {
		if len(app.Url) > 0 {
			//apps[i].Url = domain + "/downloads" + app.Url
			//apps[i].Url = domain + urlEncrypt("/downloads"+app.Url, time.Second*90)
			//apps[i].Url = domain + urlEncrypt("/downloads"+app.Url, time.Second*90)
			encrypt := app.Url + "##" + timestampString
			code, _ := ap.EnPwdCode([]byte(encrypt), []byte("8jh4jd82e92is0iw"))
			apps[i].Url = domain + "/downloadFile/" + code
		}
		//test
		testTimestamp := time.Now().Add(10 * time.Minute).Unix()
		testTimestampString := strconv.FormatInt(testTimestamp, 10)
		app.ExpirationTime = testTimestampString

		if len(app.AppCarousel) > 0 {
			apps[i].AppCarousel = domainWithoutPort + "/images" + app.AppCarousel
			//apps[i].AppCarousel = domain + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)

		}
		if len(app.CatPromo) > 0 {
			apps[i].CatPromo = domainWithoutPort + "/images" + app.CatPromo
			//apps[i].AppCarousel = domain + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)
		}
		if len(app.AppIcon) > 0 {
			apps[i].AppIcon = domainWithoutPort + "/images" + app.AppIcon
			//apps[i].AppIcon = domain + urlEncrypt("/downloads"+app.AppIcon, time.Second*90)
		}
		if len(app.AppBanner) > 0 {
			for j, appBanner := range app.AppBanner {
				if len(appBanner) > 0 {
					// 替换路径中的前缀
					//apps[i].AppBanner[j] = domain + "/downloads" + appBanner
					//测一下链接加密
					apps[i].AppBanner[j] = domainWithoutPort + "/images" + appBanner

				}
			}
		}

	}
	//var data struct {
	//	Version string `json:"version"`
	//	Content string `json:"content"`
	//}
	//data.Version = strconv.FormatInt(apps.Updated, 10)
	//data.Content = nof.Content
	a, err := json.Marshal(apps)
	if err != nil {
		log.Error("json.Marshal error", zap.Error(err))
		return nil, err
	}
	return a, nil
}

func (s *Client) GetAppsByCategories(ctx context.Context, categoriesId int32, domain string, user *wsv1.AppUser, tid int64) ([]byte, error) {
	// 获取90分钟后的秒数时间戳
	//timestamp := time.Now().Add(90 * time.Minute).Unix()
	//timestampString := strconv.FormatInt(timestamp, 10)
	// 获取5分钟后的秒数时间戳
	domainWithoutPort, _ := RemovePortFromURL(domain)

	timestamp := time.Now().Add(10 * time.Minute).Unix()
	timestampString := strconv.FormatInt(timestamp, 10)
	log := s.log.Named("client.GetAppsCategories  " + strconv.FormatInt(tid, 10))
	r := new(wsv1.GetAppsByCategoriesRequest)
	r.TransactionId = tid
	r.SessionId = 0
	r.CategoriesId = categoriesId
	r.AppUser = user
	grpcRequestInConnect := connect.NewRequest(r)
	responseInConnect, err := s.grpc.GetAppsByCategories(ctx, grpcRequestInConnect)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	apps := responseInConnect.Msg.GetAppsList()
	if len(apps) == 0 {
		er2 := errors.New("no data")
		log.Error("list is empty", zap.Error(er2))
		return nil, er2
	}
	for i, app := range apps {
		if len(app.Url) > 0 {
			encrypt := app.Url + "##" + timestampString
			code, _ := ap.EnPwdCode([]byte(encrypt), []byte("8jh4jd82e92is0iw"))
			apps[i].Url = domain + "/downloadFile/" + code
		}
		//test
		testTimestamp := time.Now().Add(10 * time.Minute).Unix()
		testTimestampString := strconv.FormatInt(testTimestamp, 10)
		app.ExpirationTime = testTimestampString

		if len(app.AppCarousel) > 0 {
			apps[i].AppCarousel = domainWithoutPort + "/images" + app.AppCarousel
			//apps[i].AppCarousel = domain + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)
			//apps[i].AppCarousel = "127.0.0.1:8061/downloadFile" + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)

		}
		if len(app.AppIcon) > 0 {
			//apps[i].AppIcon = domain + "/downloads" + app.AppIcon
			apps[i].AppIcon = domainWithoutPort + "/images" + app.AppIcon

		}
		if len(app.CatPromo) > 0 {
			apps[i].CatPromo = domainWithoutPort + "/images" + app.CatPromo
			//apps[i].AppCarousel = domain + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)
		}
		if len(app.AppBanner) > 0 {
			for j, appBanner := range app.AppBanner {
				if len(appBanner) > 0 {
					// 替换路径中的前缀
					//apps[i].AppBanner[j] = domain + "/downloads" + appBanner
					//测一下链接加密
					//apps[i].AppBanner[j] = domain + urlEncrypt("/downloads"+appBanner, time.Second*90)
					apps[i].AppBanner[j] = domainWithoutPort + "/images" + appBanner

				}
			}
		}

	}
	a, err := json.Marshal(apps)
	if err != nil {
		log.Error("json.Marshal error", zap.Error(err))
		return nil, err
	}
	return a, nil
}

func (s *Client) GetAppsByClass(ctx context.Context, classVersions *wsv1.ClassVersion, domain string, user *wsv1.AppUser, tid int64) ([]byte, error) {
	// 获取90分钟后的秒数时间戳
	//timestamp := time.Now().Add(90 * time.Minute).Unix()
	//timestampString := strconv.FormatInt(timestamp, 10)
	// 获取5分钟后的秒数时间戳
	domainWithoutPort, _ := RemovePortFromURL(domain)

	timestamp := time.Now().Add(10 * time.Minute).Unix()
	timestampString := strconv.FormatInt(timestamp, 10)
	log := s.log.Named("client.GetAppsCategories  " + strconv.FormatInt(tid, 10))
	r := new(wsv1.GetAppsByClassRequest)
	r.ClassVersion = classVersions
	r.AppUser = user
	grpcRequestInConnect := connect.NewRequest(r)
	responseInConnect, err := s.grpc.GetAppsByClass(ctx, grpcRequestInConnect)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	apps := responseInConnect.Msg.GetAppsList()
	fmt.Println("applist!!!", apps)
	if len(apps) == 0 {
		er2 := errors.New("no data")
		log.Error("list is empty", zap.Error(er2))
		return nil, er2
	}
	for i, app := range apps {
		if len(app.Url) > 0 {
			encrypt := app.Url + "##" + timestampString
			code, _ := ap.EnPwdCode([]byte(encrypt), []byte("8jh4jd82e92is0iw"))
			apps[i].Url = domain + "/downloadFile/" + code
		}
		//test
		testTimestamp := time.Now().Add(10 * time.Minute).Unix()
		testTimestampString := strconv.FormatInt(testTimestamp, 10)
		app.ExpirationTime = testTimestampString

		if len(app.AppCarousel) > 0 {
			apps[i].AppCarousel = domainWithoutPort + "/images" + app.AppCarousel
			//apps[i].AppCarousel = domain + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)
			//apps[i].AppCarousel = "127.0.0.1:8061/downloadFile" + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)

		}
		if len(app.CatPromo) > 0 {
			apps[i].CatPromo = domainWithoutPort + "/images" + app.CatPromo
			//apps[i].AppCarousel = domain + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)
		}
		if len(app.AppIcon) > 0 {
			//apps[i].AppIcon = domain + "/downloads" + app.AppIcon
			apps[i].AppIcon = domainWithoutPort + "/images" + app.AppIcon

		}
		if len(app.AppBanner) > 0 {
			for j, appBanner := range app.AppBanner {
				if len(appBanner) > 0 {
					// 替换路径中的前缀
					//apps[i].AppBanner[j] = domain + "/downloads" + appBanner
					//测一下链接加密
					//apps[i].AppBanner[j] = domain + urlEncrypt("/downloads"+appBanner, time.Second*90)
					apps[i].AppBanner[j] = domainWithoutPort + "/images" + appBanner

				}
			}
		}

	}
	a, err := json.Marshal(apps)
	if err != nil {
		log.Error("json.Marshal error", zap.Error(err))
		return nil, err
	}
	return a, nil
}
func (s *Client) QueryAppsNewestVersion(ctx context.Context, classVersions []*wsv1.ClassVersion, domain string, user *wsv1.AppUser, tid int64) ([]byte, error) {
	// 获取90分钟后的秒数时间戳
	timestamp := time.Now().Add(10 * time.Minute).Unix()
	timestampString := strconv.FormatInt(timestamp, 10)
	domainWithoutPort, _ := RemovePortFromURL(domain)
	fmt.Println("domain.xx", domainWithoutPort)

	log := s.log.Named("client.QueryAppsNewestVersion  " + strconv.FormatInt(tid, 10))
	r := new(wsv1.QueryAppsNewestVersionRequest)
	r.TransactionId = tid
	r.SessionId = 0
	r.ClassVersion = classVersions
	r.AppUser = user
	grpcRequestInConnect := connect.NewRequest(r)
	responseInConnect, err := s.grpc.QueryAppsNewestVersion(ctx, grpcRequestInConnect)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	apps := responseInConnect.Msg.GetAppsList()
	fmt.Println("我是AAapps", apps)
	if len(apps) == 0 {
		er2 := errors.New("no data")
		log.Error("list is empty", zap.Error(er2))
		return nil, er2
	}
	for i, app := range apps {
		if len(app.Url) > 0 {
			//apps[i].Url = domain + "/downloads" + app.Url
			//apps[i].Url = domain + urlEncrypt("/downloads"+app.Url, time.Second*90)
			encrypt := app.Url + "##" + timestampString
			code, _ := ap.EnPwdCode([]byte(encrypt), []byte("8jh4jd82e92is0iw"))
			apps[i].Url = domain + "/downloadFile/" + code
		}
		app.ExpirationTime = timestampString
		if len(app.AppCarousel) > 0 {
			//apps[i].AppCarousel = domain + "/downloads" + app.AppCarousel
			apps[i].AppCarousel = domainWithoutPort + "/images" + app.AppCarousel
		}
		if len(app.AppIcon) > 0 {
			//apps[i].AppIcon = domain + "/downloads" + app.AppIcon
			apps[i].AppIcon = domainWithoutPort + "/images" + app.AppIcon
		}
		if len(app.CatPromo) > 0 {
			apps[i].CatPromo = domainWithoutPort + "/images" + app.CatPromo
			//apps[i].AppCarousel = domain + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)
		}
		if len(app.AppBanner) > 0 {
			for j, appBanner := range app.AppBanner {
				if len(appBanner) > 0 {
					// 替换路径中的前缀
					//apps[i].AppBanner[j] = domain + "/downloads" + appBanner
					//测一下链接加密
					apps[i].AppBanner[j] = domainWithoutPort + "/images" + appBanner

				}
			}
		}
	}
	a, err := json.Marshal(apps)
	if err != nil {
		log.Error("json.Marshal error", zap.Error(err))
		return nil, err
	}
	return a, nil
}
func (s *Client) UpdateSelf(ctx context.Context, classVersions *wsv1.ClassVersion, domain string, user *wsv1.AppUser, tid int64) ([]byte, error) {
	// 获取90分钟后的秒数时间戳
	//timestamp := time.Now().Add(90 * time.Minute).Unix()
	//timestampString := strconv.FormatInt(timestamp, 10)
	// 获取5分钟后的秒数时间戳
	timestamp := time.Now().Add(10 * time.Minute).Unix()
	timestampString := strconv.FormatInt(timestamp, 10)
	log := s.log.Named("client.UpdateSelf  " + strconv.FormatInt(tid, 10))
	fmt.Println("classVersionsAAA", classVersions)
	r := new(wsv1.UpdateSelfRequest)
	r.TransactionId = tid
	r.SessionId = 0
	r.ClassVersion = classVersions
	r.AppUser = user
	grpcRequestInConnect := connect.NewRequest(r)
	responseInConnect, err := s.grpc.UpdateSelf(ctx, grpcRequestInConnect)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	app := responseInConnect.Msg.GetApp()
	fmt.Println("apps", app)
	var domainWithoutPort = domain
	//不带端口
	if colonIndex := strings.IndexByte(domain, ':'); colonIndex != -1 {
		domainWithoutPort = domain[:colonIndex]
	}
	if len(app.Url) > 0 {
		//apps[i].Url = domain + "/downloads" + app.Url
		//apps[i].Url = domain + urlEncrypt("/downloads"+app.Url, time.Second*90)
		encrypt := app.Url + "##" + timestampString
		code, _ := ap.EnPwdCode([]byte(encrypt), []byte("8jh4jd82e92is0iw"))
		app.Url = domain + "/downloadFile/" + code
	}
	//test
	testTimestamp := time.Now().Add(10 * time.Minute).Unix()
	testTimestampString := strconv.FormatInt(testTimestamp, 10)
	app.ExpirationTime = testTimestampString

	if len(app.AppCarousel) > 0 {
		//apps[i].AppCarousel = domain + "/downloads" + app.AppCarousel
		app.AppCarousel = domainWithoutPort + "/images" + app.AppCarousel
	}
	if len(app.AppIcon) > 0 {
		//apps[i].AppIcon = domain + "/downloads" + app.AppIcon
		app.AppIcon = domainWithoutPort + "/images" + app.AppIcon
	}
	if len(app.CatPromo) > 0 {
		//apps[i].AppIcon = domain + "/downloads" + app.AppIcon
		app.CatPromo = domainWithoutPort + "/images" + app.CatPromo
	}
	if len(app.AppBanner) > 0 {
		for j, appBanner := range app.AppBanner {
			if len(appBanner) > 0 {
				// 替换路径中的前缀
				//apps[i].AppBanner[j] = domain + "/downloads" + appBanner
				//测一下链接加密
				app.AppBanner[j] = domainWithoutPort + "/images" + appBanner

			}
		}
	}

	a, err := json.Marshal(app)
	if err != nil {
		log.Error("json.Marshal error", zap.Error(err))
		return nil, err
	}
	return a, nil
}

func (s *Client) GetAppDownloadUrl(ctx context.Context, domain string, appInfo *wsv1.AppInfo, user *wsv1.AppUser) ([]byte, error) {
	log := s.log.Named("client.GetAppDownloadUrl  " + strconv.FormatInt(0, 10))
	// 获取90分钟后的秒数时间戳
	timestamp := time.Now().Add(90 * time.Minute).Unix()
	timestampString := strconv.FormatInt(timestamp, 10)
	r := new(wsv1.GetAppDownloadUrlRequest)
	r.AppUser = user
	r.AppInfo = appInfo
	grpcRequestInConnect := connect.NewRequest(r)
	responseInConnect, err := s.grpc.GetAppDownloadUrl(ctx, grpcRequestInConnect)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, err
	}
	app := responseInConnect.Msg.GetAppInfo()
	fmt.Println("app", app)
	if len(app.Url) > 0 {
		//apps[i].Url = domain + "/downloads" + app.Url
		//apps[i].Url = domain + urlEncrypt("/downloads"+app.Url, time.Second*90)
		encrypt := app.Url + "##" + timestampString
		code, _ := ap.EnPwdCode([]byte(encrypt), []byte("8jh4jd82e92is0iw"))
		app.Url = domain + "/downloadFile/" + code
	}
	//test
	testTimestamp := time.Now().Add(5 * time.Minute).Unix()
	testTimestampString := strconv.FormatInt(testTimestamp, 10)
	app.ExpirationTime = testTimestampString
	//app.AppCarousel = domain + urlEncrypt("/downloads"+app.AppCarousel, time.Second*90)
	//app.AppIcon = domain + urlEncrypt("/downloads"+app.AppIcon, time.Second*90)
	//for j, appBanner := range app.AppBanner {
	//	if len(appBanner) > 0 {
	//		// 替换路径中的前缀
	//		//apps[i].AppBanner[j] = domain + "/downloads" + appBanner
	//		//测一下链接加密
	//		app.AppBanner[j] = domain + urlEncrypt("/downloads"+appBanner, time.Second*90)
	//
	//	}
	//}
	a, err := json.Marshal(app)
	if err != nil {
		log.Error("json.Marshal error", zap.Error(err))
		return nil, err
	}
	return a, nil
}
func RemovePortFromURL(rawURL string) (string, error) {
	// 解析URL
	u, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}
	// 移除端口
	u.Host = u.Hostname()
	// 重新组合URL
	return u.String(), nil
}
