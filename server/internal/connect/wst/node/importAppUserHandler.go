package node

import (
	"crypto/md5"
	"encoding/json"
	"errors"
	"fmt"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/ap"
	"github.com/annadance/wst/internal/connect/wst/service"
	"github.com/spf13/afero"
	"github.com/valyala/fasthttp"
	"github.com/xuri/excelize/v2"
	"go.uber.org/zap"
	"math/rand"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

func (s *Node) importAppUserHandler() func(ctx *fasthttp.RequestCtx) {
	return func(ctx *fasthttp.RequestCtx) {
		ctx.Response.Header.Set("Access-Control-Allow-Origin", "*")
		ctx.Response.Header.Set("Access-Control-Request-Method", "*")
		ctx.SetContentType("application/json")

		tid := int64(ctx.ID())

		rip := ctx.RemoteIP().String()
		log := s.log.Named(StrBuilder("importAppUserHandler ", strconv.FormatInt(tid, 10)))
		log.Debug("-------------------------- importAppUserHandler begin -------------")
		defer log.Debug("-------------------------- importAppUserHandler end -------------")

		log.Debug("importAppUserHandler RpcClient ip address: " + rip)
		//------------------------------------------------------------------------------------

		fh, err := ctx.FormFile(s.cfg.FileName)
		if err != nil {
			log.Error("file can't fetch from form", zap.Error(err))
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, false, 4004, "file can't fetch from form", struct{}{})))
			return
		}
		rand.New(rand.NewSource(time.Now().Unix()))
		randNum := fmt.Sprintf("%d", rand.Intn(9999)+1000)
		hashName := md5.Sum([]byte(time.Now().Format("20060102150405") + randNum))
		fh.Filename = StrBuilder(fmt.Sprintf("%x", hashName), "-", fh.Filename)
		ext := filepath.Ext(fh.Filename)
		if ext != ".xlsx" && ext != ".xls" {
			log.Error("File format error", zap.Error(err))
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, false, 4005, "File format error", struct{}{})))
			return
		}

		fun := B2S(ctx.FormValue("fun"))
		distributorId := B2S(ctx.FormValue("distributor_id"))
		modelId := B2S(ctx.FormValue("model_id"))

		log.Debug("params", zap.String("fun", fun), zap.String("distributor_id", distributorId), zap.String("model_id", modelId))

		if len(fun) <= 0 || len(distributorId) <= 0 || len(modelId) <= 0 {
			log.Error("params can not be empty")
			ctx.SetStatusCode(fasthttp.StatusBadRequest)
			ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, false, 4006, "params can not be empty", struct{}{})))
			return
		}
		afs := afero.NewOsFs()
		check, _ := afero.DirExists(afs, s.cfg.FileDir)
		if !check {
			er1 := afs.MkdirAll(s.cfg.FileDir, 0o755)
			if er1 != nil {
				log.Error("make full path error", zap.String("path", s.cfg.FileDir), zap.Error(er1))
				ctx.SetStatusCode(fasthttp.StatusInternalServerError)
				ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, false, 5000, "dir not exist", struct{}{})))
				return
			}
		}

		fileFullPath := s.cfg.FileDir + fh.Filename
		log.Debug("fileFullPath", zap.String("fileFullPath", fileFullPath))
		if err := fasthttp.SaveMultipartFile(fh, fileFullPath); err != nil {
			log.Error("file save error:", zap.Error(err))
			ctx.SetStatusCode(fasthttp.StatusInternalServerError)
			ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, false, 5001, "file save error", struct{}{})))
			return
		}

		f, err := excelize.OpenFile(fileFullPath)
		if err != nil {
			log.Error("excel open error:", zap.Error(err))
			ctx.SetStatusCode(fasthttp.StatusInternalServerError)
			ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, false, 5002, "excel open error", struct{}{})))
			return
		}
		defer func() {
			// Close the spreadsheet.
			if err := f.Close(); err != nil {
				log.Error("f close error:", zap.Error(err))
			}
		}()

		rows, err := f.GetRows("Sheet1")
		if err != nil {
			log.Error("excel GetRows error:", zap.Error(err))
			ctx.SetStatusCode(fasthttp.StatusInternalServerError)
			ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, false, 5003, "excel GetRows error", struct{}{})))
			return
		}
		log.Debug("rows length", zap.Int("length", len(rows)))
		list := make([]*wsv1.AppUser, 0)
		//total := int32(len(rows) - 1)
		for i := range rows {
			if i == 0 {
				continue
			}
			mac, _ := f.GetCellValue("Sheet1", "A"+fmt.Sprintf("%d", i+1))
			mac = strings.TrimSpace(mac)
			macAddr := mac[0:2] + ":" + mac[2:4] + ":" + mac[4:6] + ":" + mac[6:8] + ":" + mac[8:10] + ":" + mac[10:12]
			macAddr = strings.ToLower(macAddr)

			m, er1 := net.ParseMAC(macAddr)
			if er1 != nil {
				log.Error("ParseMAC error", zap.Error(er1), zap.String("mac", mac))
				continue
			}
			macString := m.String()
			macInt, er2 := ap.Mac2Int64(macString)
			if er2 != nil {
				log.Error("Mac2Int64 error", zap.Error(er2), zap.String("mac", mac))
				continue
			}
			if macInt == 0 {
				continue
			}

			a := new(wsv1.AppUser)
			a.DistributorId = distributorId
			a.Mac = strconv.FormatInt(macInt, 10)
			a.ModelId = modelId
			usernameFromMac := service.GenerateUsernameFromMac(mac)
			passwordFromMac := service.GeneratePasswordFromMac(mac)
			a.UserName = usernameFromMac
			a.Password = passwordFromMac
			a.Operator = "admin_BulkInsert"
			a.Country = "中国"
			a.City = "深圳"
			list = append(list, a)
		}

		log.Debug("list length", zap.Int("length", len(list)))
		successCount, failCount := s.dbo.InsertAppUserList(ctx, list)
		if err != nil {
			log.Error("insert error:", zap.Error(err))
			ctx.SetStatusCode(fasthttp.StatusInternalServerError)
			ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, false, 5004, "insert error", struct{}{})))
			return
		}
		//go s.client.Callback(context.Background(), tid)
		// 使用 os.Remove 删除文件
		if err := os.Remove(fileFullPath); err != nil {
			log.Error("os.Remove error", zap.Error(err))
		}
		ctx.SetStatusCode(fasthttp.StatusOK)
		ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, true, 0, respMsgFormat(successCount, failCount), struct{}{})))
		return
	}
}

func parseDuration(str string) (time.Duration, error) {
	var d time.Duration
	if strings.Contains(str, "day") {
		str = strings.Replace(str, "day", "", 1)
		d = 24 * time.Hour
	} else if strings.Contains(str, "month") {
		str = strings.Replace(str, "month", "", 1)
		d = 30 * 24 * time.Hour
	} else if strings.Contains(str, "year") {
		str = strings.Replace(str, "year", "", 1)
		d = 365 * 24 * time.Hour
	} else {
		return 0, errors.New("str error")
	}
	i, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return 0, err
	}
	return time.Duration(i) * d, nil
}

func respMsgFormat(successCount int32, failedLen int32) string {
	response := map[string]interface{}{
		"status":  true, // 默认成功
		"code":    0,    // 成功状态码
		"message": "操作成功",
		"data": map[string]interface{}{
			//"total":        total,
			"successCount": successCount,
			"failedLen":    failedLen,
		},
	}

	// 将map转换为JSON格式字符串
	jsonStr, err := json.Marshal(response)
	if err != nil {
		// 如果转换失败，返回一个简单的错误消息
		return fmt.Sprintf(`{"status": false, "code": 500, "message": "内部服务器错误", "data": null}`)
	}

	return string(jsonStr)
}
