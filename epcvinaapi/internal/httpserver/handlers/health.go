package handlers

import (
	"context"
	"time"

	"epcvinaapi/internal/config"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Health(cfg config.Config, db *pgxpool.Pool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		status := "ok"
		dbStatus := "up"
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		if db == nil {
			dbStatus = "down"
		} else if err := db.Ping(ctx); err != nil {
			dbStatus = "down"
			status = "degraded"
		}

		return c.JSON(fiber.Map{
			"status": status,
			"env":    cfg.Env,
			"db":     dbStatus,
			"ts":     time.Now().UTC(),
		})
	}
}

func Ready(db *pgxpool.Pool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
		defer cancel()
		if db == nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"ready": false})
		}
		if err := db.Ping(ctx); err != nil {
			return c.Status(fiber.StatusServiceUnavailable).JSON(fiber.Map{"ready": false})
		}
		return c.JSON(fiber.Map{"ready": true})
	}
}
