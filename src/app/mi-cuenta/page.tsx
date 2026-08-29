import { redirect } from "next/navigation";

/** Ruta antigua: el área de cliente ahora vive en `/cuenta`. */
export default function LegacyMiCuentaRedirect() {
  redirect("/cuenta/compras");
}
