import { createClient } from "@supabase/supabase-js";


export async function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase URL or anon key is not set");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    return supabase;
}

export async function updateGenerationCount(fid: number) {
    const supabase = await getSupabaseClient();
    try {
        await supabase.rpc('increment_user_image_count', {
            user_fid: fid
        });
    } catch (error) {
        console.error("Error updating generation count:", error);
    }
}

export async function getTotalImagesGenerated(): Promise<number> {
    const supabase = await getSupabaseClient();
    try {
        const { data, error } = await supabase
            .from('user_image_counts')
            .select('image_count')
            .then(result => {
                if (result.error) throw result.error;

                // Sum up all image counts
                return {
                    data: result.data?.reduce((sum, row) => sum + row.image_count, 0) || 0,
                    error: null
                };
            });

        if (error) {
            console.error("Error fetching total image count:", error);
            return 0;
        }

        return data;
    } catch (error) {
        console.error("Error fetching total image count:", error);
        return 0;
    }
}
