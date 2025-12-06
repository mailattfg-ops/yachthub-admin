export async function fetchDashboardStats() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
  const { createClient } = await import("@supabase/supabase-js");

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const users = await supabase.from("users").select("*");

  const bookings = await supabase.from("email_book").select("*");

  const yachts = await supabase.from("fleet").select("*");

  const revenue = await supabase.rpc("get_total_revenue");

  console.log("Dashboard Stats:", users, bookings, yachts, revenue);

  return {
    users: users.data?.length || 0,
    bookings: bookings.data?.length || 0,
    yachts: yachts.data?.length || 0,
    revenue: revenue.data || 0,
  };
}

export async function fetchRecentActivity() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
  const { createClient } = await import("@supabase/supabase-js");

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: latestInquiries, error: inquiryError } = await supabase
    .from("email_book")
    .select("created_at, name")
    .order("created_at", { ascending: false })
    .limit(5);

  if (inquiryError) console.error("Error fetching inquiries:", inquiryError);

  const { data: latestBlogs, error: blogError } = await supabase
    .from("blog")
    .select("inserted_at, title")
    .order("inserted_at", { ascending: false })
    .limit(5);
  if (blogError) console.error("Error fetching blogs:", blogError);

  const { data: latestYachts, error: yachtError } = await supabase
    .from("fleet")
    .select("created_at, name") 
    .order("created_at", { ascending: false })
    .limit(5);
  if (yachtError) console.error("Error fetching yachts:", yachtError);


  const activities: any[] = [];

  latestInquiries?.forEach((item) => {
    activities.push({
      message: `New Inquiry from: ${item.name}`,
      time: item.created_at,
      timestamp: new Date(item.created_at).getTime(),
    });
  });

  latestBlogs?.forEach((item) => {
    activities.push({
      message: `New Blog Post Published: ${item.title}`,
      time: item.inserted_at,
      timestamp: new Date(item.inserted_at).getTime(),
    });
  });

  latestYachts?.forEach((item) => {
    activities.push({
      message: `New Yacht Added: ${item.name}`,
      time: item.created_at,
      timestamp: new Date(item.created_at).getTime(),
    });
  });



  activities.sort((a, b) => b.timestamp - a.timestamp);

  return activities.slice(0, 8);
}
