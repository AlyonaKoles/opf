const form = document.getElementById("business-form");
const questions = [...document.querySelectorAll(".question")];
const nextBtn = document.getElementById("next-btn");
const backBtn = document.getElementById("back-btn");
const submitBtn = document.getElementById("submit-btn");
const progressLabel = document.getElementById("progress-label");
const progressBar = document.getElementById("progress-bar");
const resultSection = document.getElementById("result");
let currentStep = 0;

function updateStep() {
  questions.forEach((q, i) => q.classList.toggle("active", i === currentStep));
  progressLabel.textContent = `Вопрос ${currentStep + 1} из ${questions.length}`;
  progressBar.style.width = `${((currentStep + 1) / questions.length) * 100}%`;
  backBtn.disabled = currentStep === 0;
  nextBtn.classList.toggle("hidden", currentStep === questions.length - 1);
  submitBtn.classList.toggle("hidden", currentStep !== questions.length - 1);
}
function selectedValue(name) {
  return form.querySelector(`input[name="${name}"]:checked`)?.value;
}
function currentQuestionAnswered() {
  const name = questions[currentStep].querySelector('input[type="radio"]').name;
  if (!selectedValue(name)) {
    questions[currentStep].classList.add("shake");
    setTimeout(() => questions[currentStep]?.classList.remove("shake"), 350);
    return false;
  }
  return true;
}
nextBtn.addEventListener("click", () => {
  if (!currentQuestionAnswered()) return;
  currentStep = Math.min(currentStep + 1, questions.length - 1);
  updateStep();
});
backBtn.addEventListener("click", () => {
  currentStep = Math.max(currentStep - 1, 0);
  updateStep();
});

const profiles = {
  ip: {
    abbr: "ИП",
    name: "Индивидуальный предприниматель",
    symbol: "↗",
    description:
      "Физическое лицо, зарегистрированное для ведения предпринимательской деятельности. Это простой вариант для самостоятельного малого бизнеса, но предприниматель отвечает по обязательствам своим имуществом с учётом установленных законом исключений.",
    advantages: [
      "Можно вести бизнес одному, без партнёров.",
      "Как правило, проще регистрация и управление.",
      "Не требуется уставный капитал.",
    ],
  },
  ooo: {
    abbr: "ООО",
    name: "Общество с ограниченной ответственностью",
    symbol: "◎",
    description:
      "Юридическое лицо, уставный капитал которого разделён на доли участников. Подходит для малого и среднего бизнеса, совместного владения и проектов, которым важна обособленность бизнеса от личного имущества участников.",
    advantages: [
      "Можно создать одному или нескольким участникам (до 50).",
      "Участники обычно не отвечают по обязательствам общества и рискуют стоимостью долей, кроме предусмотренных законом случаев.",
      "Удобно распределять доли и закреплять договорённости между партнёрами.",
    ],
  },
  ao: {
    abbr: "АО",
    name: "Акционерное общество",
    symbol: "▤",
    description:
      "Хозяйственное общество, капитал которого разделён на акции. Такая структура может быть уместна для крупного проекта или бизнеса, который планирует привлекать капитал через выпуск и размещение акций.",
    advantages: [
      "Акционерная структура позволяет оформлять участие через акции.",
      "Подходит для проектов с большим числом инвесторов.",
      "Акционеры обычно несут риск в пределах стоимости принадлежащих им акций, кроме установленных законом случаев.",
    ],
  },
  coop: {
    abbr: "ПК",
    name: "Производственный кооператив",
    symbol: "⚙",
    description:
      "Добровольное объединение граждан на основе членства для совместной производственной или иной хозяйственной деятельности, основанной на личном трудовом участии и объединении паевых взносов.",
    advantages: [
      "Подходит для совместной работы участников в производстве.",
      "Участники объединяют паевые взносы и трудовое участие.",
      "Позволяет организовать коллективное управление по кооперативному принципу.",
    ],
  },
};

