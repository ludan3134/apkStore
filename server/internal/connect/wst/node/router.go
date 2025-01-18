package node

func (s *Node) setRouter() {
	s.router.POST("/QueryApps", recovery(s.QueryApps()))                         //portType 盒子ott 电视机tv
	s.router.POST("/GetAppsCategories", recovery(s.GetAppsCategories()))         //portType 盒子ott 电视机tv
	s.router.POST("/GetAppsByCategories", recovery(s.GetAppsByCategories()))     //portType 盒子ott 电视机tv
	s.router.POST("/GetAppsForPushDesktop", recovery(s.GetAppsForPushDesktop())) //portType 盒子ott 电视机tv
	s.router.POST("/GetAppsByClass", recovery(s.GetAppsByClass()))               //portType 盒子ott 电视机tv
	s.router.POST("/ImportAppUser", recovery(s.importAppUserHandler()))          //portType 盒子ott 电视机tv

	s.router.POST("/QueryAppsNewestVersion", recovery(s.QueryAppsNewestVersion())) //portType 盒子ott 电视机tv
	s.router.POST("/UpdateSelf", recovery(s.UpdateSelf()))                         //portType 盒子ott 电视机tv

	s.router.POST("/Login", recovery(s.Login()))                         //portType 盒子ott 电视机tv
	s.router.POST("/GetAppDownloadUrl", recovery(s.GetAppDownloadUrl())) //portType 盒子ott 电视机tv
	s.router.GET("/downloadFile/{filePath}", recovery(s.downloadFile())) //portType 盒子ott 电视机tv
}
