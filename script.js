const toast = document.querySelector(".toast");
const copyButtons = document.querySelectorAll("[data-copy]");
const navLinks = document.querySelectorAll(".nav a");
const menuButton = document.querySelector(".menu");
const header = document.querySelector(".site-header");
const sections = document.querySelectorAll("main section");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");
const modalList = document.querySelector(".modal-list");

const projectDetails = {
  sic: {
    title: "전기기사",
    body: "기초 이론을 탄탄히 쌓고 실기 대비를 병행하며 준비하고 있습니다.",
    bullets: ["이론 요약 노트", "기출 문제 풀이", "실기 대비 계획"],
  },
  thermal: {
    title: "컴퓨터활용능력",
    body: "데이터 정리와 문서화 역량을 강화하기 위해 취득했습니다.",
    bullets: ["스프레드시트 활용", "보고서 템플릿 제작", "자료 시각화"],
  },
  dashboard: {
    title: "한국사능력검정",
    body: "기본 소양을 다지기 위해 학습하고 취득했습니다.",
    bullets: ["핵심 흐름 정리", "시대별 비교", "요약 노트 작성"],
  },
};

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
};

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy");
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      showToast("복사되었습니다.");
    } catch (error) {
      showToast("복사를 지원하지 않는 환경입니다.");
    }
  });
});

const updateActiveLink = () => {
  const scrollY = window.scrollY + 120;
  sections.forEach((section) => {
    const id = section.getAttribute("id");
    if (!id) return;
    const offsetTop = section.offsetTop;
    const offsetBottom = offsetTop + section.offsetHeight;
    const link = document.querySelector(`.nav a[href="#${id}"]`);
    if (!link) return;
    if (scrollY >= offsetTop && scrollY < offsetBottom) {
      navLinks.forEach((nav) => nav.classList.remove("active"));
      link.classList.add("active");
    }
  });
};

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);

if (menuButton && header) {
  menuButton.addEventListener("click", () => {
    header.classList.toggle("open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("open");
    });
  });
}

const revealSection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
};

const sectionObserver = new IntersectionObserver(revealSection, {
  threshold: 0.2,
});

sections.forEach((section) => {
  sectionObserver.observe(section);
});

const openModal = (projectKey) => {
  if (!modal || !modalTitle || !modalBody || !modalList) return;
  const detail = projectDetails[projectKey];
  if (!detail) return;

  modalTitle.textContent = detail.title;
  modalBody.textContent = detail.body;
  modalList.innerHTML = "";
  detail.bullets.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    modalList.appendChild(item);
  });
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
};

const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  const button = card.querySelector(".link");
  const key = card.getAttribute("data-project");
  if (!button || !key) return;
  button.addEventListener("click", () => openModal(key));
});

if (modal) {
  modal.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.closest("[data-close]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}
