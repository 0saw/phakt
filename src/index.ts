const WIDTH = 100
const HEIGHT = 100
const PIECES_X = 3
const PIECES_Y = 3

const HALF_WIDTH = WIDTH / 2
const HALF_HEIGHT = HEIGHT / 2
const IMAGE_WIDTH = WIDTH * PIECES_X
const IMAGE_HEIGHT = HEIGHT * PIECES_Y

const getPiece = (src: string, x: number, y: number): HTMLDivElement => {
  const piece = document.createElement('div')

  piece.className = 'piece'
  piece.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background-image: url(${src});
    background-position: ${-1 * WIDTH * x}px ${-1 * HEIGHT * y}px;
    background-size: ${PIECES_X * 100}% ${PIECES_Y * 100}%;
    transform: translate(0, 0);
    pointer-events: none;
  `

  return piece
}

const distance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
}

let zIndex = 1

void (async () => {
  const game = document.querySelector<HTMLDivElement>('.game')
  const gameArea = document.querySelector<HTMLDivElement>('.game__area')
  const bag = document.querySelector<HTMLDivElement>('.game__bag')

  if (game === null || gameArea === null || bag === null) {
    return
  }

  gameArea.style.width = `${PIECES_X * WIDTH}px`
  gameArea.style.height = `${PIECES_Y * HEIGHT}px`

  const pieces = new Array<HTMLDivElement>()
  for (let y = 0; y < PIECES_Y; y++) {
    for (let x = 0; x < PIECES_X; x++) {
      pieces.push(getPiece(`${process.env.RANDOM_IMAGE_SERVICE}/${IMAGE_WIDTH}/${IMAGE_HEIGHT}`, x, y))
    }
  }

  const placedPieces = new Array<HTMLDivElement | null>(pieces.length).fill(null)
  const piecesBag = [...pieces]
  piecesBag.sort(() => 0.5 - Math.random())
  bag.innerText = `x${piecesBag.length}`

  game.addEventListener('pointerdown', (e) => {
    let piece: HTMLDivElement
    let grabOffsetX = -HALF_WIDTH
    let grabOffsetY = -HALF_HEIGHT
    const bagRect = bag.getBoundingClientRect()
    const gameAreaRect = gameArea.getBoundingClientRect()
    const isInBag = (x: number, y: number): boolean => x >= bagRect.left && x <= bagRect.right && y >= bagRect.top && y <= bagRect.bottom

    if (e.target instanceof HTMLDivElement && e.target.classList.contains('piece')) {
      piece = e.target
      grabOffsetX = -e.offsetX
      grabOffsetY = -e.offsetY

      if (placedPieces.includes(piece)) {
        placedPieces[placedPieces.indexOf(piece)] = null
      }
    } else {
      if (e.target !== bag) {
        return
      }

      const nextPiece = piecesBag.pop()
      bag.innerText = `x${piecesBag.length}`

      if (typeof nextPiece !== 'undefined') {
        piece = nextPiece
        game.append(nextPiece)
      } else {
        return
      }
    }

    piece.style.zIndex = `${zIndex++}`

    const update = (e: PointerEvent): void => {
      bag.classList.toggle('game__bag--active', isInBag(e.x, e.y))

      piece.style.transform = `translate(${Math.min(window.innerWidth - WIDTH, Math.max(0, e.x + grabOffsetX))}px, ${Math.min(window.innerHeight - HEIGHT, Math.max(0, e.y + grabOffsetY))}px)`
    }
    update(e)

    const stop = (e: PointerEvent): void => {
      e.stopPropagation()
      e.stopImmediatePropagation()
      game.removeEventListener('pointermove', update)
      game.removeEventListener('pointerout', onPointerOutStop)
      game.removeEventListener('pointerup', stop)

      const isMouseInBag = isInBag(e.x, e.y)

      piece.style.pointerEvents = isMouseInBag ? 'none' : ''

      if (isMouseInBag) {
        piecesBag.unshift(piece)
        piece.remove()

        bag.classList.remove('game__bag--active')
      }
      bag.innerText = `x${piecesBag.length}`

      const centerX = e.x + grabOffsetX + HALF_WIDTH - gameAreaRect.x
      const centerY = e.y + grabOffsetY + HALF_WIDTH - gameAreaRect.y
      const areaX = Math.floor(centerX / gameAreaRect.width * PIECES_X)
      const areaY = Math.floor(centerY / gameAreaRect.height * PIECES_Y)

      if (
        placedPieces[areaY * PIECES_Y + areaX] === null &&
          centerX >= 0 && centerX <= gameAreaRect.width && centerY >= 0 && centerY <= gameAreaRect.height &&
          distance(
            areaX * WIDTH + HALF_WIDTH,
            areaY * HEIGHT + HALF_HEIGHT,
            centerX,
            centerY
          ) < 24
      ) {
        placedPieces[areaY * PIECES_Y + areaX] = piece
        piece.style.transform = `translate(${gameAreaRect.left + areaX * WIDTH}px, ${gameAreaRect.top + areaY * HEIGHT}px)`
      }

      if (placedPieces.every((piece, index) => pieces[index] === piece)) {
        setTimeout(() => alert('Win, lmao'), 10)
      }

      grabOffsetX = -HALF_WIDTH
      grabOffsetY = -HALF_HEIGHT
    }

    const onPointerOutStop = (e: PointerEvent): void => {
      if (e.relatedTarget === document.documentElement) {
        stop(e)
      }
    }

    game.addEventListener('pointermove', update)
    game.addEventListener('pointerout', onPointerOutStop)
    game.addEventListener('pointerup', stop)
  })
})()

export {}
