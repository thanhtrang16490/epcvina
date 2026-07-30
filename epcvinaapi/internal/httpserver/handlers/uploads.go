package handlers

import (
	"context"
	"time"

	"epcvinaapi/internal/config"
	"epcvinaapi/internal/storage"

	"github.com/gofiber/fiber/v2"
)

func UploadImage(cfg config.Config) fiber.Handler {
	store, err := storage.NewMinIO(cfg.MinioEndpoint, cfg.MinioAccessKey, cfg.MinioSecretKey, cfg.MinioBucket, cfg.MinioPublicURL)
	if err != nil {
		return func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"ok":    false,
				"error": err.Error(),
			})
		}
	}

	_ = store.EnsureBucket(context.Background())

	return func(c *fiber.Ctx) error {
		file, err := c.FormFile("file")
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"ok":    false,
				"error": "missing file",
			})
		}

		folder := c.FormValue("folder", "images")
		objectName, publicURL, err := store.UploadImage(context.Background(), file, folder)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"ok":    false,
				"error": err.Error(),
			})
		}

		return c.JSON(fiber.Map{
			"ok": true,
			"data": fiber.Map{
				"bucket":      cfg.MinioBucket,
				"object_name": objectName,
				"url":         publicURL,
				"uploaded_at": time.Now().UTC().Format(time.RFC3339),
			},
		})
	}
}
