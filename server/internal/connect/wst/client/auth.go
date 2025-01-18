package client

import (
	"connectrpc.com/connect"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	wsv1 "github.com/annadance/proto/api/ws/v1"
	"github.com/annadance/wst/internal/connect/aes"
	"github.com/annadance/wst/internal/connect/jwt"
	"go.uber.org/zap"
	"strconv"
)

var aesKeyHex = []byte("mrAMRfVmITakEx95")

var aesIVHex = []byte("NGlcV55daOV36eVy")

var aesBase64 = aes.NewAesBase64(aesKeyHex, aesIVHex)

type AppUserForReturn struct {
	IsActive  bool   `json:"is_active"`
	IsService bool   `json:"is_service"`
	IsExpired bool   `json:"is_expired"`
	Token     string `json:"token"`
}

func (s *Client) GenerateAccount(ctx context.Context, appUser *wsv1.AppUser) ([]byte, bool, error) {
	log := s.log.Named("client.Login  " + strconv.FormatInt(0, 10))
	r := new(wsv1.LoginRequest)
	r.AppUser = appUser

	appUserForReturn := AppUserForReturn{}
	grpcRequestInConnect := connect.NewRequest(r)

	responseInConnect, err := s.grpc.Login(ctx, grpcRequestInConnect)
	if err != nil {
		log.Error("query error", zap.Error(err))
		return nil, false, err
	}
	//aesKey, _ := hex.DecodeString(aesKeyHex)
	//aesIV, _ := hex.DecodeString(aesIVHex)
	user := responseInConnect.Msg.GetAppUser()
	appUserForReturn.IsService = user.IsService
	appUserForReturn.IsExpired = user.IsExpired
	appUserForReturn.IsActive = user.IsActive

	// 加密 AppUser 的字段
	encryptedMac, err := aesBase64.Encrypt([]byte(user.Mac))
	if err != nil {
		log.Error("encrypt mac error", zap.Error(err))
		return nil, false, err
	}
	encryptedUsername, err := aesBase64.Encrypt([]byte(user.UserName))
	if err != nil {
		log.Error("encrypt username error", zap.Error(err))
		return nil, false, err
	}
	encryptedPassword, err := aesBase64.Encrypt([]byte(user.Password))
	if err != nil {
		log.Error("encrypt password error", zap.Error(err))
		return nil, false, err
	}
	encryptedIp, err := aesBase64.Encrypt([]byte(user.Ip))
	if err != nil {
		log.Error("encrypt ip error", zap.Error(err))
		return nil, false, err
	}
	encryptedDistributor, err := aesBase64.Encrypt([]byte(user.DistributorId))
	if err != nil {
		log.Error("encrypt Distributor error", zap.Error(err))
		return nil, false, err
	}
	encryptedModel, err := aesBase64.Encrypt([]byte(user.ModelId))
	if err != nil {
		log.Error("encrypt Model error", zap.Error(err))
		return nil, false, err
	}
	authUser := jwt.AuthUser{
		Mac:         encryptedMac,
		UserName:    encryptedUsername,
		Password:    encryptedPassword,
		Ip:          encryptedIp,
		Distributor: encryptedDistributor,
		Model:       encryptedModel,
	}

	token, err := jwt.GetToken("WStore_LuDan", 1, authUser)
	log.Debug("AuthToken", zap.String("token", token))
	if err != nil {
		log.Error("generate token error", zap.Error(err))
		return nil, false, err
	}
	//appUserForReturn.Token = token
	//marshal, err := json.Marshal(appUserForReturn)
	marshal, err := json.Marshal(token)
	if err != nil {
		log.Error("generate token error", zap.Error(err))
		return nil, false, err
	}
	return marshal, true, nil
}
func (s *Client) AuthAccount(ctx context.Context, ip string, token string) (bool, *wsv1.AppUser, error) {
	log := s.log.Named("client.Auth  " + strconv.FormatInt(0, 10))
	parseToken, err := jwt.ParseToken(token)
	if err != nil {
		log.Error("parseToken error", zap.Error(err))
	}
	//aesKey, _ := hex.DecodeString(aesKeyHex)
	//aesIV, _ := hex.DecodeString(aesIVHex)
	decryptedMac, err := aesBase64.Decrypt(parseToken.Mac)
	if err != nil {
		log.Error("Decrypt password error", zap.Error(err))
		return false, nil, err
	}
	decryptedUsername, err := aesBase64.Decrypt(parseToken.UserName)
	if err != nil {
		log.Error("Decrypt password error", zap.Error(err))
		return false, nil, err
	}
	decryptedPassword, err := aesBase64.Decrypt(parseToken.Password)
	if err != nil {
		log.Error("Decrypt password error", zap.Error(err))
		return false, nil, err
	}
	decryptedIp, err := aesBase64.Decrypt(parseToken.Ip)
	if err != nil {
		log.Error("Decrypt password error", zap.Error(err))
		return false, nil, err
	}
	decrypteDistributor, err := aesBase64.Decrypt(parseToken.Distributor)
	if err != nil {
		log.Error("decrypte Distributor error", zap.Error(err))
		return false, nil, err
	}
	decrypteModel, err := aesBase64.Decrypt(parseToken.Model)
	if err != nil {
		log.Error("decrypte Model error", zap.Error(err))
		return false, nil, err
	}

	// 比较解密后的 IP 地址
	//if string(decryptedIp) != ip {
	//	log.Error("The IP address is inconsistent, please login again", zap.Error(err))
	//	return false, nil, err
	//}
	fmt.Println("mac", decryptedMac, "decri:", string(decryptedMac))
	fmt.Println("ip", decryptedIp, "decri:", string(decryptedIp))
	fmt.Println("distributor", decrypteDistributor, "decri:", string(decrypteDistributor))
	fmt.Println("model", decrypteModel, "decri:", string(decrypteModel))

	r := new(wsv1.AuthAccountRequest)
	appUser := wsv1.AppUser{
		UserName:      string(decryptedUsername),
		Password:      string(decryptedPassword),
		Mac:           string(decryptedMac),
		Ip:            string(decryptedIp),
		DistributorId: string(decrypteDistributor),
		ModelId:       string(decrypteModel),
	}
	r.AppUser = &appUser
	grpcRequestInConnect := connect.NewRequest(r)
	response, err := s.grpc.AuthAccount(ctx, grpcRequestInConnect)
	if response == nil {
		log.Error("AuthAccount response is nil")
		return false, nil, errors.New("AuthAccount response is nil")
	}
	account := response.Msg.GetAppUser()
	if err != nil {
		log.Error("AuthAccount error", zap.Error(err))
		return false, nil, err
	}
	return true, account, nil
}
