import productApiRequest from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import { undefinedDataA } from "@hookform/resolvers/ajv/src/__tests__/__fixtures__/data-errors.js";
import React from "react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product = undefined;
  try {
    const { payload } = await productApiRequest.getDetail(Number(id));
    product = payload.data;
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      {!product && "Không tìm thấy sản phẩm"}
      <ProductAddForm product={product} />
    </div>
  );
}
