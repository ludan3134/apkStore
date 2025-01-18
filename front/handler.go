package front

import (
	"fmt"
	"io"
	"io/fs"
	"log"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"go.uber.org/zap"
)

var uiFS fs.FS

func init() {
	var err error
	uiFS, err = fs.Sub(UI, "build")
	if err != nil {
		log.Fatal("failed tryto get ui fs", err)
	}
}

func (s *ReactStaticFileServices) HandleStatic(w http.ResponseWriter, r *http.Request) {
	logg := s.log.Named("HandleStatic")
	logg.Debug("--------------------- HandleStatic start -----------------------")
	defer logg.Debug("--------------------- HandleStatic end -----------------------")
	if r.Method != "GET" {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}
	path := filepath.Clean(r.URL.Path)
	check := strings.HasPrefix(path, "/ux/images")
	check1 := strings.HasPrefix(path, "/vkimages")
	if check || check1 {
		s.HandleImages(w, r)
		return
	}

	if path == "/" || path == "/index.html" || strings.HasPrefix(path, "/aaa") || strings.HasPrefix(path, "/live") || strings.HasPrefix(path, "/movie") || strings.HasPrefix(path, "/config") || strings.HasPrefix(path, "/auth") { // Add other paths that you route on the UI-side here
		path = "/index.html"
	}

	s.staticHandler(w, r, path, logg)
}

func (s *ReactStaticFileServices) staticHandler(w http.ResponseWriter, r *http.Request, path string, logg *zap.Logger) {
	static := strings.TrimPrefix(path, "/")

	file, err := uiFS.Open(static)
	if err != nil {
		if os.IsNotExist(err) {
			logg.Error("file", zap.String("full path", path), zap.Error(err))
			http.NotFound(w, r)
			return
		}
		logg.Error("file", zap.String("full path", path), zap.Error(err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}

	contentType := mime.TypeByExtension(filepath.Ext(path))
	w.Header().Set("Content-Type", contentType)
	if strings.HasPrefix(path, "static/") {
		w.Header().Set("Cache-Control", "public, max-age=31536000")
	}
	stat, err := file.Stat()
	if err == nil && stat.Size() > 0 {
		w.Header().Set("Content-Length", fmt.Sprintf("%d", stat.Size()))
	}

	n, _ := io.Copy(w, file)
	logg.Debug("file", zap.String("full path", path), zap.Int64("size", n))
}
