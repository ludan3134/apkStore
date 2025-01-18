package rustlib

/*
#cgo CFLAGS: -Ilibcall_rust
#cgo LDFLAGS: -Llibcall_rust -lcall_rust
//#include "AAA_Crypt.h"
#include "bindings.h"
*/
import "C"

import (
	"errors"
	"unsafe"
)

func CallRustDemo(url string) string {
	msg := C.CString(url)
	out := C.hello(msg)
	// fmt.Println("response from rust", C.GoString(out))
	output := C.GoString(out)
	C.free(unsafe.Pointer(out))
	return output
}

func EncryptString(url string) (string, error) {
	msg := C.CString(url)
	out := C.a3encrypt(msg)
	output := C.GoString(out)
	C.free(unsafe.Pointer(out))
	if len(output) == 0 {
		return "", errors.New("encrypt error")
	}
	return output, nil
}

func DecryptString(url string) (string, error) {
	msg := C.CString(url)
	out := C.a3decrypt(msg)
	output := C.GoString(out)
	C.free(unsafe.Pointer(out))
	if len(output) == 0 {
		return "", errors.New("encrypt error")
	}
	return output, nil
}
