'use strict';

function node(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text) el.textContent = text;
  return el;
}

function externalLink(text, url, className) {
  const link = node('a', className, text);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

function createMedia(project) {
  const media = node('div', 'project-media');
  const frame = node('div', 'media-frame');
  const primary = project.media && project.media[0];
  const fallback = () => frame.replaceChildren(node('p', 'media-fallback', 'Mídia do projeto indisponível.'));
  if (!primary || !primary.url) {
    frame.append(node('p', 'media-fallback', 'Conheça a pesquisa nos links do projeto.'));
  } else if (primary.type === 'video') {
    const isFile = /\.(mp4|webm|ogg|ogv)(?:[?#]|$)/i.test(primary.url);
    const video = node(isFile ? 'video' : 'iframe');
    video.src = primary.url;
    if (isFile) {
      video.controls = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', 'Vídeo: ' + project.title);
      video.addEventListener('error', fallback, { once: true });
    } else {
      video.title = 'Vídeo: ' + project.title;
      video.allowFullscreen = true;
      video.loading = 'lazy';
    }
    frame.append(video);
  } else {
    const image = node('img');
    image.src = primary.url;
    image.alt = primary.alt || 'Demonstração do projeto: ' + project.title;
    image.loading = 'lazy';
    image.addEventListener('error', fallback, { once: true });
    frame.append(image);
  }
  media.append(frame);
  return media;
}

function createPartner(partner) {
  const header = node('div', 'partner');
  const identity = node('div', 'partner-identity');
  identity.append(node('span', 'partner-label', 'EMPRESA PARCEIRA'));
  if (partner.logo) {
    const logo = node('img', 'partner-logo');
    logo.src = partner.logo;
    logo.alt = partner.name;
    logo.addEventListener('error', () => logo.replaceWith(node('strong', '', partner.name)), { once: true });
    identity.append(logo);
  } else identity.append(node('strong', '', partner.name));
  header.append(identity);
  if (partner.url) {
    const link = externalLink('Site da empresa', partner.url, 'partner-link');
    link.setAttribute('aria-label', 'Visitar o site da ' + partner.name);
    const arrow = node('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    link.append(arrow);
    header.append(link);
  }
  return header;
}

function createCitation(bibtex) {
  const details = node('details', 'citation');
  const summary = node('summary', '', 'Citação BibTeX');
  const panel = node('div', 'citation-panel');
  const toolbar = node('div', 'citation-toolbar');
  const status = node('span', 'copy-status');
  status.setAttribute('role', 'status');
  const copy = node('button', 'copy-button', 'Copiar citação');
  copy.type = 'button';
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      status.textContent = 'Citação copiada!';
    } catch (error) {
      status.textContent = 'Selecione o texto abaixo para copiar.';
    }
  });
  const pre = node('pre');
  pre.tabIndex = 0;
  pre.setAttribute('aria-label', 'Código da citação BibTeX');
  pre.append(node('code', '', bibtex));
  toolbar.append(status, copy);
  panel.append(toolbar, pre);
  details.append(summary, panel);
  return details;
}

function createProject(project, index) {
  const article = node('article', 'project');
  const title = node('h2', '', project.title);
  title.id = 'project-title-' + index;
  article.setAttribute('aria-labelledby', title.id);
  const partner = project.partner;
  const hasPartner = partner && typeof partner.name === 'string' && partner.name.trim();
  if (hasPartner) article.append(createPartner(partner));
  const body = node('div', 'project-body');
  const info = node('div', 'project-info');
  info.append(title);
  if (project.description) info.append(node('p', 'description', project.description));
  const actions = node('div', 'project-actions');
  if (project.paper_url) actions.append(externalLink('Ler artigo (DOI) ↗', project.paper_url, 'button button-wine'));
  if (project.repo_url) actions.append(externalLink('Código-fonte ↗', project.repo_url, 'button button-outline'));
  if (actions.childElementCount) info.append(actions);
  body.append(createMedia(project), info);
  article.append(body);
  if (project.bibtex) article.append(createCitation(project.bibtex));
  return article;
}

async function loadProjects() {
  const container = document.getElementById('projects');
  container.setAttribute('aria-busy', 'true');
  container.replaceChildren(node('p', 'state', 'Carregando projetos…'));
  try {
    const response = await fetch('./data.json');
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const projects = await response.json();
    if (!Array.isArray(projects)) throw new Error('Formato de projetos inválido');
    container.replaceChildren(...projects.map(createProject));
    if (!projects.length) container.append(node('p', 'state', 'Novos projetos serão publicados aqui em breve.'));
  } catch (error) {
    const state = node('div', 'state');
    state.setAttribute('role', 'alert');
    state.append(node('p', '', 'Não foi possível carregar os projetos.'));
    const retry = node('button', 'button button-outline', 'Tentar novamente');
    retry.type = 'button';
    retry.addEventListener('click', loadProjects);
    state.append(retry);
    container.replaceChildren(state);
    console.error('Erro ao carregar projetos:', error);
  } finally {
    container.setAttribute('aria-busy', 'false');
  }
}

loadProjects();
