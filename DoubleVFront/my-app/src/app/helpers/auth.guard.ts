import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);
    
  if (!usuarioService.IsAuthenticated()) {
    // Redirigir al login si no está autenticado
    return router.createUrlTree(['/login']);
  }  
  
  // ExpectedRole sea siempre un array
  const expectedRoles: string[] = Array.isArray(route.data['expectedRole'])
    ? route.data['expectedRole']
    : [route.data['expectedRole']];
  const userRole = usuarioService.ObtenerRol().trim().toLowerCase();
  
  if (expectedRoles.map(role => role.toLowerCase()).includes(userRole)) {
    // Permitir acceso
    return true; 
  } else {
    // Redirigir a una página de acceso denegado si no tiene el rol requerido
    return router.createUrlTree(['/access-denied']);
  }
};
