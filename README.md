# twitterAndRabbitMQ

Responsável por realizar testes com o sistema rabbitmq já instalado e configurado. 
A inspiração para a criação deste projeto foi um trabalho realizado na disciplica de sistemas distribuídos.

# Configuração

### 0 - Dependências

- Antes de começar a configurar o projeto Gn-Pix é necessário realizar os seguintes passos:

  - Clone o projeto [rabbitmq-docker](https://github.com/GabrielSouzasbl/rabbitmq)
  - Siga os passos descritos
  - Verifique se as instancias estão rodando

### 1 - Requisitos para rodar na máquina local

- NodeJS 10.x ou superior;

### 2 - Configurando o projeto

```shell
$ npm install
```
### 2 - Iniciando o emiiter

    - Acesse a pasta onde ele se encontra.
    ```shell
    $ cd twitterAndRabbitMQ/handlers
    ```
    
    - Execute o script emitter.js    

> **_NOTA:_**  O comando emitter inicia o crawler de tweets na rede social twitter a partir dos parâmetros solicitados e após isso envia os textos para as filas parametrizadas do rabbitMQ.
   
#### Sobre os parâmetros:
    * Tipo de envio:
      - crawler: Indica que o produtor enviará mensagens extraídas do Twitter.
      - normal: Enviará apenas uma mensagem designada no parâmetro a seguir.
    
    * Nó Produtor:
      - 0: Localhost
      - 5672: Porta do cluster node.
      
    * Nome da fila:
      - Para o tipo de envio -crawler-, este parâmetro NÂO deve ser expecificado
      - "fila1" para o tipo de envio -normal-.
      
    * Usuários a serem extraídos:
      - "usuario1 usuario2": user_name do usuario do twitter a ser crawleado. **Apenas para tipo de envio -crawler-**
      - "texto da mensagem": Texto da mensagem a ser enviada. **Apenas para tipoi de envio -normal-**
      
    * Quantidade de tweets:
      - Para o tipo de envio -normal-, este parâmetro NÂO deve ser expecificado
      - "100" para o tipo de envio -crawler-.
    
    
#### Exemplos de emitter:

    ```shell
    $ node emitter.js crawler 5672 "folha Estadao" 100
    ```
    
    ```shell
    $ node handlers/emitter.js normal 0 nano "mesage test"
    ```
    



