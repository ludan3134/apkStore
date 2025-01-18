package ap

import (
	"errors"
	"fmt"
	"io"
	"net"
	"net/http"
	"strconv"
	"strings"
)

var (
	ErrorIPParse         = errors.New("IPParse error")
	ErrorAccountIdFormat = errors.New("account id format error")
	ErrorMacIsZero       = errors.New("MacIsZero error")
	ErrorMacIsFull       = errors.New("MacIsFull error")
	ErrorMacParse        = errors.New("mac address parse error")
)

const (
	MacFull = 281474976710655
)

// GetLocalIP get all your local ipv4 address (except 127.0.0.1)
func GetLocalIP() ([]string, error) {
	adds, err := net.InterfaceAddrs()
	if err != nil {
		return nil, err
	}
	IPs := make([]string, 0)
	for _, a := range adds {
		if ipNet, ok := a.(*net.IPNet); ok && !ipNet.IP.IsLoopback() {
			if ipNet.IP.To4() != nil {
				IPs = append(IPs, ipNet.IP.To4().String())
			}
		}
	}
	return IPs, nil
}

// GetOutboundIP get the out bound ip, especially useful when you have multi local ipv4 ip and you want figure out which one is been used
func GetOutboundIP() (string, error) {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	// conn, err := net.Dial("udp", "114.114.114.114:80")
	if err != nil {
		return "", err
	}
	defer func() {
		_ = conn.Close()
	}()
	localAddr := conn.LocalAddr().(*net.UDPAddr)
	return localAddr.IP.String(), nil
}

// GetPublicIP get your publilc ip
func GetPublicIP() (string, error) {
	resp, err := http.Get("https://ifconfig.me")
	if err != nil {
		return "", err
	}
	defer func() {
		_ = resp.Body.Close()
	}()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

// GetNetMeta get ip address
func GetNetMeta() (string, int64, error) {
	ip, err := GetPublicIP()
	if err != nil {
		return "", 0, err
	}

	var ip64 int64
	ip64, err = IPStringToInt(ip)
	if err != nil {
		return "", 0, err
	}
	return ip, ip64, nil
}

// IPStringToInt converts a string to a ip address
func IPStringToInt(s string) (int64, error) {
	ip := net.ParseIP(s)
	if ip == nil {
		return 0, ErrorIPParse
	}
	return IP4toInt(net.ParseIP(s)), nil // net.ParseIP(s)
}

// IP4toInt converts a string to a ip address
func IP4toInt(IPv4Addr net.IP) int64 {
	bits := strings.Split(IPv4Addr.String(), ".")

	b0, _ := strconv.Atoi(bits[0])
	b1, _ := strconv.Atoi(bits[1])
	b2, _ := strconv.Atoi(bits[2])
	b3, _ := strconv.Atoi(bits[3])

	var sum int64

	// left shifting 24,16,8,0 and bitwise OR

	sum += int64(b0) << 24
	sum += int64(b1) << 16
	sum += int64(b2) << 8
	sum += int64(b3)

	return sum
}

// IP4String converts a ip address to a string
func IP4String(ipInt int64) string {
	// need to do two bit shifting and “0xff” masking
	b0 := strconv.FormatInt((ipInt>>24)&0xff, 10)
	b1 := strconv.FormatInt((ipInt>>16)&0xff, 10)
	b2 := strconv.FormatInt((ipInt>>8)&0xff, 10)
	b3 := strconv.FormatInt(ipInt&0xff, 10)
	return b0 + "." + b1 + "." + b2 + "." + b3
}

// Int64ToMac converts a ip address to a string
func Int64ToMac(ipInt int64) (string, error) {
	// need to do two bit shifting and “0xff” masking
	if ipInt <= 0 {
		return "", errors.New("MacIsZero error")
	}
	if ipInt >= MacFull {
		return "", errors.New("MacIsFull error")
	}

	// b0 := strconv.FormatInt((ipInt>>48)&0xff, 16)
	b1 := strconv.FormatInt((ipInt>>40)&0xff, 16)
	b2 := strconv.FormatInt((ipInt>>32)&0xff, 16)
	b3 := strconv.FormatInt((ipInt>>24)&0xff, 16)
	b4 := strconv.FormatInt((ipInt>>16)&0xff, 16)
	b5 := strconv.FormatInt((ipInt>>8)&0xff, 16)
	b6 := strconv.FormatInt(ipInt&0xff, 16)
	if len(b1) == 1 {
		b1 = "0" + b1
	}
	if len(b2) == 1 {
		b2 = "0" + b2
	}
	if len(b3) == 1 {
		b3 = "0" + b3
	}
	if len(b4) == 1 {
		b4 = "0" + b4
	}
	if len(b4) == 1 {
		b5 = "0" + b4
	}
	if len(b5) == 1 {
		b5 = "0" + b5
	}
	if len(b6) == 1 {
		b6 = "0" + b6
	}
	mac := strings.ToLower(b1 + ":" + b2 + ":" + b3 + ":" + b4 + ":" + b5 + ":" + b6)
	return mac, nil
}

// Mac2Int64 converts a string to a mac address
func Mac2Int64(s string) (int64, error) {
	s = strings.ToLower(strings.TrimSpace(s))

	m, err := net.ParseMAC(s)
	if err != nil {
		return 0, fmt.Errorf("mac address parse error > %w", err)
	}
	s = m.String()
	s = strings.Replace(s, ":", "", -1)
	var i int64
	i, err = strconv.ParseInt(s, 16, 64)
	if err != nil {
		return 0, fmt.Errorf("mac address trans to int64 error > %w", err)
	}
	if i == 0 {
		return 0, errors.New("MacIsZero error")
	}

	return i, nil
}
