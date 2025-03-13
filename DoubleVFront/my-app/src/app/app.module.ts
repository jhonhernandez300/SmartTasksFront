import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrearTareaComponent } from './componentes/tareas/crear-tarea/crear-tarea.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ObtenerTodosComponent } from './componentes/usuarios/obtener-todos/obtener-todos.component';
import { GuardarUsuarioComponent } from './componentes/usuarios/guardar-usuario/guardar-usuario.component';
import { ConfirmDialogComponent } from './componentes/general/confirm-dialog/confirm-dialog.component';
import { CloseDialogComponent } from './componentes/general/close-dialog/close-dialog.component';
import { ObtenerTodasTareasComponent } from './componentes/tareas/obtener-todas-tareas/obtener-todas-tareas.component';
import { MenuComponent } from './componentes/general/menu/menu.component';
import { ActualizarTareaComponent } from './componentes/tareas/actualizar-tarea/actualizar-tarea.component';
import { LoginComponent } from './componentes/general/login/login.component';
import { AuthInterceptorService } from '../app/servicios/auth-interceptor.service';
import { AccessDeniedComponent } from './componentes/general/access-denied/access-denied.component';
import { ActualizarUsuarioComponent } from './componentes/usuarios/actualizar-usuario/actualizar-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearTareaComponent,
    ObtenerTodosComponent,
    GuardarUsuarioComponent,
    ConfirmDialogComponent,
    CloseDialogComponent,
    ObtenerTodasTareasComponent,
    MenuComponent,
    ActualizarTareaComponent,
    LoginComponent,
    AccessDeniedComponent,
    ActualizarUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule,
    EffectsModule,
    StoreDevtoolsModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginator,
    MatInputModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
