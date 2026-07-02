/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { slugify } from "@/lib/utils";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetAllPostsQuery,
  useUpdatePostMutation,
} from "@/redux/features/blog/blogApi";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Eye,
  FileText,
  ImageIcon,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const blogSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters."),
  slug: z
    .string()
    .min(3, "Slug is required.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens.",
    ),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters."),
  content: z
    .string()
    .min(30, "Article content must be at least 30 characters."),
  category: z.string().min(2, "Category is required."),
  author: z.string().min(2, "Author is required."),
  date: z.string().min(10, "Publish date is required."),
  readTime: z.string().min(3, "Read time is required."),
  imageUrl: z.string().url("Image URL must be valid."),
  status: z.enum(["Published", "Draft"]),
});

export default function BlogsView() {
  const { data, isLoading } = useGetAllPostsQuery({});
  const posts = useMemo(() => (data?.data || []), [data]);
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [deletePost] = useDeletePostMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: "",
    title: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Styling Guides");
  const [author, setAuthor] = useState("Glassophite Studio");
  const [date, setDate] = useState("2026-07-01");
  const [readTime, setReadTime] = useState("5 min read");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
  );
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const [featured, setFeatured] = useState(false);

  const filteredPosts = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query),
    );
  }, [posts, searchTerm]);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setCategory("Styling Guides");
    setAuthor("Glassophite Studio");
    setDate("2026-07-01");
    setReadTime("5 min read");
    setImageUrl(
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    );
    setStatus("Published");
    setFeatured(false);
    setFormErrors({});
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setAuthor(post.author);
    setDate(post.date);
    setReadTime(post.readTime);
    setImageUrl(post.imageUrl);
    setStatus(post.status);
    setFeatured(post.featured);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSavePost = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      title: title.trim(),
      slug: slugify(slug || title),
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category.trim(),
      author: author.trim(),
      date,
      readTime: readTime.trim(),
      imageUrl: imageUrl.trim(),
      status,
    };

    const validation = blogSchema.safeParse(payload);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) errors[error.path[0].toString()] = error.message;
      });
      setFormErrors(errors);
      toast.error("Blog validation failed", {
        description: "Please correct the highlighted fields.",
      });
      return;
    }

    const slugAlreadyExists = posts.some(
      (post) => post.slug === payload.slug && post.id !== editingPost?.id,
    );
    if (slugAlreadyExists) {
      setFormErrors({
        slug: "This slug is already used by another blog post.",
      });
      toast.error("Duplicate blog slug");
      return;
    }

    if (editingPost) {
      try {
        await updatePost({ id: editingPost.id, ...payload, featured }).unwrap();
        toast.success("Blog post updated", {
          description: `${payload.title} has been saved.`,
        });
      } catch {
        toast.error("Failed to update post");
      }
    } else {
      try {
        await createPost({ ...payload, featured }).unwrap();
        toast.success("Blog post created", {
          description: `${payload.title} is ready for publishing.`,
        });
      } catch (err: any) {
        toast.error("Failed to create post", {
          description: err?.data?.message || "Slug may already exist",
        });
      }
    }
    setIsModalOpen(false);
  };

  const executeDelete = async () => {
    try {
      await deletePost(deleteConfirm.id).unwrap();
      toast.success("Blog post deleted", {
        description: `${deleteConfirm.title} has been removed.`,
      });
    } catch {
      toast.error("Failed to delete post");
    }
    setDeleteConfirm({ isOpen: false, id: "", title: "" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6 text-foreground"
    >
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Blogs
          </h1>
          <p className="text-xs text-muted-foreground">
            Create, update, publish, feature, and remove editorial posts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search title, category, author..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-9 pr-4 py-2 border border-border rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
            />
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-primary/10"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-extrabold">
            Total Posts
          </p>
          <p className="text-2xl font-extrabold mt-1">{posts.length}</p>
        </div>
        <div className="glass-panel rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-extrabold">
            Published
          </p>
          <p className="text-2xl font-extrabold mt-1">
            {posts.filter((post) => post.status === "Published").length}
          </p>
        </div>
        <div className="glass-panel rounded-2xl border border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-extrabold">
            Featured
          </p>
          <p className="text-2xl font-extrabold mt-1">
            {posts.filter((post) => post.featured).length}
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground uppercase tracking-wider font-extrabold text-[10px] border-b border-border">
              <th className="p-4">Article</th>
              <th className="p-4">Category</th>
              <th className="p-4">Author</th>
              <th className="p-4">Status</th>
              <th className="p-4">Featured</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredPosts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-muted-foreground bg-card/25"
                >
                  No blog posts found.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr
                  key={post.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="p-1.5 bg-primary/10 rounded-lg text-primary mt-0.5">
                        <FileText className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <p className="font-extrabold text-foreground">
                          {post.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          /{post.slug}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {post.date} / {post.readTime}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-primary">
                    {post.category}
                  </td>
                  <td className="p-4 text-muted-foreground font-semibold">
                    {post.author}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${post.status === "Published" ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-muted text-muted-foreground border border-border"}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {post.featured ? (
                      <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-1.5">
                      <a
                        href={`/blogs?category=${encodeURIComponent(post.category)}`}
                        className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors cursor-pointer"
                        title="View blog category"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(post)}
                        className="p-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg border border-border transition-colors cursor-pointer"
                        title="Edit blog"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            id: post.id,
                            title: post.title,
                          })
                        }
                        className="p-1.5 bg-muted hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg border border-border transition-colors cursor-pointer"
                        title="Delete blog"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-card text-card-foreground p-6 rounded-2xl relative z-10 space-y-4 border border-border shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto slim-scroll"
            >
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                  <FileText className="w-4 h-4" />
                </span>
                <span>
                  {editingPost ? "Edit Blog Post" : "Create Blog Post"}
                </span>
              </h3>

              <form onSubmit={handleSavePost} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Title" error={formErrors.title}>
                    <input
                      type="text"
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                        if (!editingPost) setSlug(slugify(event.target.value));
                      }}
                      className="dashboard-input"
                      placeholder="Article headline"
                    />
                  </Field>
                  <Field label="Slug" error={formErrors.slug}>
                    <input
                      type="text"
                      value={slug}
                      onChange={(event) => setSlug(slugify(event.target.value))}
                      className="dashboard-input font-mono"
                      placeholder="article-slug"
                    />
                  </Field>
                </div>

                <Field label="Excerpt" error={formErrors.excerpt}>
                  <textarea
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    rows={3}
                    className="dashboard-input resize-none"
                    placeholder="Short public summary"
                  />
                </Field>

                <Field label="Article Content" error={formErrors.content}>
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    rows={5}
                    className="dashboard-input resize-none"
                    placeholder="Main article content"
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Category" error={formErrors.category}>
                    <input
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                      className="dashboard-input"
                    />
                  </Field>
                  <Field label="Author" error={formErrors.author}>
                    <input
                      value={author}
                      onChange={(event) => setAuthor(event.target.value)}
                      className="dashboard-input"
                    />
                  </Field>
                  <Field label="Publish Date" error={formErrors.date}>
                    <input
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="dashboard-input"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_160px] gap-4">
                  <Field label="Image URL" error={formErrors.imageUrl}>
                    <div className="relative">
                      <ImageIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={imageUrl}
                        onChange={(event) => setImageUrl(event.target.value)}
                        className="dashboard-input pl-9"
                      />
                    </div>
                  </Field>
                  <Field label="Read Time" error={formErrors.readTime}>
                    <input
                      value={readTime}
                      onChange={(event) => setReadTime(event.target.value)}
                      className="dashboard-input"
                    />
                  </Field>
                  <Field label="Status" error={formErrors.status}>
                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as "Published" | "Draft")
                      }
                      className="dashboard-input"
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </Field>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  Feature this post on the public blog page
                </label>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground border border-border rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg transition-colors cursor-pointer shadow-md shadow-primary/15"
                  >
                    {editingPost ? "Save Changes" : "Save Blog"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteDialog
        isOpen={deleteConfirm.isOpen}
        title="Confirm Blog Deletion"
        body={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: "", title: "" })}
        onDelete={executeDelete}
      />
    </motion.div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="font-bold text-muted-foreground">{label}</label>
      {children}
      {error && (
        <span className="text-red-500 text-[10px] block mt-0.5">{error}</span>
      )}
    </div>
  );
}

function DeleteDialog({
  isOpen,
  title,
  body,
  onCancel,
  onDelete,
}: {
  isOpen: boolean;
  title: string;
  body: string;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card text-card-foreground border border-border p-6 rounded-2xl relative z-10 max-w-sm w-full space-y-4 shadow-xl text-xs"
          >
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            <p className="text-muted-foreground">{body}</p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={onCancel}
                className="px-3 py-2 bg-background hover:bg-muted text-foreground font-semibold rounded-lg border border-border transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors cursor-pointer shadow-md shadow-red-600/10"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
