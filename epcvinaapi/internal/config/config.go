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
}

func Load() Config {
	_ = godotenv.Load()

	return Config{
		Env:           getEnv("APP_ENV", "development"),
		Port:          getEnv("PORT", "8080"),
		DatabaseURL:   getEnv("DATABASE_URL", "postgres://epcvina:epcvina@localhost:5432/epcvina?sslmode=disable"),
		AllowedOrigin: getEnv("ALLOWED_ORIGIN", "*"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
