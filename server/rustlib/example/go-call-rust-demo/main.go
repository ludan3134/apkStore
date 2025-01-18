package main

import (
	"fmt"

	"github.com/annadance/wst/internal/model/middle"

	"github.com/annadance/wst/rustlib"
)

func main() {
	mp := map[string]string{}
	mp["a"] = "1"
	mp["b"] = "2"
	mp["c"] = "3"

	mapToStr := middle.PayloadBuilder(mp)

	fmt.Println("map to string", mapToStr)

	enStr, err := rustlib.EncryptString(mapToStr)
	if err != nil {
		fmt.Println("encrypt error", err)
	} else {
		fmt.Println("encrypt from rust", enStr)
		deStr, er2 := rustlib.DecryptString("9W7Hc5wz65udDqHkT2XzPcxTLEgnW2UJtaqXADkucWbufB9AHv4LzrYMRqwNnkucHQ9iP7kmX7PjGVb94wQZikTZtYANwJ96kCWb3rFfQDYxyUuxc6Ha2UeXuSzpeE1FuSUGKE15kYVfjf43Nn5LP2X4VZXPZYQvMG6rPmBhCPgv5UeQaXLhMtCMxwR7btg6qAArkGYFXpGCRBTaR11eAfxiiNBTCZQ")
		if er2 == nil {
			fmt.Println("decrypt from rust", deStr)
		} else {
			fmt.Println("decrypt from rust", deStr, er2)

			map1, er1 := middle.ParsePayload(deStr)
			if er1 == nil {
				fmt.Println("parse from rust", map1)
			} else {
				fmt.Println("parse from rust", map1, er1)
			}

		}
	}
}
