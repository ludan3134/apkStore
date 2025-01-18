package front

import (
	"fmt"
	"io"
	"mime"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/annadance/a3/internal/config/fileserverconfig"

	"github.com/annadance/a3/ap"
	"github.com/annadance/a3/spaceflake"

	"github.com/spf13/afero"

	"github.com/tsingson/logger"
	"go.uber.org/zap"
)

const (
	FileNameTimeFormat = "2006-01-02-15"
	MaxUploadSize      = 10 << 22
)

type ReactStaticFileServices struct {
	cfg *fileserverconfig.FileServerConfig
	log *logger.Logger
}

func NewReactStaticFileServices(cfg *fileserverconfig.FileServerConfig, log *logger.Logger) *ReactStaticFileServices {
	return &ReactStaticFileServices{
		cfg: cfg,
		log: log,
	}
}

func (s *ReactStaticFileServices) UploadHandler(w http.ResponseWriter, r *http.Request) {
	log := s.log.Named("upload")

	log.Debug("--------------------- upload start -----------------------")
	defer log.Debug("--------------------- upload end -----------------------")
	//
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	//
	if err := r.ParseForm(); err != nil {
		_, _ = fmt.Fprintf(w, "ParseForm() err: %v", err)
		return
	}
	// fmt.Fprintf(w, "Post from website! r.PostFrom = %v\n", r.PostForm)
	inputType := r.FormValue("type")
	inputId := r.FormValue("id")
	// fmt.Fprintf(w, "type = %s\n", inputType)
	// fmt.Fprintf(w, "id = %s\n", inputId)
	log.Debug("upload", zap.String("type", inputType), zap.String("id", inputId))
	//
	if r.ContentLength > MaxUploadSize {
		http.Error(w, "The uploaded image is too big. Please use an image less than 1MB in size", http.StatusBadRequest)
		return
	}
	// Parse our multipart form, 10 << 20 specifies a maximum
	// upload of 10 MB files.
	// r.ParseMultipartForm(10 << 20)
	// FormFile returns the first file for the given key `myFile`
	// it also returns the FileHeader so we can get the Filename,
	// the Header and the size of the file
	src, fh, err := r.FormFile("file")
	if err != nil {
		log.Error("Error Retrieving the File", zap.Error(err))
		_, _ = fmt.Fprintf(w, "error retrive the file %s", err)
		return
	}
	defer func() {
		_ = src.Close()
	}()
	filename := fh.Filename
	log.Debug("Uploaded File", zap.String("filename", filename), zap.Int64("size", fh.Size))
	// fmt.Printf("MIME Header: %+v\n", fh.Header)

	dataTimeStr := time.Now().Format(FileNameTimeFormat)
	afs := afero.NewOsFs()

	imgUri := ap.StrBuilder(s.cfg.StorageBaseURI, "/vod/images/", dataTimeStr, "/")

	ext := filepath.Ext(filepath.Base(fh.Filename))
	//
	node := spaceflake.NewNode(1)
	worker := node.NewWorker()
	sf, _ := worker.GenerateSpaceflake()
	fileSaveName := sf.StringID()

	mediaURL := ap.StrBuilder(imgUri, fileSaveName, ext)
	imageFullFilename := ap.StrBuilder(s.cfg.StaticFullPath, mediaURL)
	log.Debug("====== upload file ======",
		zap.String("full", imageFullFilename),
		zap.String("mediaURL", mediaURL))
	check, _ := afero.DirExists(afs, filepath.Dir(imageFullFilename))
	if !check {
		er1 := afs.MkdirAll(filepath.Dir(imageFullFilename), 0o755)
		if er1 != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	dst, er1 := os.OpenFile(imageFullFilename, os.O_RDWR|os.O_CREATE|os.O_EXCL, 0o600)
	if er1 != nil {
		log.Error("Error Retrieving the File", zap.Error(er1))
	}
	defer func() {
		_ = dst.Close()
	}()

	// read all of the contents of our uploaded file into a
	// byte array
	// fileBytes, err := ioutil.ReadAll(src )
	// if err != nil {
	// 	log.Error("Error Retrieving the File", zap.Error(err))
	// }
	// // write this byte array tryto our temporary file
	// dst .Write(fileBytes)
	_, err = io.Copy(dst, src)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// return that we have successfully uploaded our file!
	log.Debug("upload success")
	_, err = fmt.Fprintf(w, mediaURL)
	if err != nil {
		log.Error("Error Retrieving the File", zap.Error(err))
	}
}

func (s *ReactStaticFileServices) HandleImages(w http.ResponseWriter, r *http.Request) {
	log := s.log.Named("HandleImages")
	log.Debug("--------------------- HandleImages start -----------------------")
	defer log.Debug("--------------------- HandleImages end -----------------------")
	if r.Method != "GET" {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	path := filepath.Clean(r.URL.Path)

	// path = strings.TrimPrefix(path, "/")
	full := ap.StrBuilder(s.cfg.StaticFullPath, path)
	log.Debug("file", zap.String("full", full))
	file, err := os.Open(full)
	if err != nil {
		if os.IsNotExist(err) {
			log.Error("file", zap.String("full", full), zap.Error(err))
			http.NotFound(w, r)
			return
		}
		log.Error("file", zap.String("full", full), zap.Error(err))
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
	log.Debug("file", zap.String("full", full), zap.Int64("size", n))
}
