import CommunityFeed from "@/components/community/CommunityFeed";

export default function CommunityPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Community</h1>
        <p className="text-gray-400 text-sm mt-1">
          AI-generated mashups created by the community
        </p>
      </div>
      <CommunityFeed />
    </main>
  );
}
