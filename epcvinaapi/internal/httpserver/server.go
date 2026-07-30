package httpserver

import (
	"time"

	"epcvinaapi/internal/config"
	"epcvinaapi/internal/httpserver/handlers"

	"github.com/gofiber/fiber/v2"
	fibercors "github.com/gofiber/fiber/v2/middleware/cors"
	fiberlog "github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/jackc/pgx/v5/pgxpool"
)

func New(cfg config.Config, db *pgxpool.Pool) *fiber.App {
	app := fiber.New(fiber.Config{
		AppName:      "epcvinaapi",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	})

	app.Use(recover.New())
	app.Use(fiberlog.New())
	app.Use(fibercors.New(fibercors.Config{
		AllowOrigins: cfg.AllowedOrigin,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
	}))

	v1 := app.Group("/v1")
	api := app.Group("/api")

	v1.Get("/health", handlers.Health(cfg, db))
	v1.Get("/ready", handlers.Ready(db))
	v1.Get("/meta", handlers.Meta(cfg))

	api.Get("/health", handlers.Health(cfg, db))
	api.Get("/ready", handlers.Ready(db))
	api.Get("/meta", handlers.Meta(cfg))
	api.Get("/catalog", handlers.Catalog(db))
	api.Get("/combos", handlers.CombosList(db))
	api.Get("/combos/:id", handlers.ComboDetail(db))
	api.Get("/combos/:id/excel", handlers.ComboExcel(db))
	api.Get("/search/products", handlers.SearchProducts(db))
	api.Get("/search/suppliers", handlers.SearchSuppliers(db))
	api.Get("/search/customers", handlers.SearchCustomers(db))
	api.Get("/search/projects", handlers.SearchProjects(db))
	api.Get("/customers/slug-exists", handlers.CustomerSlugExists(db))
	api.Post("/uploads/images", handlers.UploadImage(cfg))
	api.Get("/customers", handlers.CustomersList(db))
	api.Post("/customers", handlers.CustomersCreate(db))
	api.Get("/customers/:id", handlers.CustomerDetail(db))
	api.Patch("/customers/:id", handlers.CustomerUpdate(db))
	api.Get("/projects", handlers.ProjectsList(db))
	api.Post("/projects", handlers.ProjectsCreate(db))
	api.Get("/projects/:id", handlers.ProjectDetail(db))
	api.Patch("/projects/:id", handlers.ProjectUpdate(db))
	api.Get("/suppliers", handlers.SuppliersList(db))
	api.Post("/suppliers", handlers.SuppliersCreate(db))
	api.Get("/suppliers/:id", handlers.SupplierDetail(db))
	api.Patch("/suppliers/:id", handlers.SupplierUpdate(db))
	api.Get("/products", handlers.ProductsList(db))
	api.Post("/products", handlers.ProductsCreate(db))
	api.Get("/products/:id", handlers.ProductDetail(db))
	api.Patch("/products/:id", handlers.ProductUpdate(db))
	api.Get("/orders", handlers.OrdersList(db))
	api.Post("/orders", handlers.OrdersCreate(db))
	api.Get("/orders/:id", handlers.OrderDetail(db))
	api.Patch("/orders/:id", handlers.OrderUpdate(db))

	v1.Get("/health", handlers.Health(cfg, db))

	return app
}
