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

function openFigureDialog(image) {
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
    dialog.addEventListener('close', () => image.focus());
    dialog.addEventListener('keydown', event => { if (event.key === 'Escape') dialog.close(); });
    dialog.append(close, title, enlarged);
    document.body.append(dialog);
    activeFigureDialog = { dialog, close, enlarged };
  }
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
    enlarge.addEventListener('click', () => openFigureDialog(image));
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
    const link = externalLink('Conhecer ' + partner.name, partner.url, 'partner-link');
    link.setAttribute('aria-label', 'Conhecer ' + partner.name);
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

function createProject(project, index, idPrefix = 'subproject') {
  const article = node('article', 'project');
  const title = node('h2', '', project.title);
  title.id = idPrefix + '-title-' + index;
  article.setAttribute('aria-labelledby', title.id);
  if (partnerName(project)) article.append(createPartner(project.partner));
  const body = node('div', 'project-body');
  const info = node('div', 'project-info');
  if (project.result_type) info.append(node('p', 'result-type', project.result_type));
  info.append(title);
  if (project.description) info.append(node('p', 'description', project.description));
  const actions = node('div', 'project-actions');
  if (project.paper_url) actions.append(externalLink('Ler artigo', project.paper_url, 'button button-wine'));
  if (project.repo_url) actions.append(externalLink('Código-fonte', project.repo_url, 'button button-outline'));
  if (actions.childElementCount) info.append(actions);
  body.append(createMedia(project), info);
  article.append(body);
  if (project.bibtex) article.append(createCitation(project.bibtex));
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
  const section = node('section', 'research-project');
  const content = node('div', 'research-content');
  const main = node('div', 'research-main');
  const sidebar = node('aside', 'research-sidebar');
  if (project.sections && project.sections.length) {
    project.sections.forEach(item => {
      const block = node('div', 'research-detail');
      const text = item.items ? null : node('p', '', item.text);
      block.append(node('h3', '', item.title));
      if (item.items) {
        const list = node('ul', 'research-list');
        item.items.forEach(value => list.append(node('li', '', value)));
        block.append(list);
      } else if (text) block.append(text);
      main.append(block);
    });
  } else if (project.description) main.append(node('p', 'research-project-description', project.description));
  if (partnerName(project)) sidebar.append(createPartner(project.partner));
  if (project.metadata && project.metadata.length) {
    const meta = node('dl', 'research-metadata');
    project.metadata.forEach(item => meta.append(node('dt', '', item.label), node('dd', '', item.value)));
    sidebar.append(meta);
  }
  content.append(main, sidebar);
  section.append(content);
  section.append(node('h3', 'results-title', 'Resultados preliminares'));
  section.append(projectGrid(project.subprojects || [], 'Nenhum subprojeto publicado neste projeto de pesquisa.', 'research-' + index));
  return section;
}

function researchProjects(projects) {
  const accordion = node('div', 'accordion research-accordion');
  accordion.setAttribute('aria-label', 'Projetos de pesquisa');
  if (!projects.length) {
    accordion.append(node('p', 'state', 'Nenhum projeto de pesquisa publicado no momento.'));
    return accordion;
  }
  projects.forEach((project, index) => {
    const tab = node('div', 'accordion-item research-tab' + (index === 0 ? ' is-open' : ''));
    const header = node('h3', 'accordion-header research-tab-header');
    const button = node('button', 'accordion-button research-tab-button' + (index === 0 ? '' : ' collapsed'), '');
    button.type = 'button';
    button.id = 'research-tab-button-' + index;
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', '#research-tab-panel-' + index);
    button.setAttribute('aria-expanded', String(index === 0));
    button.setAttribute('aria-controls', 'research-tab-panel-' + index);
    const number = node('span', 'research-tab-number', String(index + 1).padStart(2, '0'));
    number.setAttribute('aria-hidden', 'true');
    const label = node('span', 'research-tab-label', project.title);
    const indicator = node('span', 'research-tab-indicator');
    indicator.setAttribute('aria-hidden', 'true');
    const titleBlock = node('span', 'research-tab-title');
    titleBlock.append(label);
    if (partnerName(project)) titleBlock.append(node('span', 'research-partner-note', 'Em parceria com ' + partnerName(project)));
    button.append(number, titleBlock, indicator);
    header.append(button);
    const panel = node('div', 'accordion-collapse collapse research-panel' + (index === 0 ? ' show' : ''));
    panel.id = 'research-tab-panel-' + index;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', button.id);
    panel.append(researchProjectView(project, index));
    panel.addEventListener('show.bs.collapse', () => tab.classList.add('is-open'));
    panel.addEventListener('hide.bs.collapse', () => tab.classList.remove('is-open'));
    tab.append(header, panel);
    accordion.append(tab);
  });
  return accordion;
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
