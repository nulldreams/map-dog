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
 - tipo
 - genero
 - idade (? pode ser removida)
 - descricao
 - lng (Longitude)
 - lat (Latitude)
 - animal (Ele é um file, então nele você faz o input de uma imagem do cachorro)
