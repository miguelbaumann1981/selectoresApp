import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required]
  });

  // Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  cargando: boolean = false;

  constructor( private fb: FormBuilder, private paisesServices: PaisesService ) { }

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;

    // Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
      .pipe(
        tap(
          ( _ ) => {
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          }
        ),
        switchMap(region => this.paisesServices.getPaisesPorRegion(region))
      )  
      .subscribe(paises => {
        console.log(paises);
        this.paises = paises;
        this.cargando = false;
      })

      // Cuando cambia el país
      this.miFormulario.get('pais')?.valueChanges
      .pipe(
        tap( () => {
          this.fronteras = [];
          this.miFormulario.get('frontera')?.reset('');
          this.cargando = true;
        } ),
        switchMap(codigo => this.paisesServices.getPaisPorCodigo(codigo))
      )
      .subscribe((pais) => {
        console.log(pais);
        if (pais !== null) {
          this.fronteras = pais[0]?.borders || [];
          console.log(this.fronteras);
          this.cargando = false;
        }
      });
  }

  guardar() {
    console.log(this.miFormulario.value);
  }

}
