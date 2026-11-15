import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createConversationSchema, validateRequest } from '../_shared/validation.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header missing' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate request body with Zod
    const validatedData = await validateRequest(req, createConversationSchema);
    const { origin_type, origin_id, participants, title } = validatedData;

    // Security check: the authenticated caller MUST be one of the participants
    const callerParticipant = participants.find((p) => p.user_id === user.id);
    if (!callerParticipant) {
      return new Response(
        JSON.stringify({ error: 'Forbidden: caller must be a participant of the conversation' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent deduplication exploits: ensure unique user_ids in participants
    const uniqueParticipants = Array.from(
      new Map(participants.map((p) => [p.user_id, p])).values()
    );

    console.log('Creating conversation:', { origin_type, origin_id, title, user_id: user.id });

    // Create conversation
    const { data: conversation, error: convError } = await supabaseClient
      .from('conversations')
      .insert({
        origin_type,
        origin_id,
        title,
        last_activity: new Date().toISOString()
      })
      .select()
      .single();

    if (convError) {
      console.error('Error creating conversation:', convError);
      throw convError;
    }

    console.log('Conversation created:', conversation);

    // Add participants (only caller can claim their own entry; other participants default to 'member'/'consumer')
    const participantInserts = uniqueParticipants.map((p) => ({
      conversation_id: conversation.id,
      user_id: p.user_id,
      role: p.user_id === user.id ? (p.role || 'consumer') : (p.role === 'business' ? 'business' : 'consumer')
    }));

    const { error: participantError } = await supabaseClient
      .from('participants')
      .insert(participantInserts);

    if (participantError) {
      console.error('Error adding participants:', participantError);
      throw participantError;
    }

    // Create system message
    const { error: messageError } = await supabaseClient
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        message_type: 'system',
        content: 'Conversation créée'
      });

    if (messageError) {
      console.error('Error creating system message:', messageError);
    }

    console.log('Conversation setup complete');

    return new Response(
      JSON.stringify({ success: true, conversation }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-conversation:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});