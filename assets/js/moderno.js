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

function createProject(project, index, showPartner = true, idPrefix = 'project') {
  const article = node('article', 'project');
  const title = node('h2', '', project.title);
  title.id = idPrefix + '-title-' + index;
  article.setAttribute('aria-labelledby', title.id);
  if (showPartner && partnerName(project)) article.append(createPartner(project.partner));
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

function partnerName(project) {
  const partner = project.partner;
  return partner && typeof partner.name === 'string' ? partner.name.trim().replace(/\s+/g, ' ') : '';
}

function projectGrid(projects, emptyMessage, showPartner = true, idPrefix = 'project') {
  const grid = node('div', 'project-grid');
  grid.append(...projects.map((project, index) => createProject(project, index, showPartner, idPrefix)));
  if (!projects.length) grid.append(node('p', 'state', emptyMessage));
  return grid;
}

// Only the active panel is mounted, so hidden videos cannot keep playing.
function createTabs(entries, label, prefix, initialIndex = 0, onChange = () => {}) {
  const group = node('div', 'tabs ' + prefix);
  const list = node('div', 'tab-list');
  list.setAttribute('role', 'tablist');
  list.setAttribute('aria-label', label);
  const tabs = [];
  const panels = [];
  let activeIndex = -1;

  entries.forEach((entry, index) => {
    const tab = node('button', 'tab-button', entry.label);
    tab.type = 'button';
    tab.id = prefix + '-tab-' + index;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', prefix + '-panel-' + index);
    const panel = node('div', 'tab-panel');
    panel.id = prefix + '-panel-' + index;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener('click', () => activate(index));
    tabs.push(tab);
    panels.push(panel);
    list.append(tab);
  });

  function activate(index) {
    if (index === activeIndex) return;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].hidden = i !== index;
      panels[i].replaceChildren();
    });
    panels[index].append(entries[index].render());
    activeIndex = index;
    onChange(index);
  }

  list.addEventListener('keydown', event => {
    const current = tabs.indexOf(event.target);
    if (current < 0) return;
    let next;
    if (event.key === 'ArrowRight') next = (current + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    activate(next);
    tabs[next].focus();
  });

  group.append(list, ...panels);
  activate(initialIndex);
  return group;
}

function groupedProjects(projects) {
  const companies = new Map();
  const independent = [];
  projects.forEach(project => {
    const name = partnerName(project);
    if (!name) {
      independent.push(project);
      return;
    }
    const key = name.normalize('NFC').toLocaleLowerCase('pt-BR');
    if (!companies.has(key)) companies.set(key, { name, projects: [] });
    companies.get(key).projects.push(project);
  });
  const companyGroups = Array.from(companies.values());
  companyGroups.forEach((company, index) => { company.open = index === 0; });
  function renderCompanies() {
    if (!companyGroups.length) return node('p', 'state', 'Nenhum projeto com parceria empresarial publicado no momento.');
    const stack = node('div', 'company-groups');
    companyGroups.forEach((company, index) => {
      const group = node('details', 'company-group');
      const withLogo = company.projects.find(project => project.partner.logo);
      const withUrl = company.projects.find(project => project.partner.url);
      const partner = {
        name: company.name,
        logo: withLogo && withLogo.partner.logo,
        url: withUrl && withUrl.partner.url
      };
      const summary = createPartner(partner, 'summary');
      const indicator = node('span', 'company-toggle', '+');
      indicator.setAttribute('aria-hidden', 'true');
      summary.querySelector('.partner-label').append(indicator);
      const content = node('div', 'company-content');
      function update() {
        company.open = group.open;
        indicator.textContent = group.open ? '−' : '+';
        if (group.open && !content.childElementCount) {
          content.append(projectGrid(company.projects, '', false, 'company-' + index));
        } else if (!group.open) content.replaceChildren();
      }
      group.open = company.open;
      update();
      group.addEventListener('toggle', () => { if (group.isConnected) update(); });
      group.append(summary, content);
      stack.append(group);
    });
    return stack;
  }
  return createTabs([
    {
      label: 'Parcerias com empresas',
      render: renderCompanies
    },
    {
      label: 'Projetos do laboratório',
      render: () => projectGrid(independent, 'Nenhum projeto próprio do laboratório publicado no momento.')
    }
  ], 'Tipos de projeto', 'project-tabs', companies.size || !independent.length ? 0 : 1);
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
    container.replaceChildren(groupedProjects(projects));
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
