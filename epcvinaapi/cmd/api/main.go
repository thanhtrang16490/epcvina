package main

import (
	"log"

	"epcvinaapi/internal/config"
	"epcvinaapi/internal/database"
	"epcvinaapi/internal/httpserver"
)

func main() {
	cfg := config.Load()

	db, err := database.NewPostgres(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}
	defer db.Close()

	app := httpserver.New(cfg, db)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("server stopped: %v", err)
	}
}
