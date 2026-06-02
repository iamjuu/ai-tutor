'use server';

import {auth} from "@clerk/nextjs/server";
import {createSupabaseClient} from "@/lib/supabase";
import { revalidatePath } from "next/cache";

const FREE_VOICE_SESSION_LIMIT = 3;

const getSupabaseToken = async () => {
    const { getToken } = await auth();
    const token = await getToken({ template: 'supabase' });

    if(!token) {
        throw new Error('Missing Supabase auth token. Configure a Clerk JWT template named "supabase".');
    }

    return token;
}

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();

    if(!author) throw new Error('You must be signed in to create a companion');

    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase
        .from('companions')
        .insert({...formData, author })
        .select();

    if(error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];
}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {
    const { userId } = await auth();

    if(!userId) return [];

    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);

    let query = supabase.from('companions').select().eq('author', userId);

    if(subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if(subject) {
        query = query.ilike('subject', `%${subject}%`)
    } else if(topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if(error) {
        console.error('Supabase query error:', error);
        throw new Error(`Failed to fetch companions: ${error.message}`);
    }

    return companions || [];
}

export const getCompanion = async (id: string) => {
    const { userId } = await auth();

    if(!userId) return null;

    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('id', id)
        .eq('author', userId);

    if(error) return console.log(error);

    return data?.[0] ?? null;
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    if(!userId) throw new Error('You must be signed in to start a session');

    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })

    if(error) throw new Error(error.message);

    return data;
}

export const startVoiceSession = async (companionId: string) => {
    const { userId, has } = await auth();
    if(!userId) throw new Error('You must be signed in to start a session');

    if(has({ plan: 'pro' })) {
        await addToSessionHistory(companionId);
        return {
            allowed: true,
            remaining: null,
        };
    }

    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);

    const { count, error: countError } = await supabase
        .from('session_history')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)

    if(countError) throw new Error(countError.message);

    if((count ?? 0) >= FREE_VOICE_SESSION_LIMIT) {
        return {
            allowed: false,
            remaining: 0,
        };
    }

    const { error: insertError } = await supabase.from('session_history')
        .insert({
            companion_id: companionId,
            user_id: userId,
        })

    if(insertError) throw new Error(insertError.message);

    return {
        allowed: true,
        remaining: Math.max(FREE_VOICE_SESSION_LIMIT - ((count ?? 0) + 1), 0),
    };
}

export const getRecentSessions = async (limit = 10) => {
    const { userId } = await auth();

    if(!userId) return [];

    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserSessions = async (userId: string, limit = 10) => {
    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase
        .from('session_history')
        .select(`companions:companion_id (*)`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if(error) throw new Error(error.message);

    return data.map(({ companions }) => companions);
}

export const getUserCompanions = async (userId: string) => {
    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);
    const { data, error } = await supabase
        .from('companions')
        .select()
        .eq('author', userId)

    if(error) throw new Error(error.message);

    return data;
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();

    if(!userId) return false;

    let limit = 0;

    if(has({ plan: 'pro' })) {
        return true;
    } else if(has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if(has({ feature: "10_companion_limit" })) {
        limit = 10;
    }

    const token = await getSupabaseToken();
    const supabase = createSupabaseClient(token);

    const { data, error } = await supabase
        .from('companions')
        .select('id', { count: 'exact' })
        .eq('author', userId)

    if(error) throw new Error(error.message);

    const companionCount = data?.length;

    if(companionCount >= limit) {
        return false
    } else {
        return true;
    }
}

// Bookmarks
export const addBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const token = await getSupabaseToken();
  const supabase = createSupabaseClient(token);
  const { data, error } = await supabase.from("bookmarks").insert({
    companion_id: companionId,
    user_id: userId,
  });
  if (error) {
    throw new Error(error.message);
  }
  // Revalidate the path to force a re-render of the page

  revalidatePath(path);
  return data;
};

export const removeBookmark = async (companionId: string, path: string) => {
  const { userId } = await auth();
  if (!userId) return;
  const token = await getSupabaseToken();
  const supabase = createSupabaseClient(token);
  const { data, error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("companion_id", companionId)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  revalidatePath(path);
  return data;
};

// It's almost the same as getUserCompanions, but it's for the bookmarked companions
export const getBookmarkedCompanions = async (userId: string) => {
  const token = await getSupabaseToken();
  const supabase = createSupabaseClient(token);
  const { data, error } = await supabase
    .from("bookmarks")
    .select(`companions:companion_id (*)`) // Notice the (*) to get all the companion data
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  // We don't need the bookmarks data, so we return only the companions
  return data.map(({ companions }) => companions);
};
