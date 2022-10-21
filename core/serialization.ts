import * as borsh from '@project-serum/borsh';

type BorshMethods = keyof typeof borsh;

type DataItem = {
  value: any;
  label: string;
  type: BorshMethods;
};

export function getEncodedBufferFromData(rawData: DataItem[]): { instructionBuffer: Buffer } {
  const struct = rawData.map((item) => borsh?.[item.type](item.label));
  const borshSchema = borsh.struct(struct);

  const buffer = Buffer.alloc(1000);
  const data = rawData.reduce((acc, { label, value }) => ({ ...acc, [label]: value }), {});

  borshSchema.encode(data, buffer);
  const instructionBuffer = buffer.slice(0, borshSchema.getSpan(buffer));

  return { instructionBuffer };
}

export function getEmptyBuffer(): { instructionBuffer: Buffer } {
  const buffer = Buffer.alloc(0);

  return { instructionBuffer: buffer };
}

type SchemaItem = {
  label: string;
  type: BorshMethods;
};

export function getDecodedDataFromBufferAndSchema(schema: SchemaItem[], buffer: Buffer): { result: any } {
  const struct = schema.map((item) => borsh?.[item.type](item.label));
  const borshSchema = borsh.struct(struct);
  const result = borshSchema.decode(buffer);

  return { result };
}
