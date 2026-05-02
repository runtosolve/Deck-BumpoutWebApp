import { NextRequest, NextResponse } from 'next/server';
import { SimpleInputs } from '@/lib/types';
import { designSimple } from '@/lib/calculations';

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const bodyObj = body as Record<string, unknown>;
  const requiredFields: (keyof SimpleInputs)[] = ['p_psf', 'j_ft', 'W_ft'];

  const missingFields = requiredFields.filter(
    (f) => bodyObj[f] === undefined || typeof bodyObj[f] !== 'number'
  );

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing or invalid fields: ${missingFields.join(', ')}` },
      { status: 400 }
    );
  }

  const inputs: SimpleInputs = {
    p_psf: bodyObj.p_psf as number,
    j_ft: bodyObj.j_ft as number,
    W_ft: bodyObj.W_ft as number,
  };

  const result = designSimple(inputs);

  if (result.errors.length > 0) {
    return NextResponse.json(result, { status: 422 });
  }

  return NextResponse.json(result, { status: 200 });
}
