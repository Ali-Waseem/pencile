import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasComponent } from './Pages/canvas/canvas.component';
import { LoginComponent } from './Pages/login/login.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'login', component:LoginComponent },
  {path:'canvas', component:CanvasComponent},
  {
    path: '**',
    redirectTo: 'login'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {



}
