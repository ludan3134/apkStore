package node

import (
	"fmt"
	"github.com/valyala/fasthttp"
)

type Code struct {
	Status   bool   `json:"status"`
	Code     int    `json:"code"`
	Message  string `json:"message"`
	HttpCode int    `json:"-"`
}

func makeCode(httpCode, code int, status bool, msg string) *Code {
	return &Code{
		Status:   status,
		Code:     code,
		Message:  msg,
		HttpCode: httpCode,
	}
}

func (c *Code) SetMsg(msg string) *Code {
	return &Code{
		Status:   c.Status,
		Code:     c.Code,
		Message:  msg,
		HttpCode: c.HttpCode,
	}
}

func ResponseReturn(ctx *fasthttp.RequestCtx, code *Code, data interface{}) {
	ctx.SetContentType(contentJSON)
	ctx.SetStatusCode(code.HttpCode)
	if data == nil {
		ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, code.Status, code.Code, code.Message, data)))
	} else {
		ctx.SetBody(S2B(fmt.Sprintf(`{"status": %v, "code": %d, "message": "%s", "data":%v}`, code.Status, code.Code, code.Message, data)))
	}
	return
}

var (
	Success        = makeCode(fasthttp.StatusOK, 0, true, "success")
	MethodError    = makeCode(fasthttp.StatusMethodNotAllowed, 400001, false, "method error")
	ParamsError    = makeCode(fasthttp.StatusBadRequest, 400002, false, "params error")
	NoData         = makeCode(fasthttp.StatusOK, 400003, true, "no data")
	QueryError     = makeCode(fasthttp.StatusBadRequest, 400004, false, "query error")
	AuthError      = makeCode(fasthttp.StatusUnauthorized, 400005, false, "auth error")
	FileError      = makeCode(fasthttp.StatusBadRequest, 400006, false, "file error")
	RangeError     = makeCode(fasthttp.StatusRequestedRangeNotSatisfiable, 400007, false, "range error")
	DePwdCodeError = makeCode(fasthttp.StatusBadRequest, 400008, false, "sign error")
	NoNeedToUpdate = makeCode(fasthttp.StatusOK, 400009, true, "no need to update")
	InternalError  = makeCode(fasthttp.StatusInternalServerError, 500000, false, "internal error")
	DomainError    = makeCode(fasthttp.StatusBadGateway, 500001, true, "domain error")
)
