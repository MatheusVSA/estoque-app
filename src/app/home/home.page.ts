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
  produtoAtual:any = null;

  constructor(private http: HttpClient) {}

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
  }

  apagarProduto() {
      if(this.produtoAtual && this.produtoAtual.id){
        const id = this.produtoAtual.id;
        this.http.delete(`http://localhost:3000/excluirproduto/${id}`).subscribe(
          (resposta:any) => {
            console.log(`Produto excluido com sucesso: `, resposta);
            this.produtosEstoque = this.produtosEstoque.filter((produto:any) => produto.id !== id);
            this.produtoAtual = null;
          },
          (erro) => {
            console.error('Erro ao excluir produto:', erro);
          }
        );
      } else {
        console.error('Erro: Produto atual ou ID do produto não definido');
      }
  }
}
