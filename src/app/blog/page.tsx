"use client";

import { useEffect, useState, Suspense, FormEvent } from "react";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { Form } from "../forms/form";
import * as logos from "@/assets/logos";
import { createClient } from "@supabase/supabase-js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Trash2, Pencil } from "lucide-react";

export default function TablesPage() {
  const [addOpen, setAdd] = useState(false);
  const [editOpen, setEdit] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectData, setSelectData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  const fetchPost = async () => {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
    console.log("Supabase ENV:", SUPABASE_URL, SUPABASE_KEY);

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    setSupabase(supabase);
    console.log("Supabase client:", supabase);

    const { data, error } = await supabase.from("blog").select("*");

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      console.log("data", data);
      setData(data);
      setLoading(false);
      setAdd(false);
    }
  };

  useEffect(() => {
    if (!limit) {
      setLimit(true);
    }
    setLoading(true);

    fetchPost();
  }, []);

  async function handleFileUpload(e: any) {
    e.preventDefault(); // stop page reload
    console.log("e.target", e.target);

    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      console.error("No file selected");
      return;
    }
    console.log("fileInput", fileInput);

    const formData = new FormData(e.target);

    const title = formData.get("Title");
    const desc = formData.get("Description");
    const date = formData.get("Date");
    const slug = formData.get("Slug");
    const alt = formData.get("alt_tab");

    if (!file) {
      alert("Please select a file!");
      return;
    }

    try {
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("yacht-bucket")
        .upload(`files/${file.name}`, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("yacht-bucket")
        .getPublicUrl(`files/${file.name}`);

      const fileUrl = publicUrlData.publicUrl;
      console.log("fileUrl", fileUrl);

      // 4️⃣ Insert metadata into your table
      const { error: insertError } = await supabase
        .from("blog")
        .insert([{ title, desc, date, slug, img: fileUrl, alt_tab: alt }]);

      if (insertError) throw insertError;
      fetchPost();
      setAdd(false);
      alert("✅ File uploaded and data inserted!");
    } catch (err: any) {
      console.error(" Upload failed:", err.message);
      alert("Upload failed: " + err.message);
    }
  }

  async function editBlog(e: any) {
    const formData = new FormData(e.target);
    const fileInput = e.target.querySelector('input[type="file"]');
    let fileUrl = selectData.img;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput?.files?.[0];
      if (!file) {
        console.error("No file selected");
        // return;
      } else {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("yacht-bucket")
          .upload(`files/${file.name}`, file, { upsert: true });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("yacht-bucket")
          .getPublicUrl(`files/${file.name}`);

        fileUrl = publicUrlData.publicUrl;
        console.log("fileUrl", fileUrl);
      }
    }

    const title = formData.get("Title");
    const desc = formData.get("Description");
    const date = formData.get("Date");
    const alt = formData.get("alt_tab");
    const slug = formData.get("Slug");
    const { data, error } = await supabase
      .from("blog")
      .update({ title, desc, date, slug, img: fileUrl, alt_tab: alt })
      .eq("id", Number(selectData.id));

    console.log("data", data);

    if (error) {
      console.error(error);
    } else {
      console.log("Updated row:", data);
    }

    fetchPost();
  }

  async function deleteBlog(id: any) {
    const { data, error } = await supabase
      .from("blog")
      .delete()
      .eq("id", Number(id));

    if (error) console.error(error);
    else console.log("Deleted row:", data);
    fetchPost();
  }

  return (
    <>
      <button
        className="my-6 flex w-fit justify-center rounded-lg bg-primary p-[13px] px-8 py-2 font-medium text-white hover:bg-opacity-90"
        onClick={() => {
          // if (data.length ) {
          // }
          setAdd(!addOpen);
        }}
      >
        {addOpen ? "Cancel" : "Add Blog"}
      </button>

      {addOpen && (
        <div className="mb-6 flex flex-col gap-9">
          <ShowcaseSection title="Blog" className="!p-6.5">
            <form
              action="#"
              onSubmit={(event) => {
                editOpen ? editBlog(event) : handleFileUpload(event);
              }}
            >
              <InputGroup
                label="Title"
                type="text"
                value={selectData.title}
                placeholder="Enter Title"
                className="mb-4.5"
                required
                handleChange={(e) =>
                  setSelectData({ ...selectData, title: e.target.value })
                }
              />

              <InputGroup
                label="Description"
                type="text"
                value={selectData.desc}
                placeholder="Enter Description"
                className="mb-4.5"
                required
                handleChange={(e) =>
                  setSelectData({ ...selectData, desc: e.target.value })
                }
              />

              <InputGroup
                label="Date"
                type="text"
                value={selectData.date}
                placeholder="Enter Date"
                className="mb-4.5"
                required
                handleChange={(e) =>
                  setSelectData({ ...selectData, date: e.target.value })
                }
              />

              <InputGroup
                label="Slug"
                type="text"
                placeholder="Enter Slug"
                value={selectData.slug}
                className="mb-4.5"
                required
                handleChange={(e) =>
                  setSelectData({ ...selectData, slug: e.target.value })
                }
              />

              <InputGroup
                label="Image Alt Text"
                name="alt_tab"
                type="text"
                placeholder="Enter Alt"
                value={selectData.alt_tab}
                className="mb-4.5"
                required
                handleChange={(e) =>
                  setSelectData({ ...selectData, alt_tab: e.target.value })
                }
              />

              {selectData?.img && (
                <div>
                  <Image
                    src={selectData.img}
                    alt="Blog Image"
                    width={100}
                    height={200}
                  />
                </div>
              )}
              <InputGroup
                label="Image"
                type="file"
                placeholder="Enter Image"
                className="mb-4.5"
                required={!editOpen}
              />

              <button
                className="mt-6 flex w-full justify-center rounded-lg bg-primary p-[13px] font-medium text-white hover:bg-opacity-90"
                type="submit"
              >
                {editOpen ? "Update" : "Submit"}
              </button>
            </form>
          </ShowcaseSection>
        </div>
      )}

      <div className="space-y-10">
        {loading ? (
          <TopChannelsSkeleton />
        ) : (
          <Suspense fallback={<TopChannelsSkeleton />}>
            <div className="grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
              <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
                Top Channels
              </h2>

              <Table className="overflow-x-auto">
                <TableHeader>
                  <TableRow className="border-none uppercase [&>th]:text-center">
                    <TableHead className="!text-left">Action</TableHead>
                    <TableHead className="!text-left">Title</TableHead>
                    <TableHead className="!text-left">Description</TableHead>
                    <TableHead className="!text-left">Date</TableHead>
                    <TableHead className="!text-left">Alt</TableHead>
                    <TableHead className="!text-left">Image</TableHead>
                    <TableHead className="!text-left">Slug</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.map((channel, i) => (
                    <TableRow
                      className="text-center text-base font-medium text-dark dark:text-white"
                      key={channel.title + i}
                    >
                      <TableCell className="flex w-fit gap-4 truncate">
                        <button onClick={() => deleteBlog(channel.id)}>
                          <Trash2 />
                        </button>
                        <button
                          onClick={() => {
                            setEdit(true);
                            setAdd(true);
                            setSelectData(channel);
                          }}
                        >
                          <Pencil />
                        </button>
                      </TableCell>

                      <TableCell className="max-w-[50px] truncate">
                        {channel.title}
                      </TableCell>

                      <TableCell className="max-w-[50px] truncate">
                        {channel.desc}
                      </TableCell>

                      <TableCell>{channel.date}</TableCell>
                      <TableCell className="max-w-[50px] truncate">
                        {channel.alt_tab}
                      </TableCell>

                      <TableCell className="max-w-[50px] truncate">
                        {channel.img}
                      </TableCell>

                      <TableCell className="max-w-[50px] truncate">
                        {channel.slug}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Suspense>
        )}
      </div>
    </>
  );
}
