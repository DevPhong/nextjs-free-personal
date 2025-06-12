import productApiRequest from "@/apiRequests/product";
import React from "react";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product = null;
  try {
    const { payload } = await productApiRequest.getDetail(Number(id));
    product = payload.data;
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      {!product && "Không tìm thấy sản phẩm"}
      {product && product.name}
    </div>
  );
}
