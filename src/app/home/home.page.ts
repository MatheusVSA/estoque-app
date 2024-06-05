import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Produtos } from '../interface/interface-produtos';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  //Chamando a interface para dentro do programa 
  produtos:Produtos;

  constructor(private http: HttpClient, private alert: AlertController) {
    //Declaração dos valores iniciais dos objetos 
    this.produtos = {
      nomeProduto: "",
      quantProduto: 0,
      precoProduto: 0.0,
      produtosEstoque: [],
      produtoAtual: null
    }
  }

  //Adiciona os produtos
  addProduto() {
    //contante que recebe os valores que serão inseridos
    const produtos = {
      nome_produto: this.produtos.nomeProduto,
      quantidade: this.produtos.quantProduto,
      preco: this.produtos.precoProduto
    };
    //Chama a api-estoque onde são inseridos os produtos no banco de dados
    this.http.post('http://localhost:3000/inserirproduto', produtos).subscribe(
      (resposta:any) => {
        console.log('Produto inserido com sucesso: ', resposta);
        this.produtos.produtosEstoque.push(produtos);
        //Zera o campo de valores após a inserção 
        this.produtos.nomeProduto = '';
        this.produtos.quantProduto = 0;
        this.produtos.precoProduto = 0.0;
      },
      (erro) => {
        console.error('Erro ao inserir produto:', erro);
      }
    );
  }

  //Lista os produtos 
  listarProdutos() {
    //Iniciando o Objeto como vazio
    this.produtos.produtosEstoque = [];
    //Chama a api-estoque onde são inseridos os produtos no banco de dados
    this.http.get('http://localhost:3000/').subscribe(
      (resposta) => {
        this.produtos.produtosEstoque = resposta.valueOf();
        this.produtos.produtosEstoque = this.produtos.produtosEstoque['dados'];
        console.log(this.produtos.produtosEstoque);
      }
    );
  }

  //FUnção que identifica qual é o produto atual
  setProdutoAtual(produto: any) {
    this.produtos.produtoAtual = produto;
    console.log(produto.ID);
  }

  //Apagar produtos
  apagarProduto() {
    //constante que recebe o id que será enviado ao banco como parametro
    const id = {
      id_produto:this.produtos.produtoAtual.ID
    }

    //Conexão com a a Api
    this.http.post(`http://localhost:3000/excluirproduto`, id).subscribe(
      (resposta:any) => {
        console.log(`Produto excluido com sucesso: `, resposta);
        //Exclui os produtos da lista
        this.produtos.produtosEstoque = this.produtos.produtosEstoque.filter((produto:any) => produto.id !== id);
        this.produtos.produtoAtual = null;
        
        //Atualiza a lista com os produtos após a exclusão 
        this.produtos.produtosEstoque = resposta.valueOf();
        this.produtos.produtosEstoque = this.produtos.produtosEstoque['dados'];
      },
      (erro) => {
        console.error('Erro ao excluir produto:', erro);
      }
    );
  }

  //Editar produtos
   async editarProduto(){
    
    const produtos = {
      id_produto:this.produtos.produtoAtual.ID,
      nome_produto: this.produtos.produtoAtual.nome,
      quantidade: this.produtos.produtoAtual.quantidade,
      preco: this.produtos.produtoAtual.preco
    };

    //Esse alerta será exibido para o usuário poder fazer as alterações no produto selecionado
    let alerta = await this.alert.create({
      header: 'Editar Produto',
      message: 'Insira o novo nome, quantidade e valor',
      inputs: [
        { name: 'editarNome', value: this.produtos.produtoAtual.nome_produto }, 
        { name: 'editarQuantidade', value: this.produtos.produtoAtual.quantidade }, 
        { name: 'editarValor', value: this.produtos.produtoAtual.preco }
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
            const index = this.produtos.produtosEstoque.findIndex((produto: any) => produto.ID === this.produtos.produtoAtual.ID);
            if (index !== -1) {
              this.produtos.produtosEstoque[index] = {
                ...this.produtos.produtosEstoque[index],
                nome_produto: novoNome,
                quantidade: novaQuantidade,
                preco: novoValor
              };

              //Produto atualizado
              const novoProduto = {
                id_produto: this.produtos.produtoAtual.ID,
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
