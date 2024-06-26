package main

import (
	"Authn/database"
	"Authn/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	database.Connect()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
		AllowOrigins:     "*",
	}))

	// Setup user routes
	routes.Setup(app)

	// Setup admin routes
	routes.SetupAdmin(app)

	app.Listen(":3001")
}
