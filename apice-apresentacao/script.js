// Ápice | Apresentação do Projeto Final
// Menu mobile, link ativo na navegação, animação de entrada e contadores.

const botaoMenu = document.querySelector(".menu-botao");
const menu = document.getElementById("menu");
const linksMenu = menu.querySelectorAll("a");

// Abre e fecha o menu no celular
function alternarMenu(abrir) {
  const deveAbrir = typeof abrir === "boolean" ? abrir : !menu.classList.contains("aberto");
  menu.classList.toggle("aberto", deveAbrir);
  botaoMenu.setAttribute("aria-expanded", String(deveAbrir));
  botaoMenu.querySelector(".sr").textContent = deveAbrir ? "Fechar menu" : "Abrir menu";
}

botaoMenu.addEventListener("click", () => alternarMenu());

for (const link of linksMenu) {
  link.addEventListener("click", () => alternarMenu(false));
}

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menu.classList.contains("aberto")) {
    alternarMenu(false);
    botaoMenu.focus();
  }
});

// Marca na navegação a seção que está na tela
const secoes = document.querySelectorAll("main > section[id]");

function marcarLinkAtivo(id) {
  for (const link of linksMenu) {
    const ativo = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("ativo", ativo);
    if (ativo) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

// Conta de 0 até o valor final em cerca de 1 segundo
function animarContador(elemento) {
  const alvo = Number(elemento.dataset.contador);
  const sufixo = elemento.dataset.sufixo || "";
  const duracao = 1000;
  let inicio = null;

  function passo(tempo) {
    if (inicio === null) inicio = tempo;
    const progresso = Math.min((tempo - inicio) / duracao, 1);
    elemento.textContent = Math.round(alvo * progresso) + sufixo;
    if (progresso < 1) requestAnimationFrame(passo);
  }

  requestAnimationFrame(passo);
}

const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const contadores = document.querySelectorAll("[data-contador]");

if ("IntersectionObserver" in window) {
  const observadorSecoes = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        if (entrada.isIntersecting) marcarLinkAtivo(entrada.target.id);
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  secoes.forEach((secao) => observadorSecoes.observe(secao));

  const observadorEntrada = new IntersectionObserver(
    (entradas, observador) => {
      for (const entrada of entradas) {
        if (!entrada.isIntersecting) continue;
        entrada.target.classList.add("visivel");
        observador.unobserve(entrada.target);
      }
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".cartao, .passos li, .tags").forEach((elemento) => {
    elemento.classList.add("revelar");
    observadorEntrada.observe(elemento);
  });
}

// Contadores: animados, ou direto no valor final se o usuário prefere menos movimento
for (const contador of contadores) {
  if (reduzirMovimento) {
    contador.textContent = contador.dataset.contador + (contador.dataset.sufixo || "");
  } else {
    animarContador(contador);
  }
}

// Ano atual no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();
