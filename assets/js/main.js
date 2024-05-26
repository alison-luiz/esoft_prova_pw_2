// Variavel para a URL da API
const url = "https://servicodados.ibge.gov.br/api/v3/noticias";

// Variáveis para os elementos do filtro
const filtro = document.querySelector(".icone-filtro  ");
const dialog = document.querySelector(".dialog-filtro");
const dialogFechar = document.querySelector(".dialog-fechar");
const dialogAplicar = document.querySelector(".dialog-filtro-aplicar");

// Eventos para abrir e fechar o dialog de filtro
dialogAplicar.addEventListener("click", () => {
  atualizarFiltros();
  dialog.close();
});

filtro.addEventListener("click", () => {
  dialog.showModal();
});

dialogFechar.addEventListener("click", () => {
  dialog.close();
});

// Variáveis para os campos de busca
const formBusca = document.querySelector(".form-busca");
const inputBusca = formBusca.querySelector("input");
let busca = inputBusca.value || "";

// Evento para buscar as notícias quando o formulário de busca é submetido
formBusca.addEventListener("submit", (event) => {
  event.preventDefault();

  busca = inputBusca.value;

  atualizarUrl();
  buscarNoticias();
});

// Váriaveis para os campos de filtro
let tipo = document.querySelector("#tipo");
let qtd = document.querySelector("#quantidade");
let de = document.querySelector("#de");
let ate = document.querySelector("#ate");

// Variavel que armazena a UL que irá conter as notícias
const listaNoticias = document.querySelector(".lista-noticias");

// Função para criar o elemento da notícia
function criarNoticia(noticia) {
  const li = document.createElement("li");

  const imagem = document.createElement("img");
  const imagemObj = JSON.parse(noticia.imagens);
  imagem.src = `https://agenciadenoticias.ibge.gov.br/${imagemObj.image_intro}`;

  const titulo = document.createElement("h2");
  titulo.textContent = noticia.titulo;

  const intro = document.createElement("p");
  intro.textContent = noticia.introducao;

  const editorias = document.createElement("span");
  editorias.textContent = noticia.editorias
    ? noticia.editorias
        .split(";")
        .map((editoria) => `#${editoria}`)
        .join(" ")
    : "";

  const publicado = document.createElement("span");
  publicado.textContent = calcularDataPublicacao(noticia.data_publicacao);

  const botaoLeiaMais = document.createElement("button");
  botaoLeiaMais.textContent = "Leia mais";
  botaoLeiaMais.addEventListener("click", () => {
    window.open(noticia.link, "_blank");
  });

  const divNoticia = document.createElement("div");
  divNoticia.classList.add("noticia");

  const divConteudo = document.createElement("div");
  divConteudo.classList.add("conteudo");

  const divImagem = document.createElement("div");
  divImagem.classList.add("conteudo-imagem");

  const divInfo = document.createElement("div");
  divInfo.classList.add("info");

  const divPublicado = document.createElement("div");
  divPublicado.classList.add("publicado");

  const divLeiaMais = document.createElement("div");
  divLeiaMais.classList.add("leia-mais");

  divInfo.appendChild(titulo);
  divInfo.appendChild(intro);
  divPublicado.appendChild(editorias);
  divPublicado.appendChild(publicado);
  divLeiaMais.appendChild(botaoLeiaMais);

  divConteudo.appendChild(divInfo);
  divConteudo.appendChild(divPublicado);
  divConteudo.appendChild(divLeiaMais);

  divImagem.appendChild(imagem);

  divNoticia.appendChild(divImagem);
  divNoticia.appendChild(divConteudo);

  li.appendChild(divNoticia);

  return li;
}

// Função para calcular a data de publicação
function calcularDataPublicacao(data) {
  const dataAtual = new Date();
  const dataPublicacao = new Date(
    data.replace(
      /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
      "$2/$1/$3 $4:$5:$6"
    )
  );
  const diferencaTempo = Math.abs(dataAtual - dataPublicacao);
  const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
  if (diferencaDias === 0) {
    return "Publicado hoje";
  } else if (diferencaDias === 1) {
    return "Publicado ontem";
  } else {
    return `Publicado há ${diferencaDias} dias`;
  }
}

// Função para atualizar as variáveis de filtro quando o dialog é aplicado
function atualizarFiltros() {
  tipo = document.querySelector("#tipo");
  qtd = document.querySelector("#quantidade");
  de = document.querySelector("#de");
  ate = document.querySelector("#ate");

  buscarNoticias();
  atualizarUrl();
}

// Atualizar url com os filtros
function atualizarUrl() {
  const params = new URLSearchParams();

  busca !== "" && params.append("busca", busca);
  tipo.value !== "" && params.append("tipo", tipo.value);
  de.value !== "" && params.append("de", de.value);
  ate.value !== "" && params.append("ate", ate.value);
  params.append("qtd", qtd.value);

  window.history.pushState({}, "", `?${params}`);
}

// Atualizar as variáveis de filtro quando a página é carregada pela primeira vez e tiver dados na url
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  busca = urlParams.get("busca") || "";
  tipo.value = urlParams.get("tipo") || "";
  qtd.value = urlParams.get("qtd") || 10;
  de.value = urlParams.get("de") || "";
  ate.value = urlParams.get("ate") || "";

  if (busca !== "") {
    inputBusca.value = busca;
  }

  buscarNoticias();
});

// Função para buscar as notícias da API do IBGE
function buscarNoticias() {
  const params = new URLSearchParams();

  busca !== "" && params.append("busca", busca);
  tipo.value !== "" && params.append("tipo", tipo.value);
  de.value !== "" && params.append("de", de.value);
  ate.value !== "" && params.append("ate", ate.value);
  params.append("qtd", qtd.value);

  fetch(`${url}?${params}`)
    .then((response) => response.json())
    .then((data) => {
      listaNoticias.innerHTML = "";
      data.items.forEach((noticia) => {
        listaNoticias.appendChild(criarNoticia(noticia));
      });
    });
}
