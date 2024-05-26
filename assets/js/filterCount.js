document.addEventListener("DOMContentLoaded", () => {
  const filtroCount = document.querySelector(".icone-filtro-contador");
  const tipoSelect = document.getElementById("tipo");
  const quantidadeSelect = document.getElementById("quantidade");
  const deInput = document.getElementById("de");
  const ateInput = document.getElementById("ate");
  const form = document.querySelector(".dialog-filtro-form");

  function updateFiltroCount() {
    let count = 0;

    if (tipoSelect.value !== "") count++;
    if (quantidadeSelect.value !== "0" && quantidadeSelect.value !== "")
      count++;
    if (deInput.value) count++;
    if (ateInput.value) count++;

    filtroCount.textContent = count;
  }

  form.addEventListener("change", updateFiltroCount);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateFiltroCount();
  });

  updateFiltroCount();
});
