export * from './game'

/**
 * Возвращает растояние между двумя точками
 */
export const getDistance = (x1: number, y1: number, x2: number, y2: number): number => (
  ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5
)

/**
 * Проверяет, попадает ли точка в элемент
 */
export const isIntersecting = (element: Element, x: number, y: number): boolean => {
  const elementRect = element.getBoundingClientRect()

  return x >= elementRect.left && x <= elementRect.right && y >= elementRect.top && y <= elementRect.bottom
}
