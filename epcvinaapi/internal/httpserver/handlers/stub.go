package handlers

import (
	"database/sql"
	"encoding/json"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
)

func stubList(kind string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"items": []fiber.Map{},
			"kind":  kind,
			"meta": fiber.Map{
				"count": 0,
			},
		})
	}
}

func stubDetail(kind string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"item": fiber.Map{
				"id":   c.Params("id"),
				"kind": kind,
			},
		})
	}
}

func stubCreate(kind string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		body := c.Body()
		var payload map[string]any
		_ = json.Unmarshal(body, &payload)
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"ok":   true,
			"kind": kind,
			"item": payload,
		})
	}
}

func stubUpdate(kind string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		body := c.Body()
		var payload map[string]any
		_ = json.Unmarshal(body, &payload)
		return c.JSON(fiber.Map{
			"ok":   true,
			"kind": kind,
			"id":   c.Params("id"),
			"item": payload,
		})
	}
}

func searchStub(kind string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		q := strings.TrimSpace(c.Query("q"))
		var items []fiber.Map
		if q != "" {
			items = []fiber.Map{
				{"id": "stub-1", "label": q, "meta": kind},
			}
		}
		return c.JSON(fiber.Map{
			"items": items,
			"kind":  kind,
		})
	}
}

func Catalog(_ *pgxpool.Pool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"ok": true,
			"data": fiber.Map{
				"products":  0,
				"combos":    0,
				"customers": 0,
				"projects":  0,
				"suppliers": 0,
				"updatedAt": time.Now().UTC(),
			},
		})
	}
}

func CombosList(_ *pgxpool.Pool) fiber.Handler  { return stubList("combos") }
func ComboDetail(_ *pgxpool.Pool) fiber.Handler { return stubDetail("combo") }
func ComboExcel(_ *pgxpool.Pool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.SendString("combo excel export stub")
	}
}
func SearchProducts(_ *pgxpool.Pool) fiber.Handler  { return searchStub("products") }
func SearchSuppliers(_ *pgxpool.Pool) fiber.Handler { return searchStub("suppliers") }
func SearchCustomers(_ *pgxpool.Pool) fiber.Handler { return searchStub("customers") }
func SearchProjects(_ *pgxpool.Pool) fiber.Handler  { return searchStub("projects") }
func CustomerSlugExists(_ *pgxpool.Pool) fiber.Handler {
	return func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"exists": false, "slug": c.Query("slug")})
	}
}

func CustomersList(_ *pgxpool.Pool) fiber.Handler   { return stubList("customers") }
func CustomersCreate(_ *pgxpool.Pool) fiber.Handler { return stubCreate("customers") }
func CustomerDetail(_ *pgxpool.Pool) fiber.Handler  { return stubDetail("customer") }
func CustomerUpdate(_ *pgxpool.Pool) fiber.Handler  { return stubUpdate("customer") }
func ProjectsList(_ *pgxpool.Pool) fiber.Handler    { return stubList("projects") }
func ProjectsCreate(_ *pgxpool.Pool) fiber.Handler  { return stubCreate("projects") }
func ProjectDetail(_ *pgxpool.Pool) fiber.Handler   { return stubDetail("project") }
func ProjectUpdate(_ *pgxpool.Pool) fiber.Handler   { return stubUpdate("project") }
func SuppliersList(_ *pgxpool.Pool) fiber.Handler   { return stubList("suppliers") }
func SuppliersCreate(_ *pgxpool.Pool) fiber.Handler { return stubCreate("suppliers") }
func SupplierDetail(_ *pgxpool.Pool) fiber.Handler  { return stubDetail("supplier") }
func SupplierUpdate(_ *pgxpool.Pool) fiber.Handler  { return stubUpdate("supplier") }
func ProductsList(_ *pgxpool.Pool) fiber.Handler    { return stubList("products") }
func ProductsCreate(_ *pgxpool.Pool) fiber.Handler  { return stubCreate("products") }
func ProductDetail(_ *pgxpool.Pool) fiber.Handler   { return stubDetail("product") }
func ProductUpdate(_ *pgxpool.Pool) fiber.Handler   { return stubUpdate("product") }
func OrdersList(_ *pgxpool.Pool) fiber.Handler      { return stubList("orders") }
func OrdersCreate(_ *pgxpool.Pool) fiber.Handler    { return stubCreate("orders") }
func OrderDetail(_ *pgxpool.Pool) fiber.Handler     { return stubDetail("order") }
func OrderUpdate(_ *pgxpool.Pool) fiber.Handler     { return stubUpdate("order") }

// keep sql import used for future typed rows
var _ = sql.ErrNoRows
