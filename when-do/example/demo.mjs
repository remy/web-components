// init the web component
import '../when-do.mjs';

const controls = $('#controls');
const code = $('#result code');
const output = $('#out');
const test = $('#test');
const time = $('time');

function getDate(time) {
  return new Date(time).toISOString().replace(/\.\d\d\dZ/, 'Z');
}

function secondsToDate(seconds) {
  const time = Date.now();
  return getDate(time + seconds * 1000);
}

function $(selector) { return document.querySelector(selector); }

function updateTime() { time.textContent = getDate(Date.now()); }

function updateCode() {
  const whatValue = $('#what-select').value;
  const start = parseInt($('#start-date').value, 10);
  const end = parseInt($('#end-date').value || "0", 10);
  const startDate = secondsToDate(start);
  const endDate = secondsToDate(end + start);
  const applyClass = $('#apply-class').checked ? 'fade-in' : '';

  let codeHTML = `<when-do what="${whatValue}" datetime="${startDate}`;
  if (end) {
    codeHTML += ` ${endDate}`;
  }
  codeHTML += `"`;
  if (applyClass) {
    codeHTML += ` apply="${applyClass}"`;
  }
  codeHTML += `>\n  <p>This content will be ${whatValue} in ${start} seconds and ${end ? `end after ${end} seconds` : 'does not have an end'}.<\/p>\n<\/when-do>`;

  if (applyClass) {
    codeHTML += `\n\n<style>
  when-do[what='${whatValue}'][apply='${applyClass}'] {
    * {
      transition: opacity 0.5s ease-in-out;
      opacity: 0;
    }

    &.${applyClass} * {
      opacity: 1;
    }
  }
</style>`;
  }

  if (whatValue === 'scroll') {
    codeHTML += `\n\n<style>
  when-do[what='scroll'] {
    p {
      margin-top: 50vw;
    }
  }
</style>`;
  }

  code.innerHTML = codeHTML.replace(/>/g, '&gt;').replace(/</g, '&lt;');
}

test.onclick = () => {
  updateCode();
  if ($('when-do')) {
    $('when-do').remove();
  }
  output.innerHTML = code.textContent;
}

controls.oninput = updateCode;
updateCode();
setInterval(updateTime, 500);