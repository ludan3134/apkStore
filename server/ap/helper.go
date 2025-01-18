// ap a package for go utils
package ap

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"strings"
	"time"
	"unsafe"
)

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

// GetCurrentPath  get current path of commend running
func GetCurrentPath() (string, error) {
	//	return filepath.Abs(filepath.Dir(os.Args[0]))
	return os.Getwd()
}

// GetCurrentExecDir get exec dir
func GetCurrentExecDir() (string, error) {
	// return os.Executable()
	path, err := exec.LookPath(os.Args[0])
	if err != nil {
		// fmt.Printf("exec.LookPath(%s), err: %s\n", os.Args[0], err)
		return "", err
	}
	absPath, err := filepath.Abs(path)
	if err != nil {
		// fmt.Printf("filepath.Abs(%s), err: %s\n", path, err)
		return "", err
	}

	return filepath.Dir(absPath), nil
}

// SubString  sub string
func SubString(str string, begin, length int) (substr string) {
	// 将字符串的转换成[]rune
	rs := []rune(str)
	lth := len(rs)

	// 简单的越界判断
	if begin < 0 {
		begin = 0
	}
	if begin >= lth {
		begin = lth
	}
	end := begin + length
	if end > lth {
		end = lth
	}

	// 返回子串
	return string(rs[begin:end])
}

// MeasureTime measure time
func MeasureTime(process string) func() {
	fmt.Printf("Start %s\n", process)
	start := time.Now()
	return func() {
		fmt.Printf("Time taken by %s is %v\n", process, time.Since(start))
	}
}

// toBytes performs unholy acts to avoid allocations
func toBytes(s string) []byte {
	return *(*[]byte)(unsafe.Pointer(&s))
}

// toString performs unholy acts to avoid allocations
func toString(b []byte) string {
	return *(*string)(unsafe.Pointer(&b))
}

// ---------------------------------------------
// rpcx method
// ---------------------------------------------

// SliceByteToString transfer byte to string
func SliceByteToString(b []byte) string {
	return *(*string)(unsafe.Pointer(&b))
}

// StringToSliceByte transfer string to byte
func StringToSliceByte(s string) []byte {
	x := (*[2]uintptr)(unsafe.Pointer(&s))
	h := [3]uintptr{x[0], x[1], x[1]}
	return *(*[]byte)(unsafe.Pointer(&h))
}
