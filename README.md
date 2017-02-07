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
 https://github.com/nulldreams/map-dog/wiki/Rotas-(animais)
 
# Testando
Assim que você sobe o server no node e acessa "localhost:3000", você vai cair na página principal que é o mapa, nessa tela ele vai estar enviando um GET para a rota "/animals" para capturar os dados que estão no nosso banco, com essas informações no arquivo "public/js/gservice.js", nós criamos uma marcação desse animal de acordo com as informações que estão no campo "Localizacao" do json que é devolvido do banco, quando você clica na imagem do animal, ele abre uma caixa com as informações dele e depois tem um botão para "Mais informações", nessa parte ele iria abrir uma tela única do animal com mais informações sobre ele.

# Telas
- Intro
- Login
- Home (Mapa e card)
- Perfil animal

# ajustes
- Colocar posicacao inicial fixa
