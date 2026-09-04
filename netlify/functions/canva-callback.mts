export default async (request: Request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  const errorDescription = url.searchParams.get('error_description');

  const headers = {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
  };

  if (error) {
    return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ZUME | Canva</title><body style="font-family:Arial,sans-serif;max-width:680px;margin:64px auto;padding:0 24px"><h1>No se pudo autorizar Canva</h1><p>${escapeHtml(errorDescription || error)}</p><p>Podés cerrar esta pestaña y volver a ZUME.</p></body></html>`, { status: 400, headers });
  }

  if (code) {
    return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ZUME | Canva</title><body style="font-family:Arial,sans-serif;max-width:680px;margin:64px auto;padding:0 24px"><h1>Canva autorizó ZUME</h1><p>La redirección OAuth llegó correctamente al sitio.</p><p>Podés cerrar esta pestaña.</p></body></html>`, { status: 200, headers });
  }

  return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ZUME | Canva</title><body style="font-family:Arial,sans-serif;max-width:680px;margin:64px auto;padding:0 24px"><h1>Canva callback listo</h1><p>Este endpoint de ZUME está activo y preparado para recibir la redirección de Canva.</p></body></html>`, { status: 200, headers });
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  }[char] || char));
}
