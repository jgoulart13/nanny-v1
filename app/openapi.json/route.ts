// /openapi.json: OpenAPI 3.1 description of GET /api/estimate (lib/openapi.ts).
import { buildOpenApi } from "@/lib/openapi";

export function GET() {
  return Response.json(buildOpenApi(), {
    headers: { "Access-Control-Allow-Origin": "*", "Cache-Control": "public, s-maxage=86400" },
  });
}
