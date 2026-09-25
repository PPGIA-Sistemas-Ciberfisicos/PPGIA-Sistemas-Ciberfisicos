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

let activeFigureDialog;

function openFigureDialog(image, trigger) {
  if (!activeFigureDialog) {
    const dialog = node('dialog', 'figure-dialog');
    dialog.setAttribute('aria-labelledby', 'figure-dialog-title');
    const title = node('h2', '', 'Visualização ampliada');
    title.id = 'figure-dialog-title';
    const close = node('button', 'figure-dialog-close', 'Fechar');
    close.type = 'button';
    const enlarged = node('img', 'figure-dialog-image');
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => activeFigureDialog.trigger?.focus());
    dialog.addEventListener('keydown', event => { if (event.key === 'Escape') dialog.close(); });
    dialog.append(close, title, enlarged);
    document.body.append(dialog);
    activeFigureDialog = { dialog, close, enlarged };
  }
  activeFigureDialog.trigger = trigger;
  activeFigureDialog.enlarged.src = image.src;
  activeFigureDialog.enlarged.alt = image.alt;
  activeFigureDialog.dialog.showModal();
  activeFigureDialog.close.focus();
}

function createMedia(project) {
  const media = node('div', 'project-media');
  const frame = node('div', 'media-frame');
  const primary = project.media && project.media[0];
  const fallback = () => frame.replaceChildren(node('p', 'media-fallback', 'Mídia do projeto indisponível.'));
  if (!primary || !primary.url) {
    frame.append(node('p', 'media-fallback', 'Conheça a pesquisa nos links do projeto.'));
  } else if (primary.type === 'video') {
    frame.classList.add('media-video');
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
    const enlarge = node('button', 'figure-expand', 'Ampliar figura');
    enlarge.type = 'button';
    enlarge.addEventListener('click', () => openFigureDialog(image, enlarge));
    media.append(frame, enlarge);
    if (primary.caption) media.append(node('p', 'figure-caption', primary.caption));
    return media;
  }
  media.append(frame);
  return media;
}

function createPartner(partner, tag = 'div') {
  const header = node(tag, 'partner');
  const identity = node('span', 'partner-identity');
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
    const link = externalLink('Visitar site', partner.url, 'partner-link');
    link.setAttribute('aria-label', 'Conhecer ' + partner.name);
    const arrow = node('span', '', '↗');
    arrow.setAttribute('aria-hidden', 'true');
    link.append(arrow);
    header.append(link);
  }
  return header;
}

function createProject(project, index, idPrefix = 'subproject') {
  const article = node('article', 'project');
  const title = node('h4', '', project.title);
  title.id = idPrefix + '-title-' + index;
  article.setAttribute('aria-labelledby', title.id);
  if (partnerName(project)) article.append(createPartner(project.partner));
  const body = node('div', 'project-body');
  const info = node('div', 'project-info');
  info.append(title);
  if (project.description) info.append(node('p', 'description', project.description));
  const actions = node('div', 'project-actions');
  if (project.paper_url) actions.append(externalLink('Ler artigo', project.paper_url, 'button button-wine'));
  if (project.repo_url) actions.append(externalLink('Repositório', project.repo_url, 'button button-outline'));
  if (actions.childElementCount) info.append(actions);
  body.append(createMedia(project), info);
  article.append(body);
  return article;
}

function partnerName(project) {
  const partner = project.partner;
  return partner && typeof partner.name === 'string' ? partner.name.trim().replace(/\s+/g, ' ') : '';
}

function projectGrid(projects, emptyMessage, idPrefix = 'subproject') {
  const grid = node('div', 'project-grid' + (projects.length === 1 ? ' project-grid-single' : ''));
  grid.append(...projects.map((project, index) => createProject(project, index, idPrefix)));
  if (!projects.length) grid.append(node('p', 'state', emptyMessage));
  return grid;
}

function researchProjectView(project, index) {
  const section = node('div', 'research-project');
  if (partnerName(project)) section.append(createPartner(project.partner));
  section.append(node('p', 'results-title', 'Resultados preliminares'));
  section.append(projectGrid(project.subprojects || [], 'Nenhum subprojeto publicado neste projeto de pesquisa.', 'research-' + index));
  return section;
}

function researchProjects(projects) {
  const list = node('div', 'research-list');
  if (!projects.length) {
    list.append(node('p', 'state', 'Nenhum projeto publicado no momento.'));
    return list;
  }
  projects.forEach((project, index) => {
    const section = node('section', 'research-section');
    const header = node('header', 'research-heading');
    const number = node('span', 'research-number', String(index + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    const title = node('h3', 'research-title', project.title);
    title.id = 'research-title-' + index;
    section.setAttribute('aria-labelledby', title.id);
    header.append(number, title);
    section.append(header, researchProjectView(project, index));
    list.append(section);
  });
  return list;
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
    container.replaceChildren(researchProjects(projects));
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