function recommend(a) {
  const score = { ip: 0, ooo: 0, ao: 0, coop: 0 };
  const reasons = { ip: [], ooo: [], ao: [], coop: [] };
  const add = (key, points, reason) => {
    score[key] += points;
    if (reason) reasons[key].push(reason);
  };

  if (a.founders === "1") {
    add(
      "ip",
      5,
      "Один учредитель: ИП позволяет вести деятельность самостоятельно.",
    );
    add("ooo", 3, "ООО также может быть создано одним участником.");
    add("ao", 1);
  } else if (a.founders === "2-4") {
    add("ooo", 5, "Несколько партнёров могут распределить доли участия в ООО.");
    add("ao", 2);
    add(
      "ip",
      -8,
      "ИП не подходит для совместного владения: у ИП не бывает соучредителей.",
    );
  } else {
    add(
      "coop",
      5,
      "Для производственного кооператива требуется не менее пяти членов.",
    );
    add("ao", 3, "АО может учитывать участие большого числа акционеров.");
    add("ooo", 2);
    add(
      "ip",
      -8,
      "ИП не предусматривает совместное владение несколькими учредителями.",
    );
  }

  if (a.scale === "small") {
    add(
      "ip",
      3,
      "Небольшой масштаб часто сочетается с самостоятельной работой ИП.",
    );
    add("ooo", 2);
  } else if (a.scale === "medium") {
    add(
      "ooo",
      4,
      "ООО часто используют для малого и среднего бизнеса с командой и партнёрами.",
    );
    add("coop", 1);
  } else {
    add(
      "ao",
      5,
      "Крупный масштаб может потребовать более сложной корпоративной структуры.",
    );
    add("ooo", 2);
  }

  if (a.investment === "yes") {
    add(
      "ao",
      6,
      "План привлечения инвестиций повышает значимость акционерной формы.",
    );
    add(
      "ooo",
      2,
      "ООО может привлекать участников и инвестиции, хотя механизм отличается от выпуска акций.",
    );
  } else if (a.investment === "maybe") {
    add(
      "ooo",
      3,
      "ООО оставляет возможность принять новых участников с соблюдением закона и устава.",
    );
    add(
      "ao",
      3,
      "АО стоит рассмотреть, если в будущем планируется привлечение инвестиций через акции.",
    );
  } else {
    add("ip", 2);
    add("ooo", 2);
    add("coop", 1);
  }

  if (a.liability === "limited") {
    add(
      "ooo",
      5,
      "Предпочтение ограниченной ответственности соответствует общей модели ответственности участников ООО.",
    );
    add(
      "ao",
      4,
      "В АО акционеры обычно несут риск в пределах стоимости акций.",
    );
    add(
      "ip",
      -2,
      "ИП отвечает по обязательствам своим имуществом, поэтому хуже соответствует этому критерию.",
    );
  } else {
    add(
      "ip",
      4,
      "Вы готовы к личной имущественной ответственности, характерной для ИП.",
    );
    add(
      "coop",
      2,
      "Члены производственного кооператива несут субсидиарную ответственность в предусмотренных законом и уставом пределах.",
    );
  }

  if (a.activity === "production") {
    add(
      "coop",
      5,
      "Производственная деятельность особенно сочетается с кооперативной моделью при личном трудовом участии членов.",
    );
    add("ooo", 2);
  } else if (a.activity === "trade") {
    add(
      "ooo",
      3,
      "ООО — универсальный вариант для торговли, в том числе при работе с партнёрами.",
    );
    add("ip", 2);
  } else if (a.activity === "services") {
    add("ip", 3, "ИП часто подходит для самостоятельного оказания услуг.");
    add("ooo", 2);
  } else if (a.activity === "it") {
    add(
      "ooo",
      3,
      "ООО подходит для IT-проекта с командой и распределением долей.",
    );
    add("ao", 2);
    add("ip", 1);
  }

  if (a.founders !== "5+") score.coop = Math.min(score.coop, 0);
  if (a.activity !== "production") score.coop -= 3;

  const sorted = Object.entries(score).sort((x, y) => y[1] - x[1]);
  const winner = sorted[0][0];
  const second = sorted[1][0];
  const max = Math.max(1, sorted[0][1]);
  const min = Math.min(0, ...Object.values(score));
  const fit = Math.max(
    55,
    Math.min(98, Math.round(68 + (max - Math.max(0, sorted[1][1])) * 2.5)),
  );
  const winnerReasons = reasons[winner].length
    ? reasons[winner]
    : [
        "Выбранная форма получила наибольшее количество баллов по совокупности ответов.",
      ];

  return { winner, second, score, reasons: winnerReasons, fit, sorted };
}

