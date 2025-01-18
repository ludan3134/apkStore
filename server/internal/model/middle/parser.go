package middle

import (
	"errors"
	"reflect"
	"strconv"
	"strings"
	"unsafe"
)

func PayloadBuilder(mp map[string]string) string {
	if len(mp) == 0 {
		return ""
	}
	var str strings.Builder

	for k, v := range mp {
		// str += "&" + k + "=" + v
		str.WriteString("&")
		str.WriteString(k)
		str.WriteString("=")
		str.WriteString(v)
	}
	return str.String()
}

func ParsePayload(str string) (map[string]string, error) {
	return parsePayload(str)
}

func parsePayload(str string) (map[string]string, error) {
	if len(str) == 0 {
		return nil, errors.New("null string")
	}

	// &aaaa=bbbb&cccc=cdcd
	str = strings.TrimSpace(str)
	str = strings.TrimPrefix(str, "&")
	if len(str) == 0 {
		return nil, errors.New("null string")
	}
	// aaaa=bbbb&cccc=dddd

	mp := make(map[string]string)

	// aaaa=bbbb
	// cccc=dddd
	for _, v := range strings.Split(str, "&") {
		if len(v) > 0 {
			kk := strings.Split(v, "=")
			if len(kk) == 2 {
				if len(kk[0]) == 0 || len(kk[1]) == 0 {
					continue
				}
				mp[strings.ToLower(kk[0])] = kk[1]
			}
		}
	}

	if len(mp) == 0 {
		return nil, errors.New("no data")
	}
	return mp, nil
}

type Middle struct {
	ChipIdentity string // chip
	ApkType      string // apk_type
	ApkVersion   string // apk version
	MacString    string // mac address "00:00:00:00:00:00"
	MwVersion    string // middle ware version for 加密方法对应的密匙, 不同的 mw version 对应不同的 密匙
	Code         string
	Id           int64 // account id from Database
	Ip           int64 // 终端访问 http 边缘服务器时的, apk 自己的网卡的公网 ip
	Ex           int64 // 过期时间, UTC timestamp , 单位是秒
}

func ParseMiddleWare(str string) (*Middle, error) {
	mpa, err := parsePayload(str)
	if err != nil {
		return nil, err
	}
	md := new(Middle)
	//
	chip, chk := mpa["chip"]
	if !chk {
		err = errors.New("chip not found")
		return nil, err
	}
	md.ChipIdentity = chip

	apk, chk1 := mpa["apk"]
	if !chk1 {
		err = errors.New("apk not found")
		return nil, err
	}
	md.ApkType = apk
	ver, chk2 := mpa["ver"]
	if !chk2 {
		err = errors.New("ver not found")
		return nil, err
	}
	md.ApkVersion = ver
	mw, chk3 := mpa["mw"]
	if !chk3 {
		err = errors.New("mw  not found")
		return nil, err
	}
	md.MwVersion = mw
	mac, chk4 := mpa["mac"]
	if !chk4 {
		err = errors.New("mac not found")
		return nil, err
	}
	md.MacString = mac
	code, chk5 := mpa["code"]
	if !chk5 {
		err = errors.New("code not found")
		return nil, err
	}
	md.Code = code
	return md, nil
}

func (s *Middle) String() string {
	idStr := strconv.FormatInt(s.Id, 10)
	ipStr := strconv.FormatInt(s.Ip, 10)
	exStr := strconv.FormatInt(s.Ex, 10)
	return StrBuilder(
		"&chip=", s.ChipIdentity,
		"&apk=", s.ApkType,
		"&ver=", s.ApkVersion,
		"&mw=", s.MwVersion,
		"&mac=", s.MacString,
		"&code=", s.Code,
		"&id=", idStr,
		"&ip=", ipStr,
		"&ex=", exStr)
}

// B2S converts byte slice to a string without memory allocation.
// See https://groups.google.com/forum/#!msg/Golang-Nuts/ENgbUzYvCuU/90yGx7GUAgAJ .
//
// Note it may break if string and/or slice header will change
// in the future go versions.
// nolint
func B2S(b []byte) string {
	return *(*string)(unsafe.Pointer(&b))
}

// S2B converts string to a byte slice without memory allocation.
//
// Note it may break if string and/or slice header will change
// in the future go versions.
// nolint
func S2B(s string) (b []byte) {
	bh := (*reflect.SliceHeader)(unsafe.Pointer(&b))
	sh := *(*reflect.StringHeader)(unsafe.Pointer(&s))
	bh.Data = sh.Data
	bh.Len = sh.Len
	bh.Cap = sh.Len
	return b
}

// StrBuilder strings builder
func StrBuilder(args ...string) string {
	if len(args) == 0 {
		return ""
	}
	var str strings.Builder

	for _, v := range args {
		str.WriteString(v)
	}
	return str.String()
}
