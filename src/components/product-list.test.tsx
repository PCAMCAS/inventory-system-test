import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { ProductList } from "@/components/ProductList";
import { server } from "@/test/mocks/server";

describe("ProductList", () => {
  it("muestra un indicador de carga mientras fetchea", () => {
    render(<ProductList />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("muestra los productos recibidos de la API", async () => {
    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Tablero roble macizo 40 mm")).toBeInTheDocument();
      expect(screen.getByText("Bisagra cazoleta 35 mm")).toBeInTheDocument();
    });
  });

  it("muestra un estado de error con botón de reintento si falla la red", async () => {
    server.use(
      http.get("/api/products", () => {
        return HttpResponse.error();
      })
    );

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Error al cargar productos.")).toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
  });

  it("permite pulsar el botón de reintento", async () => {
    const user = userEvent.setup();

    server.use(
      http.get("/api/products", () => {
        return HttpResponse.error();
      })
    );

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Reintentar" }));

    await waitFor(() => {
      expect(screen.getByText("Error al cargar productos.")).toBeInTheDocument();
    });
  });
});
