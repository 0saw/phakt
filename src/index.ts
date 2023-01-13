import { getPiece, getDistance, isIntersecting, move, checkWin } from './utils'

const PIECE_COUNT_X = 3
const PIECE_COUNT_Y = 2
const PIECE_WIDTH = 120
const PIECE_HEIGHT = 100
const IMAGE = `${process.env.RANDOM_IMAGE_SERVICE}/${PIECE_WIDTH * PIECE_COUNT_X}/${PIECE_HEIGHT * PIECE_COUNT_Y}`

const game = document.querySelector<HTMLDivElement>('.game')
const gameArea = document.querySelector<HTMLDivElement>('.game__area')
const bag = document.querySelector<HTMLDivElement>('.game__bag')

// Хранит значение z-index последнего передвинутого элемента
let zIndex = 1

if (game === null || gameArea === null || bag === null) {
  throw Error('No game area found')
}

gameArea.style.width = `${PIECE_WIDTH * PIECE_COUNT_X}px`
gameArea.style.height = `${PIECE_HEIGHT * PIECE_COUNT_Y}px`

const scene = new Array<HTMLDivElement>()

for (let y = 0; y < PIECE_COUNT_Y; y++) {
  for (let x = 0; x < PIECE_COUNT_X; x++) {
    const piece = getPiece(IMAGE, PIECE_WIDTH, PIECE_HEIGHT, PIECE_COUNT_X, PIECE_COUNT_Y, x, y)

    scene.push(piece)
    game.append(piece)
  }
}

const onPointerMove = (e: PointerEvent): void => {
  bag.classList.toggle('game__bag--active', isIntersecting(bag, e.x, e.y))

  if (!(e.target instanceof HTMLDivElement && 'piece' in e.target.dataset)) {
    return
  }

  move(e.target, e.x, e.y)
}

const onPointerUp = (e: PointerEvent): void => {
  game.removeEventListener('pointermove', onPointerMove)
  game.removeEventListener('pointerup', onPointerUp)

  bag.classList.remove('game__bag--active')

  if (!(e.target instanceof HTMLDivElement && 'piece' in e.target.dataset)) {
    return
  }

  const piece = e.target
  piece.dataset.offsetX = '0'
  piece.dataset.offsetY = '0'

  if (isIntersecting(bag, e.x, e.y)) {
    piece.hidden = true
  }

  const gameAreaRect = gameArea.getBoundingClientRect()
  const pieceRect = piece.getBoundingClientRect()
  const pieceCenterRelativeToGameAreaX = pieceRect.left - gameAreaRect.left + pieceRect.width / 2
  const pieceCenterRelativeToGameAreaY = pieceRect.top - gameAreaRect.top + pieceRect.height / 2
  const totalTilesX = Math.round(gameAreaRect.width / pieceRect.width)
  const totalTilesY = Math.round(gameAreaRect.height / pieceRect.height)
  const tileX = Math.floor(pieceCenterRelativeToGameAreaX / gameAreaRect.width * totalTilesX)
  const tileY = Math.floor(pieceCenterRelativeToGameAreaY / gameAreaRect.height * totalTilesY)

  if (
    tileX >= 0 && tileX < totalTilesX && tileY >= 0 && tileY < totalTilesY &&
    getDistance(
      tileX * pieceRect.width + pieceRect.width / 2, tileY * pieceRect.height + pieceRect.height / 2,
      pieceCenterRelativeToGameAreaX, pieceCenterRelativeToGameAreaY
    ) < 0.15 * getDistance(
      pieceRect.left, pieceRect.top,
      pieceRect.right, pieceRect.bottom
    )
  ) {
    piece.dataset.correct = scene[tileY * totalTilesX + tileX] === piece ? 'true' : 'false'

    move(piece, gameAreaRect.left + tileX * pieceRect.width, gameAreaRect.top + tileY * pieceRect.height)
    checkWin(scene)
  }
}

const onPointerDown = (e: PointerEvent): void => {
  let piece: HTMLDivElement | undefined
  let offsetX = e.offsetX
  let offsetY = e.offsetY

  if (isIntersecting(bag, e.x, e.y)) {
    const availablePieces = scene
      .filter((element) => element.hidden)
      .sort(() => Math.random() - 0.5)
    const nextPiece = availablePieces.pop()

    if (typeof nextPiece !== 'undefined') {
      piece = nextPiece
      offsetX = nextPiece.clientWidth / 2
      offsetY = nextPiece.clientHeight / 2
    }
  } else if (e.target instanceof HTMLDivElement && 'piece' in e.target.dataset) {
    piece = e.target
  }

  if (typeof piece === 'undefined') {
    return
  }

  piece.hidden = false
  piece.dataset.offsetX = `${offsetX}`
  piece.dataset.offsetY = `${offsetY}`
  piece.style.zIndex = `${zIndex++}`
  piece.setPointerCapture(e.pointerId)
  move(piece, e.x, e.y)

  game.addEventListener('pointermove', onPointerMove)
  game.addEventListener('pointerup', onPointerUp)
}

game.addEventListener('pointerdown', onPointerDown)
