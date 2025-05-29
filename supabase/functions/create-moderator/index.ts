
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== CREATE MODERATOR FUNCTION STARTED ===')
    
    // Create a Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create regular client for user authentication check
    const authHeader = req.headers.get('Authorization')!
    console.log('Auth header present:', !!authHeader)
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the current user is an admin
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('User authentication error:', userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Please log in again' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Authenticated user:', user.id)

    // Check if user is admin using the database function
    const { data: isAdminResult, error: adminError } = await supabase
      .rpc('is_admin', { _user_id: user.id })

    if (adminError) {
      console.error('Admin check error:', adminError)
      return new Response(
        JSON.stringify({ error: 'Error checking admin status', details: adminError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!isAdminResult) {
      console.error('User is not admin:', user.id)
      return new Response(
        JSON.stringify({ error: 'Access denied - Admin privileges required' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Admin verification passed')

    const requestBody = await req.json()
    console.log('Request body received:', requestBody)
    
    const { email, password, username } = requestBody

    if (!email || !password || !username) {
      console.error('Missing required fields:', { email: !!email, password: !!password, username: !!username })
      return new Response(
        JSON.stringify({ error: 'Email, password, and username are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Creating moderator account for:', email, 'username:', username)

    // Create the user account using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username
      },
      email_confirm: true
    })

    if (authError) {
      console.error('Error creating user:', authError)
      let errorMessage = authError.message
      
      if (authError.message?.includes('User already registered')) {
        errorMessage = 'A user with this email already exists'
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!authData.user) {
      console.error('User creation failed - no user returned')
      return new Response(
        JSON.stringify({ error: 'User creation failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User created successfully:', authData.user.id)

    // Create profile entry using admin client
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: username
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      // Try to clean up the created user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log('Cleaned up user after profile creation failure')
      } catch (cleanupError) {
        console.error('Failed to cleanup user:', cleanupError)
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to create user profile', details: profileError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Profile created successfully')

    // Assign moderator role using admin client - use string instead of enum cast
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authData.user.id,
        role: 'moderator'
      })

    if (roleError) {
      console.error('Error assigning moderator role:', roleError)
      
      // Try to clean up the created user and profile if role assignment fails
      try {
        await supabaseAdmin.from('profiles').delete().eq('id', authData.user.id)
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log('Cleaned up user and profile after role assignment failure')
      } catch (cleanupError) {
        console.error('Failed to cleanup user and profile:', cleanupError)
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to assign moderator role', details: roleError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Moderator role assigned successfully')
    console.log('=== CREATE MODERATOR FUNCTION COMPLETED SUCCESSFULLY ===')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Moderator ${username} created successfully`,
        user_id: authData.user.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in create-moderator function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
