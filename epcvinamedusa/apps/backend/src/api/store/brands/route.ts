import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query");
  const { data: brands } = await query.graph({
    entity: "brand",
    fields: ["id", "handle", "name", "description", "image", "rank"],
  });

  res.json({
    brands: (brands || []).sort((a: any, b: any) => (a.rank || 0) - (b.rank || 0)),
  });
}
