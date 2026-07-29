package handlers

import (
	"epcvinaapi/internal/config"

	"github.com/gofiber/fiber/v2"
)

func Meta(cfg config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"name": "epcvinaapi",
			"env":  cfg.Env,
			"v":    "1.0.0",
		})
	}
}
