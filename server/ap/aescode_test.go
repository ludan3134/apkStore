package ap

import (
	"github.com/annadance/wst/ap"
	"testing"
)

func TestEnPwdCode(t *testing.T) {
	//expect := 5

	pwd, err := ap.EnPwdCode([]byte("123456"), []byte("8jh4jd82e92is0iw"))
	t.Log("pwd:", pwd)
	t.Log("err:", err)

	aa, err := ap.DePwdCode(pwd, []byte("8jh4jd82e92is0iw"))
	t.Log("pwd:", string(aa))
	t.Log("err:", err)
}
