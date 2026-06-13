import React from 'react';

export interface BlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    publishDate: Date;
    author: string;
    tags: string[];
    image?: string;
    draft?: boolean;
  };
}

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.data.publishDate).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article
      className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-200 ease-in-out cursor-pointer focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2 motion-reduce:transition-none ${
        featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
    >
      {/* Color accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-500 to-red-600" />

      <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.data.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2
          className={`font-bold text-gray-900 mb-3 line-clamp-2 leading-snug ${
            featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          <a
            href={`/blog/${post.slug}`}
            className="hover:text-orange-600 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded"
          >
            {post.data.title}
          </a>
        </h2>

        {/* Description */}
        <p
          className={`text-gray-600 mb-5 leading-relaxed ${
            featured ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'
          }`}
        >
          {post.data.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              E
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">{post.data.author}</p>
              <p className="text-xs text-gray-400">{formattedDate}</p>
            </div>
          </div>

          <a
            href={`/blog/${post.slug}`}
            className="text-sm text-orange-600 font-semibold hover:text-orange-700 transition-colors duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded whitespace-nowrap"
            aria-label={`Đọc thêm: ${post.data.title}`}
          >
            Đọc thêm →
          </a>
        </div>
      </div>
    </article>
  );
}

export default BlogCard;
