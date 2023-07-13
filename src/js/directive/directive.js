export default function setUpDirective(app) {
  const mousemoveHandler = (event, binding, appTooltip) => {
    appTooltip.innerHTML = binding.value;
    let p = 20;
    if (binding.arg == "top") p = -50;
    appTooltip.style.top = event.clientY + p + "px";
    appTooltip.style.left = event.clientX - 20 + "px";
    appTooltip.style.display = "block";
  };

  app.directive("tooltip", {
    mounted: (el, binding) => {
      if (binding.value == null || binding.value.length == 0) return;
      const appTooltip = document.getElementsByClassName("app__tooltip")[0];
      // const position = binding.arg;
      el.addEventListener("mousemove", (event) => {
        mousemoveHandler(event, binding, appTooltip);
      });
      el.addEventListener("mouseleave", () => {
        appTooltip.style.display = "none";
      });
    },
    beforeUnmount: (el, binding) => {
      if (binding.value == null || binding.value.length == 0) return;
      const appTooltip = document.getElementsByClassName("app__tooltip")[0];
      appTooltip.style.display = "none";
      el.removeEventListener("mousemove", (event) => {
        mousemoveHandler(event, binding, appTooltip);
      });
      el.removeEventListener("mouseout", () => {
        appTooltip.style.display = "none";
      });
    },
  });
}
