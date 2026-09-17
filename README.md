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
1. Na raiz deste repositório, acesse a pasta **`projects-assets/`**.
2. Crie uma nova subpasta com um nome curto e sem espaços para o seu projeto (ex: `cidades-inteligentes-iot`).
3. Cole dentro dessa pasta as imagens de destaque, gráficos de resultados ou vídeos do projeto.

### 2️⃣ Cadastrar os Dados no `data.json`
1. Abra o arquivo **`data.json`** diretamente no GitHub (clicando no ícone de lápis ✏️).
2. Adicione um novo bloco de objeto JSON seguindo este modelo exato:

```json
  {
    "id": "nome-curto-do-projeto",
    "title": "Título Completo do Artigo Publicado",
    "category": "Cidades Inteligentes", 
    "partner": "Nome da Empresa Parceira",
    "partner_url": "[https://site-da-empresa.com](https://site-da-empresa.com)",
    "media": [
      {
        "type": "image",
        "url": "./projects-assets/nome-curto-do-projeto/banner.jpg"
      }
    ],
    "description": "Breve resumo do projeto, explicando a arquitetura desenvolvida e os principais resultados obtidos.",
    "paper_url": "[https://doi.org/10.xxxx/xxxxx](https://doi.org/10.xxxx/xxxxx)",
    "repo_url": "[https://github.com/PPGIA-Sistemas-Ciberfisicos/nome-do-repositorio-do-codigo](https://github.com/PPGIA-Sistemas-Ciberfisicos/nome-do-repositorio-do-codigo)",
    "bibtex": "@inproceedings{seuSobrenome2026titulo,\n  author={Sobrenome, Nome and Orientador, Nome},\n  title={Título do Artigo},\n  booktitle={Nome da Conferência ou Periódico},\n  year={2026}\n}"
  }