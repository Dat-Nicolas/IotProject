export class CreateBrandDto {
  name!: string;
  irProtocol!: string;
  irConfig!: Record<string, unknown>;
  logoUrl?: string;
}