function renderResult(data) {
  const result = recommend(data);
  const profile = profiles[result.winner];
  document.getElementById("result-abbr").textContent = profile.abbr;
  document.getElementById("result-name").textContent = profile.name;
  document.getElementById("result-symbol").textContent = profile.symbol;
  document.getElementById("result-description").textContent =
    profile.description;
  document.getElementById("fit-score").textContent = `${result.fit}%`;
  document.getElementById("fit-bar").style.width = `${result.fit}%`;

  const reasons = document.getElementById("reasons");
  reasons.innerHTML = "";
  result.reasons.slice(0, 4).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    reasons.appendChild(li);
  });
  const advantages = document.getElementById("advantages");
  advantages.innerHTML = "";
  profile.advantages.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    advantages.appendChild(li);
  });

  const alt = document.getElementById("alternatives");
  alt.innerHTML = "";
  alt.className = "alternative-list";
  result.sorted.slice(1, 4).forEach(([key, points], index) => {
    const alternative = profiles[key];
    const item = document.createElement("article");
    item.className = "alternative";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "alternative-toggle";
    toggle.setAttribute("aria-expanded", "false");

    const titleBlock = document.createElement("span");
    titleBlock.className = "alternative-title";
    const abbreviation = document.createElement("b");
    abbreviation.textContent = alternative.abbr;
    const name = document.createElement("small");
    name.textContent = alternative.name;
    titleBlock.append(abbreviation, name);

    const toggleSide = document.createElement("span");
    toggleSide.className = "alternative-toggle-side";
    const score = document.createElement("small");
    score.className = "alternative-score";
    score.textContent = `${Math.max(0, points)} балл.`;
    const arrow = document.createElement("span");
    arrow.className = "alternative-arrow";
    arrow.textContent = "＋";
    toggleSide.append(score, arrow);
    toggle.append(titleBlock, toggleSide);

    const details = document.createElement("div");
    details.className = "alternative-details";
    details.hidden = true;

    const description = document.createElement("p");
    description.className = "alternative-description";
    description.textContent = alternative.description;
    const benefitsTitle = document.createElement("strong");
    benefitsTitle.className = "alternative-benefits-title";
    benefitsTitle.textContent = "Преимущества";
    const benefits = document.createElement("ul");
    alternative.advantages.forEach((benefit) => {
      const li = document.createElement("li");
      li.textContent = benefit;
      benefits.appendChild(li);
    });
    details.append(description, benefitsTitle, benefits);

    toggle.addEventListener("click", () => {
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isExpanded));
      details.hidden = isExpanded;
      arrow.textContent = isExpanded ? "＋" : "−";
      item.classList.toggle("expanded", !isExpanded);
    });

    item.append(toggle, details);
    alt.appendChild(item);
  });
  document.getElementById("quiz").classList.add("hidden");
  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentQuestionAnswered()) return;
  const data = {
    activity: selectedValue("activity"),
    scale: selectedValue("scale"),
    founders: selectedValue("founders"),
    investment: selectedValue("investment"),
    liability: selectedValue("liability"),
  };
  if (Object.values(data).some((value) => !value)) return;
  renderResult(data);
});

document.getElementById("reset-btn").addEventListener("click", () => {
  form.reset();
  currentStep = 0;
  updateStep();
  resultSection.classList.add("hidden");
  document.getElementById("quiz").classList.remove("hidden");
  document
    .getElementById("quiz")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});
updateStep();
