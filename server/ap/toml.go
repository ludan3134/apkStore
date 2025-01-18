package ap

import (
	"bytes"
	"io/ioutil"
	"path/filepath"

	"github.com/BurntSushi/toml"
	"github.com/spf13/afero"
)

// SaveTOML  save interface to TOML file
func SaveTOML(v interface{}, filename string) error {
	var b bytes.Buffer
	e := toml.NewEncoder(&b)
	err := e.Encode(v)
	if err != nil {
		return err
	}
	err = WriteToFile(b.Bytes(), filename)
	return err
}

// WriteToFile  write []byte to file
func WriteToFile(c []byte, filename string) error {
	// 将指定内容写入到文件中
	dir, _ := filepath.Split(filename)
	afs := afero.NewOsFs()

	check, _ := afero.DirExists(afs, dir)
	if !check {
		er1 := afs.MkdirAll(dir, 0o755)
		if er1 != nil {
			return er1
		}
	}
	return ioutil.WriteFile(filename, c, 0o666)
}
