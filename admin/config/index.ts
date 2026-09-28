import { customerConfig } from "./customerConfig";
import { productConfig } from "./productConfig";
import { orderConfig } from "./orderConfig";
import { categoryConfig } from "./categoryConfig";
import { couponConfig } from "./couponConfig";
import { reviewConfig } from "./reviewConfig";
import { mediaConfig } from "./mediaConfig";
import {brandConfig} from "./brandConfig"

export function getRouteConfigByPath(pathname: string) {
  const route = pathname.split("/").filter(Boolean)[0] || "";

  switch (route) {
    case "customers":
    case "customer":
      return customerConfig;

    case "products":
    case "product":
      return productConfig;

    case "orders":
    case "order":
      return orderConfig;

    case "categories":
    case "category":
      return categoryConfig;

    case "coupons":
    case "coupon":
      return couponConfig;
    case "brands":
    case "brand":
      return brandConfig;

    case "reviews":
    case "review":
      return reviewConfig;

    case "media":
      return mediaConfig;

    default:
      return customerConfig;
  }
}