import { HttpInterceptorFn } from '@angular/common/http';

export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.url.endsWith('/api/reservas') && req.method === 'POST') {

    // Prueba visible sin consola
    alert("📩 Backend falso SÍ recibió la reserva");

    const respuesta = {
      ok: true,
      message: 'Reserva guardada correctamente',
      data: req.body
    };

    return new Response(JSON.stringify(respuesta), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }) as any;
  }

  return next(req);
};
