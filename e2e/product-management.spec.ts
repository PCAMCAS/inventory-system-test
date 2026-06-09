import { expect, test } from "@playwright/test";

test.describe("Inventario", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
    await expect(page.getByText("Teclado mecánico")).toBeVisible();
  });

  test("añadir un nuevo producto aparece en la lista", async ({ page }) => {
    const productName = `Test-Lasur exterior ${Date.now()}`;

    await page.getByPlaceholder("Nombre").fill(productName);
    await page.getByPlaceholder("Precio").fill("24.9");
    await page.getByPlaceholder("Stock").fill("8");
    await page.getByRole("button", { name: "Crear producto" }).click();

    await expect(page.getByText(productName)).toBeVisible();
  });

  test("filtrar por categoría muestra productos de esa categoría", async ({ page }) => {
    await page.locator("select").selectOption("cat-electronica");

    await expect(page.getByText("Teclado mecánico")).toBeVisible();
    await expect(page.getByText("Ratón inalámbrico")).toBeVisible();
    await expect(page.getByText("Cuaderno A4")).not.toBeVisible();
  });

  test("ajustar stock con el botón + permite interactuar con el control de stock", async ({ page }) => {
    const product = page.locator("article").filter({ hasText: "Teclado mecánico" }).first();

    await expect(product).toBeVisible();
    await expect(product.getByText(/Stock/i).first()).toBeVisible();

    const plusButton = product.getByRole("button", { name: "+" }).first();

    await expect(plusButton).toBeVisible();
    await plusButton.click();
    await plusButton.click();

    await expect(product.getByText(/Stock/i).first()).toBeVisible();
  });
});
