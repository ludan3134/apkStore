package ap

import (
	"fmt"
	"net"
	"testing"
)

func TestGetPublicIP(t *testing.T) {
	ip, err := GetPublicIP()
	if err != nil {
		t.Error(err)
	}
	fmt.Println(ip)
}

func TestGetNetMeta(t *testing.T) {
	var err error
	var ipaddr string
	var ip64 int64
	ipaddr, ip64, err = GetNetMeta()
	if err != nil {
		fmt.Println("GetNetMeta", err)
	} else {
		fmt.Println("ip address: ", ipaddr, " ip64: ", ip64)
	}
}

func TestGetLocalIP(t *testing.T) {
	add, _ := GetLocalIP()
	for _, a := range add {
		fmt.Println(a)
	}
	// 172.19.208.108
	// 172.19.198.50
}

func TestGetOutboundIP(t *testing.T) {
	ip, _ := GetOutboundIP()
	fmt.Println(ip)
	// 172.19.198.50
}

func TestGetExternalIP(t *testing.T) {
	ip, _ := GetPublicIP()
	fmt.Println(ip)
	// 69.172.92.94
}

func TestMac2Int64(t *testing.T) {
	m1 := "9c:f8:db:07:ee:aa"
	m2 := "68:4e:05:be:33:fd"
	i, err := Mac2Int64(m1)
	if err != nil {
		fmt.Println("m1 ", err)
	} else {
		fmt.Println("m1 ", i)
	}
	i, err = Mac2Int64(m2)
	if err != nil {
		fmt.Println("m2 ", err)
	} else {
		fmt.Println("m2 ", i)
	}
	m := "ff:ff:ff:ff:ff:ff" //  "B4:4B:D6:91:50:AB" //  "b4:4b:d6:91:50:ab"
	i, err = Mac2Int64(m)
	if err != nil {
		// err1 := fmt.Errorf(" Error1 is  %w", err)
		// err2 := fmt.Errorf(" Error2 is %w", err1)
		// if errors.As(err1, ErrorMacParse) {
		//	fmt.Println("ErrorMacParse")
		//	fmt.Println("err1    ", err1)
		//	fmt.Println("err2    ", err2)
		//	fmt.Println("get err1 in err2 > ", errors.Unwrap(err2))
		//
		// } else if errors.Is(err, ErrorMacParse) {
		//	fmt.Println("ErrorMacParse")
		// } else if errors.Is(err, ErrorMacIsZero) {
		//	fmt.Println("ErrorMacIsZero")
		// } else if errors.Is(err, ErrorMacIsFull) {
		//	fmt.Println("ErrorMacIsFull")
		// } else {
		//	fmt.Println("other error")
		// }
		fmt.Println(err)
		// t.Error(err)
	}
	if err == nil {
		fmt.Println(i, "\t", 11553498439924)
		p, _ := Int64ToMac(i)

		fmt.Println(p, "\t", m)

	}
}

func TestIPStringToInt(t *testing.T) {
	ip := "113.87.182.147"
	i, err := IPStringToInt(ip)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(i)
	}
}

func TestIp2Int32(t *testing.T) {
	ipDecimal := IP4toInt(net.ParseIP("113.87.182.147"))
	fmt.Println(ipDecimal)
}
