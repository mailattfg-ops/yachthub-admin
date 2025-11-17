// import { createClient } from '@supabase/supabase-js'

// // ✅ Server-Side Rendering
// export async function getServerSideProps({ params }) {
//   // Create Supabase client (server-side only)
//   const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

//   // Fetch a single post by its ID
//   const { data: post, error } = await supabase
//     .from('posts')
//     .select('*')
//     .eq('id', params.id)
//     .single()

//   if (error || !post) {
//     return { notFound: true } // 404 if not found
//   }

//   return { props: { post } }
// }