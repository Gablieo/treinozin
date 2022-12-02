import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { Exercicio } from '../interfaces/exercicio';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  novaTarefa: string = "";
  exercicios: Exercicio[] = [];
  exerciciosBackup: Exercicio[] = [];

  constructor(private storage: Storage,
    private toast: ToastController
    ) {
    this.iniciarBanco();
  }

  async desfazer(exercicioExcluido){
    const t = await this.toast.create({
      message: 'Você excluiu ' + exercicioExcluido,
      duration: 4000,
      buttons: [
      {
        text: 'Desfazer',
        handler: async () => {
          this.exercicios = [...this.exerciciosBackup];
          await this.storage.set('exercicios', this.exercicios);
        }
      }
      ]
    });
    t.present();
  }

  async iniciarBanco(){
    await this.storage.create();
    this.exercicios = await this.storage.get('exercicios') ?? [];
  }

  async apagarTarefa(indice){
    this.desfazer(this.exercicios[indice].nome);
    this.exerciciosBackup = [...this.exercicios];
    this.exercicios.splice(indice, 1);
    await this.storage.set('exercicios', this.exercicios);
  }

   async adicionarTarefa(){
    this.exercicios.push({nome: this.novaTarefa, peso: null});
    this.novaTarefa = "";
    await this.storage.set('exercicios', this.exercicios);
  }

  async gravarInfo(){
    await this.storage.set('exercicios', this.exercicios);
  }
}
