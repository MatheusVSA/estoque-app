import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  produto:string = "";
  quantProduto:number = 0;
  precoProduto:number = 0.0;

  produtosEstoque:any = [];

  constructor(private http: HttpClient) {}

  addProduto() {
    //contante que recebe os valores que serão inseridos
    const produto = {
      nome_produto: this.produto,
      quantidade: this.quantProduto,
      preco: this.precoProduto
    };
    //Chama a api-estoque onde são inseridos os produtos no banco de dados, 
    this.http.post('http://localhost:3000/inserirproduto', produto).subscribe(
      (resposta:any) => {
        console.log('Produto inserido com sucesso: ', resposta);
        this.produtosEstoque.push(produto);
        //Zera o campo de valores após a inserção 
        this.produto = '';
        this.quantProduto = 0;
        this.precoProduto = 0.0;
      },
      (erro) => {
        console.error('Erro ao inserir produto:', erro);
      }
    );
  }

  listarProdutos() {
    this.produtosEstoque = [];
    this.http.get('http://localhost:3000/').subscribe(
      (resposta) => {
        this.produtosEstoque = resposta.valueOf();
        this.produtosEstoque = this.produtosEstoque['dados'];
        console.log(this.produtosEstoque);
      }
    );

  }
  // apagarProduto(index:number) {
  //   this.produtosEmEstoque.splice(index, 1)
  // }

  // async editarProduto(index:number) {

  //   const nomeAtual = this.produtosEmEstoque[index].nome;
  //   const quantidadeAtual = this.produtosEmEstoque[index].quantidade;
  //   const valorAtual = this.produtosEmEstoque[index].valor;
    
  //   let alerta = await this.alert.create
  //   ({
  //       header: 'Editar Produto',
  //       message: 'Insira o novo nome',
  //       inputs: [
  //         {name: 'editarNome', value: nomeAtual}, 
  //         {name: 'editarQuantidade', value: quantidadeAtual}, 
  //         {name: 'editarValor', value: valorAtual}],
        
  //       buttons: [
  //         {text: 'Cancelar', role: 'cancel'}, 

  //           {text: 'Ok',
  //           handler: (data) => {
  //             const novoNome = data.editarNome;
  //             const novaQuantidade = data.editarQuantidade;
  //             const novoValor = data.editarValor;

  //             this.produtosEmEstoque[index] = {
  //               nome: novoNome,
  //               quantidade: novaQuantidade,
  //               valor: novoValor
  //             };
  //           }  
  //         }
  //       ]
  //   });
    
  //   await alerta.present();
  // }

}
