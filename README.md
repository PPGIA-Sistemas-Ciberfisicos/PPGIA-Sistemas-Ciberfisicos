<div align="center">

# Laboratório de Sistemas Ciberfísicos (PPGIA) 🚀

**Pesquisa aplicada, inovação tecnológica e parcerias estratégicas entre universidade e indústria.**

[![Visite o Site Oficial](https://img.shields.io/badge/Portal-Web%20Oficial-blue?style=for-the-badge&logo=google-chrome)](https://ppgia-sistemas-ciberfisicos.github.io/PPGIA-Sistemas-Ciberfisicos/)
[![Repositórios Publicados](https://img.shields.io/badge/Projetos-Abertos-green?style=for-the-badge&logo=github)](https://github.com/PPGIA-Sistemas-Ciberfisicos?tab=repositories)

</div>

---

## 🔬 Sobre o Laboratório
O **Laboratório de Sistemas Ciberfísicos** (vinculado ao PPGIA) desenvolve soluções avançadas que integram computação, redes e processos físicos. Nosso foco é unir a excelência da pesquisa acadêmica de ponta à resolução de desafios reais do mercado corporativo através de parcerias tecnológicas.

---

## 📖 Guia Rápido para Cadastro de Projetos (Para Alunos e Pesquisadores)

Assim que o seu artigo for **aceito/publicado** e o código-fonte for liberado publicamente, siga estes passos simples para adicionar o seu projeto à vitrine oficial do laboratório:

### 1️⃣ Adicionar as Mídias do Projeto
1. Na raiz deste repositório, acesse a pasta **`project-assets/`**.
2. Crie uma nova subpasta com um nome curto e sem espaços para o seu projeto (ex: `cidades-inteligentes-iot`).
3. Cole dentro dessa pasta as imagens de destaque, gráficos de resultados ou vídeos do projeto.

### 2️⃣ Cadastrar os Dados no `data.json`
1. Abra o arquivo **`data.json`** diretamente no GitHub (clicando no ícone de lápis ✏️).
2. Adicione um novo bloco de objeto JSON seguindo este modelo exato:

```json
  {
    "id": "nome-curto-da-pesquisa",
    "title": "Nome do Projeto de Pesquisa",
    "description": "Objetivo geral do projeto de pesquisa.",
    "partner": {
      "name": "Nome da Empresa Parceira",
      "url": "https://site-da-empresa.com",
      "logo": "./partner-logos/empresa.svg"
    },
    "subprojects": [
      {
        "id": "nome-curto-do-subprojeto",
        "title": "Título Completo do Artigo Publicado",
        "category": "Cidades Inteligentes",
        "media": [
          {
            "type": "image",
            "url": "./project-assets/nome-curto-do-subprojeto/banner.jpg"
          }
        ],
        "description": "Breve resumo do subprojeto e dos resultados preliminares.",
        "paper_url": "https://doi.org/10.xxxx/xxxxx",
        "repo_url": "https://github.com/PPGIA-Sistemas-Ciberfisicos/nome-do-repositorio-do-codigo"
      }
    ]
  }
```

### Projetos sem empresa parceira

O campo `partner` é opcional e pertence ao projeto de pesquisa. Para projetos acadêmicos individuais, remova esse campo ou use `"partner": null` no `data.json`. Quando informado, a faixa de parceria aparece uma vez no painel principal do projeto, antes dos subprojetos.

Quando houver parceria, informe `partner.name`. A logo (`partner.logo`) e o site (`partner.url`) também são opcionais: sem logo, aparece o nome da empresa; sem URL, o link não é exibido.

### 3️⃣ Trocar o banner por um vídeo

O primeiro item de `media` define o banner do projeto. Para substituir a imagem por um vídeo, adicione o arquivo à pasta do projeto e altere esse item no `data.json`:

```json
"media": [
  {
    "type": "video",
    "url": "./project-assets/mobile-phone-mining/demo.mp4"
      }
    ]
  }
]
```

Arquivos MP4, WebM e Ogg são exibidos com controles de reprodução, sem reprodução automática. Para um vídeo hospedado no YouTube ou Vimeo, use `type: "video"` com a URL de incorporação (embed) fornecida pela plataforma, em vez do link comum da página.

Para voltar à imagem, use `type: "image"` e o caminho `./project-assets/mobile-phone-mining/flowchart.png`.

## Portal no GitHub Pages

A página principal é `index.html`, com identidade visual em vinho, branco e grafite. Os projetos são carregados do `data.json`; as logos e mídias permanecem nas pastas locais do repositório.

O portal utiliza apenas HTML, CSS e JavaScript locais: não exige Jekyll, instalação de pacotes ou compilação. Publique a raiz do repositório no GitHub Pages, incluindo `index.html`, `data.json`, `assets/`, `laboratory.png`, `partner-logos/` e `project-assets/`.

Para visualizar localmente, execute `python3 -m http.server 8000` na raiz do repositório e abra `http://localhost:8000/`. O servidor é necessário para o carregamento do `data.json`.

Os estilos estão em `assets/css/moderno.css` e a renderização dos projetos em `assets/js/moderno.js`. Um único resultado usa composição horizontal no desktop; múltiplos resultados usam grade responsiva. Imagens, vídeos, links de parceiros e citações são configurados pelo modelo acima.


### Abas de projetos de pesquisa

Cada objeto raiz do `data.json` é um **projeto de pesquisa** e aparece como uma aba própria. Os campos `summary`, `metadata` e `sections` organizam o resumo, a ficha institucional e os blocos editoriais disponíveis, como objetivo e frentes de pesquisa. Os artigos e demais entregas ficam no array `subprojects`, exibido sob o título **Resultados preliminares**. Cada subprojeto tem seu próprio repositório Git, DOI e, quando cadastrado, citação BibTeX recolhida no card.

Projetos de pesquisa podem ter parceria ou não. Quando o projeto tiver `partner.name`, a logo e o link institucional aparecem na ficha lateral do painel expandido. O cabeçalho mostra somente a linha compacta “Em parceria com…”, fora do botão que controla a expansão.

Imagens de resultados usam `type: "image"` e podem ser ampliadas pelo botão **Ampliar figura**. O diálogo pode ser fechado pelo botão, clicando fora da figura ou usando a tecla Escape.
