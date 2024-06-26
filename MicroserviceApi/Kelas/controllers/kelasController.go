package controllers

import (
	"kelas/database"
	"kelas/models"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetAllKelas(c *fiber.Ctx) error {
	db := database.DB
	var kelas []models.Kelas
	db.Find(&kelas)
	if len(kelas) == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No class found",
		})
	}
	return c.JSON(kelas)
}
func GetKelasById(c *fiber.Ctx) error {
	db := database.DB
	var kelas models.Kelas
	id := c.Params("id")

	today := time.Now().Format("2006-01-02")

	db.Preload("Rosters").Find(&kelas, id)
	db.Preload("Users").Find(&kelas, id)
	db.Preload("Users.Absensis", "DATE(tanggal) = DATE(?)", today).Find(&kelas, id)
	if kelas.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No class found with given ID",
		})
	}
	return c.JSON(kelas)
}

func CreateKelas(c *fiber.Ctx) error {
	db := database.DB
	kelas := new(models.Kelas)

	if err := c.BodyParser(kelas); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Cannot parse JSON",
		})
	}

	db.Create(&kelas)
	return c.JSON(kelas)
}

func UpdateKelas(c *fiber.Ctx) error {
	db := database.DB
	id := c.Params("id")

	var kelas models.Kelas
	db.Find(&kelas, id)

	if kelas.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No class found with given ID",
		})
	}

	if err := c.BodyParser(&kelas); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Cannot parse JSON",
		})
	}

	db.Save(&kelas)
	return c.JSON(kelas)
}

func DeleteKelas(c *fiber.Ctx) error {
	db := database.DB
	id := c.Params("id")

	var kelas models.Kelas
	db.Find(&kelas, id)

	if kelas.ID == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No class found with given ID",
		})
	}

	db.Delete(&kelas)
	return c.JSON(fiber.Map{
		"message": "Class deleted successfully",
	})
}
