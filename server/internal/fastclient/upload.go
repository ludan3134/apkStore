package fastclient

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path"

	"github.com/valyala/fasthttp"
)

// Upload upload
func (s *FastClient) Upload(url, uploadFile, field, tid string) ([]byte, error) {
	// 新建一个缓冲，用于存放文件内容
	byteBuffer := &bytes.Buffer{}
	// 创建一个multipart文件写入器，方便按照http规定格式写入内容
	bodyWriter := multipart.NewWriter(byteBuffer)
	// 从bodyWriter生成fileWriter,并将文件内容写入fileWriter,多个文件可进行多次
	fileWriter, err := bodyWriter.CreateFormFile(field, path.Base(uploadFile)) // "file"
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}
	file, er1 := os.Open(uploadFile)
	if er1 != nil {
		fmt.Println(er1)
		return nil, er1
	}
	// 不要忘记关闭打开的文件
	defer func() {
		_ = file.Close()
	}()
	_, err = io.Copy(fileWriter, file)
	if err != nil {
		return nil, err
	}

	// 关闭bodyWriter停止写入数据
	_ = bodyWriter.Close()
	contentType := bodyWriter.FormDataContentType()

	s.Req.Header.SetContentType(contentType)
	// 直接将构建好的数据放入post的body中
	s.Req.SetBody(byteBuffer.Bytes())
	s.Req.Header.SetMethod("POST")
	s.Req.Header.Set("tid", tid)
	s.Req.Header.Set("sid", tid)
	s.Req.SetRequestURI(url)

	err = s.Client.DoTimeout(s.Req, s.Rsp, s.ttl)
	if err != nil {
		return nil, err
	}
	if s.Rsp.StatusCode() != fasthttp.StatusOK {
		return nil, errors.New("upload fail")
	}
	return s.Rsp.Body(), nil
}
