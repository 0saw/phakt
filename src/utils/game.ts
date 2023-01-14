/**
 * Ограничивает значение сверху и снизу
 */
export const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n))

/**
 * Передвигает элемент при этом учитывает границы экрана и возможный offset, заданный на элементе
 */
export const move = (element: HTMLElement, x: number, y: number): void => {
  const offsetX = parseFloat(element.dataset.offsetX ?? '0')
  const offsetY = parseFloat(element.dataset.offsetY ?? '0')

  element.style.transform = `translate(
    ${clamp(x - offsetX, 0, window.innerWidth - element.clientWidth) - window.innerWidth / 2 + window.scrollX}px, 
    ${clamp(y - offsetY, 0, window.innerHeight - element.clientHeight) - window.innerHeight / 2 + window.scrollY}px
  )`
}

/**
 * Получает кусочек пазла
 */
export const getPiece = (
  src: string,
  width: number,
  height: number,
  tilesCountX: number,
  tilesCountY: number,
  tileX: number,
  tileY: number
): HTMLDivElement => {
  const piece = document.createElement('div')

  piece.dataset.piece = 'true'
  piece.hidden = true
  piece.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    width: ${width}px;
    height: ${height}px;
    background-image: url(${src});
    background-position: ${-width * tileX}px ${-height * tileY}px;
    background-size: ${tilesCountX * 100}% ${tilesCountY * 100}%;
    transform: translate(0, 0);
    user-select: none;
  `

  return piece
}

let didWin = false
export const checkWin = (scene: HTMLElement[]): void => {
  if (!didWin && scene.every((element) => element.dataset.correct === 'true')) {
    didWin = true
    alert('Pobeda')
  }
}
