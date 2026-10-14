import type { Product, PriceResult } from "./types";

/**
 * Рассчитывает новую цену товара на основе цен конкурентов.
 */
export function calculatePrice(product: Product): PriceResult {
  // Оставляем только конкурентов, у которых товар есть в наличии.
  const availableCompetitors = product.competitors.filter(
    (competitor) => competitor.inStock
  );

  // Если конкурентов в наличии нет, устанавливаем максимальную цену.
  if (availableCompetitors.length === 0) {
    return {
      sku: product.sku,
      oldPrice: product.myPrice,
      newPrice: product.maxPrice,
      reason: "NO_COMPETITORS",
    };
  }

  // Находим минимальную цену среди конкурентов в наличии.
  const bestPrice = Math.min(
    ...availableCompetitors.map((competitor) => competitor.price)
  );

  // Становимся дешевле конкурента на величину step.
  const candidate = Math.floor(bestPrice - product.step);

  // Не опускаемся ниже минимально разрешённой цены.
  if (candidate < product.minPrice) {
    return {
      sku: product.sku,
      oldPrice: product.myPrice,
      newPrice: product.minPrice,
      reason: "AT_MIN",
    };
  }

  // Не поднимаемся выше максимально разрешённой цены.
  if (candidate > product.maxPrice) {
    return {
      sku: product.sku,
      oldPrice: product.myPrice,
      newPrice: product.maxPrice,
      reason: "AT_MAX",
    };
  }

  // Кандидат находится в допустимом диапазоне.
  return {
    sku: product.sku,
    oldPrice: product.myPrice,
    newPrice: candidate,
    reason: "UNDERCUT",
  };
}  