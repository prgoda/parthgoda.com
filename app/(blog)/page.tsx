import { getAllPosts, getFeaturedPost } from "@/lib/posts";
import HeroPost from "@/components/home/HeroPost";
import PostGrid from "@/components/home/PostGrid";
import Divider from "@/components/ui/Divider";

export default function HomePage() {
  const featured = getFeaturedPost();
  const allPosts = getAllPosts();
  const remainingPosts = featured
    ? allPosts.filter((p) => p.slug !== featured.slug)
    : allPosts;

  return (
    <>
      {featured && <HeroPost post={featured} />}
      {remainingPosts.length > 0 && (
        <>
          <Divider className="mb-10" />
          <PostGrid posts={remainingPosts} />
        </>
      )}
      {!featured && allPosts.length === 0 && (
        <div className="text-center py-32 text-zinc-400">
          <p className="font-serif text-3xl font-bold text-zinc-300 mb-4">Coming Soon</p>
          <p className="text-lg">The first post is being drafted.</p>
        </div>
      )}
    </>
  );
}
