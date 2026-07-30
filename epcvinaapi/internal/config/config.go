package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Env           string
	Port          string
	DatabaseURL   string
	AllowedOrigin string
	StorageProvider string
	MinioEndpoint   string
	MinioAccessKey  string
	MinioSecretKey  string
	MinioBucket     string
	MinioPublicURL  string
}

func Load() Config {
	_ = godotenv.Load()

	return Config{
		Env:             getEnv("APP_ENV", "development"),
		Port:            getEnv("PORT", "8080"),
		DatabaseURL:     getEnv("DATABASE_URL", "postgres://epcvina:epcvina@localhost:5432/epcvina?sslmode=disable"),
		AllowedOrigin:   getEnv("ALLOWED_ORIGIN", "*"),
		StorageProvider: getEnv("STORAGE_PROVIDER", "local"),
		MinioEndpoint:   getEnv("MINIO_ENDPOINT", "http://localhost:9000"),
		MinioAccessKey:  getEnv("MINIO_ACCESS_KEY", "epcvina"),
		MinioSecretKey:  getEnv("MINIO_SECRET_KEY", "epcvina123"),
		MinioBucket:     getEnv("MINIO_BUCKET", "epcvina-images"),
		MinioPublicURL:  getEnv("MINIO_PUBLIC_URL", "http://localhost:9000"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
