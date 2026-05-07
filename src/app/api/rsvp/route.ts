import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { error } = await supabase.from('rsvps').insert({
      nome_convidado: body.nome_convidado,
      familia: body.familia,
      presenca: body.presenca,
      mensagem: body.mensagem
    });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
