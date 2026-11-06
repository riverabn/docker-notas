import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

type Nota = { id: number; titulo: string; contenido: string | null };

async function obtenerNotas(): Promise<Nota[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/notas`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function crearNota(formData: FormData) {
  "use server";
  await fetch(`${process.env.API_URL}/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      titulo: formData.get("titulo"),
      contenido: formData.get("contenido"),
    }),
  });
  revalidatePath("/");
}

async function borrarNota(formData: FormData) {
  "use server";
  await fetch(`${process.env.API_URL}/notas/${formData.get("id")}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  revalidatePath("/");
}

export default async function Home() {
  const notas = await obtenerNotas();

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1>📝 Mis Notas</h1>

      <form action={crearNota} style={{ display: "grid", gap: 8, margin: "24px 0" }}>
        <input name="titulo" placeholder="Título" required maxLength={100} />
        <textarea name="contenido" placeholder="Contenido (opcional)" maxLength={500} />
        <button type="submit">Agregar nota</button>
      </form>

      {notas.length === 0 && <p>No hay notas todavía.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notas.map((n) => (
          <li key={n.id} style={{ border: "1px solid #888", borderRadius: 8, padding: 12, marginBottom: 8 }}>
            <strong>{n.titulo}</strong>
            <p>{n.contenido}</p>
            <form action={borrarNota}>
              <input type="hidden" name="id" value={n.id} />
              <button type="submit">Borrar</button>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}