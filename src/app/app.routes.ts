import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardContainerComponent } from './pages/dashboard-container/dashboard-container.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { soloPublicoGuard } from './guards/solo-publico.guard';
import { soloAdminGuard } from './guards/solo-admin.guard';
import { soloLogueadoGuard } from './guards/solo-logueado.guard';
import { RegisterComponent } from './pages/register/register.component';
import { PricesComponent } from './pages/prices/prices.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "login",
        pathMatch: 'full',
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "register",
        component: RegisterComponent,
    },
    {
        path: "",
        component: DashboardContainerComponent,
        canActivate: [soloLogueadoGuard],
        children:[
            {
                path: "parking-state",
                component: EstadoCocherasComponent,
                canActivate: [soloLogueadoGuard]
            },
            {
                path: "reports",
                component: ReportesComponent,
                canActivate: [soloAdminGuard]
            },
            {
                path: "prices",
                component: PricesComponent,
                canActivate: [soloAdminGuard]
            }
        ]
    },

    {
        path: "not-found",
        component: NotFoundComponent
    },
    {
        path: "**",
        redirectTo: "not-found",
        pathMatch: "full"
    },
];
