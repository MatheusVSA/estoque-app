import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

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
  produtoAtual:any = null;

  constructor(private http: HttpClient, private alert: AlertController) {}

  addProduto() {
    //contante que recebe os valores que serão inseridos
    const produtos = {
      nome_produto: this.produto,
      quantidade: this.quantProduto,
      preco: this.precoProduto
    };
    //Chama a api-estoque onde são inseridos os produtos no banco de dados, 
    this.http.post('http://localhost:3000/inserirproduto', produtos).subscribe(
      (resposta:any) => {
        console.log('Produto inserido com sucesso: ', resposta);
        this.produtosEstoque.push(produtos);
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

  setProdutoAtual(produto: any) {
    this.produtoAtual = produto;
    console.log(produto.ID);
  }

  apagarProduto() {
    //constante que recebe o id que será enviado ao banco como parametro
    const id = {
      id_produto:this.produtoAtual.ID
    }

    //Conexão com a a Api
    this.http.post(`http://localhost:3000/excluirproduto`, id).subscribe(
      (resposta:any) => {
        console.log(`Produto excluido com sucesso: `, resposta);
        //Exclui os produtos da lista
        this.produtosEstoque = this.produtosEstoque.filter((produto:any) => produto.id !== id);
        this.produtoAtual = null;
        
        //Atualiza a lista com os produtos após a exclusão 
        this.produtosEstoque = resposta.valueOf();
        this.produtosEstoque = this.produtosEstoque['dados'];
      },
      (erro) => {
        console.error('Erro ao excluir produto:', erro);
      }
    );
  }

   async editarProduto(){
    
    const produtos = {
      id_produto:this.produtoAtual.ID,
      nome_produto: this.produtoAtual.nome,
      quantidade: this.produtoAtual.quantidade,
      preco: this.produtoAtual.preco
    };

    let alerta = await this.alert.create({
      header: 'Editar Produto',
      message: 'Insira o novo nome, quantidade e valor',
      inputs: [
        { name: 'editarNome', value: this.produtoAtual.nome_produto }, 
        { name: 'editarQuantidade', value: this.produtoAtual.quantidade }, 
        { name: 'editarValor', value: this.produtoAtual.preco }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' }, 
        { 
          text: 'Ok',
          handler: (data) => {
            const novoNome = data.editarNome;
            const novaQuantidade = data.editarQuantidade;
            const novoValor = data.editarValor;

            //atualiza o produto no estoque local
            const index = this.produtosEstoque.findIndex((produto: any) => produto.ID === this.produtoAtual.ID);
            if (index !== -1) {
              this.produtosEstoque[index] = {
                ...this.produtosEstoque[index],
                nome_produto: novoNome,
                quantidade: novaQuantidade,
                preco: novoValor
              };

              //Produto atualizado
              const novoProduto = {
                id_produto: this.produtoAtual.ID,
                nome_produto: novoNome,
                quantidade: novaQuantidade,
                preco: novoValor
              }

              this.http.post(`http://localhost:3000/editarproduto`, novoProduto).subscribe(
                (resposta: any) => {
                  console.log('Produto alterado com sucesso: ', resposta);

                },
                (erro) => {
                  console.error('Erro ao editar produto:', erro);
                }
              );
            }
          }
        }
      ]
    });
    await alerta.present();
  }
}
