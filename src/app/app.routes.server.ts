import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'laboratorios', renderMode: RenderMode.Prerender },

  // Todo lo demás (incluye :id)
  { path: '**', renderMode: RenderMode.Server },
];
