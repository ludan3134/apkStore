package jwt

import (
	"errors"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var jwtKey = "8jh4jd82e92is0iw"

type AuthClaim struct {
	Mac         string `json:"json:mac"`
	UserName    string `json:"json:user_name"`
	Password    string `json:"json:password"`
	Ip          string `json:"json:ip"`
	Distributor string `json:"json:distributor"`
	Model       string `json:"json:model"`
	jwt.RegisteredClaims
}
type AuthUser struct {
	Mac         string
	UserName    string
	Password    string
	Ip          string
	Distributor string
	Model       string
}

func GetToken(issuer string, expireHour int, user AuthUser) (string, error) {
	mySigningKey := []byte(jwtKey)
	claims := AuthClaim{
		UserName:    user.UserName,
		Password:    user.Password,
		Mac:         user.Mac,
		Ip:          user.Ip,
		Distributor: user.Distributor,
		Model:       user.Model,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    issuer,                                                                    // 填入签发者
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Duration(expireHour) * time.Hour)), // 填写到期时间
			IssuedAt:  jwt.NewNumericDate(time.Now()),                                            // 填写签发时间
		},
	}
	// 根据选择的加密方式生成jwt密钥
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString(mySigningKey)
}
func ParseToken(tokenString string) (*AuthClaim, error) {
	mySigningKey := []byte(jwtKey) //填入自己存放的jwt密钥
	token, err := jwt.ParseWithClaims(tokenString, &AuthClaim{}, func(t *jwt.Token) (interface{}, error) {
		return mySigningKey, nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(*AuthClaim); ok && token.Valid {
		return claims, nil
	}
	return nil, errors.New("tokenErr")
}
