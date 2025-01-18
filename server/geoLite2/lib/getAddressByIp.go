package lib

import (
	"fmt"
	"github.com/oschwald/geoip2-golang"
	"net"
)

func GetAddressByIP(ipA string) string {
	fmt.Println("当前ip：", ipA)
	db, err := geoip2.Open("/home/wst/wnv/src/GeoLite2-ASN.mmdb")
	if err != nil {
		fmt.Println("err", err)
	}
	defer db.Close()
	// If you are using strings that may be invalid, check that ip is not nil
	ip := net.ParseIP(ipA)

	record, err := db.ASN(ip)
	if err != nil {
		fmt.Println("err2", err)
	}

	db1, err := geoip2.Open("/home/wst/wnv/src/GeoLite2-City.mmdb")
	if err != nil {
		fmt.Println("err", err)
	}
	defer db1.Close()
	// If you are using strings that may be invalid, check that ip is not nil
	//ip1 := net.ParseIP(ipA)

	record1, err := db1.City(ip)
	if err != nil {
		fmt.Println("err2", err)
	}

	//fmt.Println(string(bin))
	var province string
	if len(record1.Subdivisions) > 0 {
		province = record1.Subdivisions[0].Names["zh-CN"]
	}
	//return record.Country.Names["zh-CN"] + "-" + province + "-" + record.City.Names["zh-CN"]
	return record.AutonomousSystemOrganization + "-" + record1.Country.Names["zh-CN"] + "-" + province + "-" + record1.City.Names["zh-CN"]

}
