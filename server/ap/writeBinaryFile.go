package ap

import (
	"fmt"
	"os"

	"github.com/tsingson/logger"
	"go.uber.org/zap"
)

func WriteBinFile(saveFile string, buf []byte, log *logger.ZapLogger) error {
	f, err := os.Create(saveFile)
	if err != nil {
		fmt.Println(err)
		return err
	}

	l, err := f.Write(buf)
	if err != nil {
		log.Error("write error: ", zap.Error(err))
		_ = f.Close()
		return err
	}
	log.Debug("write length: ", l)
	err = f.Close()
	if err != nil {
		log.Error("close error: ", zap.Error(err))
		return err
	}
	return nil
}
