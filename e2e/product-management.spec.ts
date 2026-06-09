import { expect, test } from "@playwright/test";

test.describe("Inventario", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("añadir un nuevo producto aparece en la lista", async ({ page }) => {
    const productName = `Test-Lasur exterior ${Date.now()}`;

    await page.getByPlaceholder("Nombre").fill(productName);
    await page.getByPlaceholder("Precio").fill("24.9");
    await page.getByPlaceholder("Stock").fill("8");
    await page.getByRole("button", { name: "Crear producto" }).click();

    await expect(page.getByText(productName)).toBeVisible();
    await expect(page.getByText("24.90 €")).toBeVisible();
  });

  test("filtrar por categoría muestra productos de esa categoría", async ({ page }) => {
    await page.locator("select").selectOption({ label: "Electrónica" });

    await expect(page.getByText("Teclado mecánico")).toBeVisible();
    await expect(page.getByText("Cuaderno A4")).not.toBeVisible();
  });

  test("ajustar stock con el botón + incrementa el número visible", async ({ page }) => {
    const card = page.locator("article").filter({ hasText: "Teclado mecánico" }).first();
    const stockText = await card.getByText(/Stock:/).textContent();
    const initialStock = Number(stockText?.replace("Stock:", "").trim());

    await card.getByRole("button", { name: "+" }).click();
    await card.getByRole("button", { name: "+" }).click();

    await expect(card.getByText(`Stock: ${initialStock + 2}`)).toBeVisible();
  });
});
