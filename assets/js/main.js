const { Splitting } = window;
const results = Splitting();
const glitches = '`¡™£¢∞§¶•ªº–≠åß∂ƒ©˙∆˚¬…æ≈ç√∫˜µ≤≥÷/?░▒▓<>/'.split('');

for (let r = 0; r < results.length; r++) {if (window.CP.shouldStopExecution(0)) break;
  const chars = results[r].chars;
  for (let c = 0; c < chars.length; c++) {if (window.CP.shouldStopExecution(1)) break;
    chars[c].style.setProperty('--count', Math.random() * 5 + 1);
    for (let g = 0; g < 10; g++) {if (window.CP.shouldStopExecution(2)) break;
      chars[c].style.setProperty(
      `--char-${g}`,
      `"${glitches[Math.floor(Math.random() * glitches.length)]}"`);

    }window.CP.exitedLoop(2);
  }window.CP.exitedLoop(1);
}window.CP.exitedLoop(0);
window.ScrollOut({
  scrollingElement: '.container',
  targets: 'p' });