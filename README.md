# map-dog
Map de animais perdidos

# Instalação
Para instalar basta utilizar o comando "npm i ou npm install" pelo console, dentro da pasta map-dog, feito isso você terá que baixar alguns pacotes pelo bower. (Para fazer a instalação do bower utilize: "npm i bower -g").
# Pacotes
- angular
- angularjs-geolocation
- bootstrap
- jquery

Feitas as instalações utilize "node server.js".

# Rotas
- A rota GET "/animals" retorna todos os animais registrados no banco (MongoDB).

- A rota POST "/animal" adiciona um novo animal no banco
 - # Parametros
 - tipo (Ex: Cachorro, Cobra, ET)
 - genero (Ex: Macho, Femea)
 - idade (? pode ser removida) (Ex: Novo, Adulto, Velho)
 - descricao (Ex: O cachorro está com a pata quebrada, precisando de ajuda)
 - lng (Longitude) (Ex: -51.93946481)
 - lat (Latitude) (Ex: -23.41721839)
 - animal (Ele é um file, então nele você faz o input de uma imagem do cachorro)
 
# Testando
Assim que você sobe o server no node e acessa "localhost:3000", você vai cair na página principal que é o mapa, nessa tela ele vai estar enviando um GET para a rota "/animals" para capturar os dados que estão no nosso banco, com essas informações no arquivo "public/js/gservice.js", nós criamos uma marcação desse animal de acordo com as informações que estão no campo "Localizacao" do json que é devolvido do banco, quando você clica na imagem do animal, ele abre uma caixa com as informações dele e depois tem um botão para "Mais informações", nessa parte ele iria abrir uma tela única do animal com mais informações sobre ele.
